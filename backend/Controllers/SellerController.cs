using Backend.Contracts;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/seller")]
public class SellerController(AppDbContext db) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsSeller(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var user = await db.Users.FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is null)
            return Unauthorized();

        user.Role = UserRole.seller;
        user.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Đăng ký seller thành công." });
    }

    [HttpGet("products")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetSellerProducts(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var products = await db.Products
            .AsNoTracking()
            .Where(x => db.Shops.Any(s => s.Id == x.ShopId && s.OwnerId == userId))
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.Price,
                x.StockQuantity,
                x.SoldQuantity,
                x.Status,
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateSellerProduct([FromBody] CreateSellerProductRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var shop = await db.Shops.FirstOrDefaultAsync(x => x.OwnerId == userId, cancellationToken);
        if (shop is null)
            return BadRequest(new { message = "Bạn chưa có shop. Hãy đăng ký shop trước." });

        var slugExists = await db.Products.AnyAsync(x => x.Slug == body.Slug, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug sản phẩm đã tồn tại." });

        var now = DateTime.UtcNow;
        var product = new Product
        {
            ShopId = shop.Id,
            CategoryId = body.CategoryId,
            Name = body.Name,
            Slug = body.Slug,
            Description = body.Description,
            Price = body.Price,
            OriginalPrice = body.OriginalPrice,
            StockQuantity = body.StockQuantity,
            SoldQuantity = 0,
            Rating = 0,
            TotalReviews = 0,
            Status = ProductStatus.active,
            CreatedAt = now,
            UpdatedAt = now,
        };

        db.Products.Add(product);
        shop.TotalProducts += 1;
        shop.UpdatedAt = now;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Thêm sản phẩm thành công.", product.Id });
    }

    [HttpGet("orders")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetSellerOrders(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var orders = await db.Orders
            .AsNoTracking()
            .Where(x => db.Shops.Any(s => s.Id == x.ShopId && s.OwnerId == userId))
            .OrderByDescending(x => x.OrderedAt)
            .Select(x => new
            {
                x.Id,
                x.OrderNumber,
                x.BuyerId,
                x.TotalAmount,
                x.PaymentStatus,
                x.Status,
                x.OrderedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(orders);
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var totalRevenue = await db.Orders
            .AsNoTracking()
            .Where(x => db.Shops.Any(s => s.Id == x.ShopId && s.OwnerId == userId) && x.PaymentStatus == PaymentStatus.paid)
            .SumAsync(x => (decimal?)x.TotalAmount, cancellationToken) ?? 0;

        var monthly = await db.Orders
            .AsNoTracking()
            .Where(x => db.Shops.Any(s => s.Id == x.ShopId && s.OwnerId == userId) && x.PaymentStatus == PaymentStatus.paid)
            .GroupBy(x => new { x.OrderedAt.Year, x.OrderedAt.Month })
            .Select(g => new
            {
                year = g.Key.Year,
                month = g.Key.Month,
                revenue = g.Sum(x => x.TotalAmount),
            })
            .OrderByDescending(x => x.year)
            .ThenByDescending(x => x.month)
            .ToListAsync(cancellationToken);

        return Ok(new { totalRevenue, monthly });
    }
}
