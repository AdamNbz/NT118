using Backend.Contracts;
using Backend.Data;
using Backend.Hubs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/messages")]
public class MessagesController(
    AppDbContext db,
    INotificationRealtimeService realtimeNotifications,
    IHubContext<NotificationHub> hubContext) : ControllerBase
{
    // ── GET /api/messages/conversations ─────────────────────────────
    [HttpGet("conversations")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetConversations(CancellationToken ct)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        // Get all messages involving this user
        var conversations = await db.Messages
            .AsNoTracking()
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Select(g => new
            {
                PartnerId = g.Key,
                LastMessage = g.OrderByDescending(m => m.SentAt).First().Content,
                LastMessageTime = g.OrderByDescending(m => m.SentAt).First().SentAt,
                UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead),
            })
            .OrderByDescending(c => c.LastMessageTime)
            .ToListAsync(ct);

        // Fetch partner user info
        var partnerIds = conversations.Select(c => c.PartnerId).ToList();
        var users = await db.Users
            .AsNoTracking()
            .Where(u => partnerIds.Contains(u.Id))
            .Select(u => new { u.Id, u.Username })
            .ToListAsync(ct);

        var profiles = await db.Set<UserProfile>()
            .AsNoTracking()
            .Where(p => partnerIds.Contains(p.UserId))
            .Select(p => new { p.UserId, p.FullName, p.AvatarUrl })
            .ToListAsync(ct);

        var userMap = users.ToDictionary(u => u.Id);
        var profileMap = profiles.ToDictionary(p => p.UserId);

        var result = conversations.Select(c =>
        {
            userMap.TryGetValue(c.PartnerId, out var user);
            profileMap.TryGetValue(c.PartnerId, out var profile);
            return new
            {
                c.PartnerId,
                PartnerName = profile?.FullName ?? user?.Username ?? $"User #{c.PartnerId}",
                PartnerAvatar = profile?.AvatarUrl,
                c.LastMessage,
                c.LastMessageTime,
                c.UnreadCount,
            };
        }).ToList();

        return Ok(result);
    }

    // ── GET /api/messages?receiverId= ──────────────────────────────
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<object>>> GetMessages(
        [FromQuery] long? receiverId,
        [FromQuery] int limit = 100,
        CancellationToken cancellationToken = default)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var query = db.Messages
            .AsNoTracking()
            .Where(x => x.SenderId == userId || x.ReceiverId == userId);

        if (receiverId.HasValue)
        {
            query = query.Where(x =>
                (x.SenderId == userId && x.ReceiverId == receiverId.Value)
                || (x.SenderId == receiverId.Value && x.ReceiverId == userId));
        }

        var messages = await query
            .OrderByDescending(x => x.SentAt)
            .Take(limit)
            .Select(x => new
            {
                x.Id,
                x.SenderId,
                x.ReceiverId,
                x.OrderId,
                x.MessageType,
                x.Content,
                x.AttachmentUrl,
                x.IsRead,
                x.SentAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(messages);
    }

    // ── POST /api/messages ─────────────────────────────────────────
    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        if (body.ReceiverId == userId)
            return BadRequest(new { message = "Không thể gửi tin nhắn cho chính bạn." });

        var receiverExists = await db.Users.AnyAsync(x => x.Id == body.ReceiverId, cancellationToken);
        if (!receiverExists)
            return NotFound(new { message = "Không tìm thấy người nhận." });

        var message = new Message
        {
            SenderId = userId,
            ReceiverId = body.ReceiverId,
            OrderId = body.OrderId,
            MessageType = body.MessageType,
            Content = body.Content,
            AttachmentUrl = body.AttachmentUrl,
            IsRead = false,
            SentAt = DateTime.UtcNow,
        };

        db.Messages.Add(message);
        await db.SaveChangesAsync(cancellationToken);

        // Push real-time message event to receiver via SignalR
        var messagePayload = new
        {
            message.Id,
            message.SenderId,
            message.ReceiverId,
            message.Content,
            message.MessageType,
            message.AttachmentUrl,
            message.SentAt,
        };

        var receiverGroup = NotificationHub.BuildUserGroup(body.ReceiverId.ToString());
        await hubContext.Clients.Group(receiverGroup)
            .SendAsync("message.received", messagePayload, cancellationToken);

        // Also create a notification
        var notification = new Notification
        {
            UserId = body.ReceiverId,
            Type = "message",
            Title = "Bạn có tin nhắn mới",
            MessageText = body.Content,
            Data = $"{{\"senderId\":{userId},\"messageId\":{message.Id}}}",
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
        };

        db.Notifications.Add(notification);
        await db.SaveChangesAsync(cancellationToken);

        await realtimeNotifications.NotifyUserAsync(body.ReceiverId, new
        {
            notification.Id,
            notification.Type,
            notification.Title,
            message = notification.MessageText,
            notification.Data,
            notification.IsRead,
            notification.CreatedAt,
        }, cancellationToken);

        return Ok(new { message = "Gửi tin nhắn thành công.", messageId = message.Id });
    }

    // ── PATCH /api/messages/{receiverId}/read ──────────────────────
    [HttpPatch("{receiverId:long}/read")]
    public async Task<IActionResult> MarkConversationRead(long receiverId, CancellationToken ct)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var updated = await db.Messages
            .Where(m => m.SenderId == receiverId && m.ReceiverId == userId && !m.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsRead, true), ct);

        return Ok(new { message = "Đã đánh dấu đã đọc.", updated });
    }
}
