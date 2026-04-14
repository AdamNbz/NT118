using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
public class FavoritesController(AppDbContext db) : ControllerBase
{
    [Authorize]
    [HttpGet("api/favorites")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetMyFavorites(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var rows = await db.Favorites
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.ProductId,
                ProductName = db.Products.Where(p => p.Id == x.ProductId).Select(p => p.Name).FirstOrDefault(),
                x.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(rows);
    }

    [Authorize]
    [HttpPost("api/products/{id:long}/favorite")]
    public async Task<IActionResult> AddFavorite(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var productExists = await db.Products.AnyAsync(x => x.Id == id, cancellationToken);
        if (!productExists)
            return NotFound(new { message = "Không tìm thấy sản phẩm." });

        var exists = await db.Favorites.AnyAsync(x => x.UserId == userId && x.ProductId == id, cancellationToken);
        if (!exists)
        {
            db.Favorites.Add(new Favorite
            {
                UserId = userId,
                ProductId = id,
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync(cancellationToken);
        }

        return Ok(new { message = "Đã thêm vào yêu thích." });
    }

    [Authorize]
    [HttpDelete("api/products/{id:long}/favorite")]
    public async Task<IActionResult> RemoveFavorite(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var item = await db.Favorites.FirstOrDefaultAsync(x => x.UserId == userId && x.ProductId == id, cancellationToken);
        if (item is null)
            return NoContent();

        db.Favorites.Remove(item);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
