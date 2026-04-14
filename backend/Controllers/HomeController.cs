using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/home")]
public class HomeController(AppDbContext db) : ControllerBase
{
    [HttpGet("banners")]
    public ActionResult<IReadOnlyList<object>> GetBanners() =>
        Ok(new[]
        {
            new { id = 1, title = "Mega Sale", imageUrl = "https://picsum.photos/1200/480?1", deepLink = "/flash-sale" },
            new { id = 2, title = "Free Shipping", imageUrl = "https://picsum.photos/1200/480?2", deepLink = "/vouchers" },
            new { id = 3, title = "Top Brands", imageUrl = "https://picsum.photos/1200/480?3", deepLink = "/brands" },
        });

    [HttpGet("popup-ads")]
    public ActionResult<object> GetPopupAds() =>
        Ok(new
        {
            id = 1,
            title = "Voucher 50K cho đơn đầu tiên",
            imageUrl = "https://picsum.photos/600/800?popup",
            cta = "Nhận ngay",
        });

    [HttpGet("flash-sale")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetFlashSale(CancellationToken cancellationToken)
    {
        var products = await db.Products
            .AsNoTracking()
            .Where(x => x.Status == ProductStatus.active && x.StockQuantity > 0)
            .OrderByDescending(x => x.SoldQuantity)
            .ThenByDescending(x => x.Rating)
            .Take(20)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Price,
                x.OriginalPrice,
                x.SoldQuantity,
                x.Rating,
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpGet("recommended-products")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetRecommendedProducts(CancellationToken cancellationToken)
    {
        var products = await db.Products
            .AsNoTracking()
            .Where(x => x.Status == ProductStatus.active)
            .OrderByDescending(x => x.Rating)
            .ThenByDescending(x => x.TotalReviews)
            .ThenByDescending(x => x.SoldQuantity)
            .Take(20)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Price,
                x.OriginalPrice,
                x.Rating,
                x.TotalReviews,
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }
}
