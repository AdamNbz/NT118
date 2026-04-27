using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<object>>> GetNotifications([FromQuery] bool unreadOnly = false, CancellationToken cancellationToken = default)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var query = db.Notifications
            .AsNoTracking()
            .Where(x => x.UserId == userId);

        if (unreadOnly)
            query = query.Where(x => !x.IsRead);

        var notifications = await query
            .OrderByDescending(x => x.CreatedAt)
            .Take(100)
            .Select(x => new
            {
                x.Id,
                x.Type,
                x.Title,
                message = x.MessageText,
                x.Data,
                x.IsRead,
                x.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(notifications);
    }

    [HttpPatch("{id:long}/read")]
    public async Task<IActionResult> MarkAsRead(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var notification = await db.Notifications
            .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);

        if (notification is null)
            return NotFound();

        notification.IsRead = true;
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Đã đánh dấu đã đọc." });
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        await db.Notifications
            .Where(x => x.UserId == userId && !x.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.IsRead, true), cancellationToken);

        return Ok(new { message = "Đã đánh dấu tất cả đã đọc." });
    }

    [HttpDelete("cleanup")]
    public async Task<IActionResult> CleanupInvalidNotifications(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var deleted = await db.Database.ExecuteSqlRawAsync(
            "DELETE FROM notifications WHERE user_id = {0} AND data IS NOT NULL AND data::text LIKE '%\"orderId\": 0%'",
            userId, cancellationToken);

        return Ok(new { message = $"Đã xóa {deleted} thông báo không hợp lệ.", deleted });
    }
}
