using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize(Roles = "admin")]
[Route("api/admin")]
public class AdminController(AppDbContext db) : ControllerBase
{
    [HttpGet("users")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetUsers(CancellationToken cancellationToken)
    {
        var users = await db.Users
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(200)
            .Select(x => new
            {
                x.Id,
                x.Username,
                x.Email,
                x.Phone,
                x.Role,
                x.Status,
                x.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(users);
    }

    [HttpGet("shops")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetShops(CancellationToken cancellationToken)
    {
        var shops = await db.Shops
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Take(200)
            .Select(x => new
            {
                x.Id,
                x.OwnerId,
                x.Name,
                x.Slug,
                x.Status,
                x.IsVerified,
                x.Rating,
                x.TotalProducts,
                x.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Ok(shops);
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        var totalUsers = await db.Users.CountAsync(cancellationToken);
        var totalShops = await db.Shops.CountAsync(cancellationToken);
        var totalProducts = await db.Products.CountAsync(cancellationToken);
        var totalOrders = await db.Orders.CountAsync(cancellationToken);
        var totalRevenue = await db.Orders
            .Where(x => x.PaymentStatus == PaymentStatus.paid)
            .SumAsync(x => (decimal?)x.TotalAmount, cancellationToken) ?? 0;

        return Ok(new
        {
            totalUsers,
            totalShops,
            totalProducts,
            totalOrders,
            totalRevenue,
        });
    }
}
