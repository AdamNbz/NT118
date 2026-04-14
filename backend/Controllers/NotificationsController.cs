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
}
