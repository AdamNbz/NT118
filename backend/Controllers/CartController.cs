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
[Route("api/cart")]
public class CartController(IUserManagementService users, AppDbContext db) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<UserCartItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IReadOnlyList<UserCartItemResponse>>> GetMyCart(CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        return Ok(await users.GetCartItemsAsync(userId, cancellationToken));
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        if (body.Quantity <= 0)
            return BadRequest(new { message = "Số lượng phải lớn hơn 0." });

        var product = await db.Products.FirstOrDefaultAsync(x => x.Id == body.ProductId, cancellationToken);
        if (product is null)
            return NotFound(new { message = "Không tìm thấy sản phẩm." });

        var item = await db.CartItems.FirstOrDefaultAsync(
            x => x.UserId == userId && x.ProductId == body.ProductId && x.VariantId == body.VariantId,
            cancellationToken);

        if (item is null)
        {
            db.CartItems.Add(new CartItem
            {
                UserId = userId,
                ProductId = body.ProductId,
                VariantId = body.VariantId,
                Quantity = body.Quantity,
                AddedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
        }
        else
        {
            item.Quantity += body.Quantity;
            item.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đã thêm vào giỏ hàng." });
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> UpdateCartItem(long id, [FromBody] UpdateCartItemRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        if (body.Quantity <= 0)
            return BadRequest(new { message = "Số lượng phải lớn hơn 0." });

        var item = await db.CartItems.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
        if (item is null)
            return NotFound();

        item.Quantity = body.Quantity;
        item.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Cập nhật giỏ hàng thành công." });
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteCartItem(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var item = await db.CartItems.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, cancellationToken);
        if (item is null)
            return NoContent();

        db.CartItems.Remove(item);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
