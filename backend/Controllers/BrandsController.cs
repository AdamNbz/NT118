using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/brands")]
public class BrandsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<object>>> GetBrands(CancellationToken cancellationToken)
    {
        var brands = await db.Shops
            .AsNoTracking()
            .Where(x => x.Status == ShopStatus.active)
            .OrderByDescending(x => x.Rating)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.LogoUrl,
                x.Rating,
            })
            .ToListAsync(cancellationToken);

        return Ok(brands);
    }

    [HttpGet("{id:long}/products")]
    public async Task<ActionResult<IReadOnlyList<object>>> GetProductsByBrand(long id, CancellationToken cancellationToken)
    {
        var products = await db.Products
            .AsNoTracking()
            .Where(x => x.ShopId == id && x.Status == ProductStatus.active)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Name,
                x.Slug,
                x.Price,
                x.OriginalPrice,
                x.Rating,
            })
            .ToListAsync(cancellationToken);

        return Ok(products);
    }
}
