using Backend.Contracts;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/shops")]
public class ShopsController(AppDbContext db) : ControllerBase
{
    [Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> RegisterShop([FromBody] CreateShopRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var hasShop = await db.Shops.AnyAsync(x => x.OwnerId == userId, cancellationToken);
        if (hasShop)
            return Conflict(new { message = "Bạn đã có shop." });

        var slugExists = await db.Shops.AnyAsync(x => x.Slug == body.Slug, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug shop đã tồn tại." });

        var now = DateTime.UtcNow;
        var shop = new Shop
        {
            OwnerId = userId,
            Name = body.Name,
            Slug = body.Slug,
            Description = body.Description,
            LogoUrl = body.LogoUrl,
            CoverImageUrl = body.CoverImageUrl,
            Address = body.Address,
            Phone = body.Phone,
            Email = body.Email,
            Rating = 0,
            TotalReviews = 0,
            TotalProducts = 0,
            Status = ShopStatus.active,
            IsVerified = false,
            CreatedAt = now,
            UpdatedAt = now,
        };

        db.Shops.Add(shop);

        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is not null && user.Role == UserRole.buyer)
            user.Role = UserRole.seller;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đăng ký cửa hàng thành công.", shop.Id, shop.Name });
    }

    [Authorize]
    [HttpPost("{id:long}/follow")]
    public async Task<IActionResult> FollowShop(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var shopExists = await db.Shops.AnyAsync(x => x.Id == id, cancellationToken);
        if (!shopExists)
            return NotFound(new { message = "Không tìm thấy shop." });

        var exists = await db.Follows.AnyAsync(x => x.UserId == userId && x.ShopId == id, cancellationToken);
        if (!exists)
        {
            db.Follows.Add(new Follow
            {
                UserId = userId,
                ShopId = id,
                CreatedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync(cancellationToken);
        }

        return Ok(new { message = "Đã follow shop." });
    }

    [Authorize]
    [HttpDelete("{id:long}/follow")]
    public async Task<IActionResult> UnfollowShop(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var shopExists = await db.Shops.AnyAsync(x => x.Id == id, cancellationToken);
        if (!shopExists)
            return NotFound(new { message = "Không tìm thấy shop." });

        var follow = await db.Follows.FirstOrDefaultAsync(x => x.UserId == userId && x.ShopId == id, cancellationToken);
        if (follow is not null)
        {
            db.Follows.Remove(follow);
            await db.SaveChangesAsync(cancellationToken);
        }

        return NoContent();
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyShop(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var shop = await db.Shops.FirstOrDefaultAsync(x => x.OwnerId == userId, cancellationToken);
        if (shop is null)
            return NotFound(new { message = "Bạn chưa có shop." });

        return Ok(shop);
    }

    [Authorize]
    [HttpGet("followed")]
    public async Task<IActionResult> GetFollowedShops(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var shops = await db.Follows
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.Shop)
            .Select(x => new ShopResponse(
                x.Id,
                x.Name,
                x.Slug,
                x.Description,
                x.LogoUrl,
                x.CoverImageUrl,
                x.Address,
                x.Rating,
                x.TotalReviews,
                x.TotalProducts,
                x.IsVerified,
                x.CreatedAt))
            .ToListAsync(cancellationToken);

        return Ok(shops);
    }

    [Authorize]
    [HttpGet("{id:long}/follow-status")]
    public async Task<IActionResult> GetFollowStatus(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var follow = await db.Follows
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId && x.ShopId == id, cancellationToken);

        return Ok(new FollowStatusResponse(follow != null, follow?.CreatedAt));
    }
}

