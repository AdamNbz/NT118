using Backend.Contracts;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/messages")]
public class MessagesController(AppDbContext db, INotificationRealtimeService realtimeNotifications) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<object>>> GetMessages([FromQuery] long? receiverId, CancellationToken cancellationToken)
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
            .Take(100)
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
}
