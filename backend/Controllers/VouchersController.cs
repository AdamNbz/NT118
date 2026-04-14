using Backend.Contracts;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/vouchers")]
public class VouchersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<object>>> GetVouchers(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var vouchers = await db.Vouchers
            .AsNoTracking()
            .Where(x => x.IsActive && x.StartDate <= now && x.EndDate >= now)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.Name,
                x.Description,
                x.DiscountType,
                x.DiscountValue,
                x.MinOrderValue,
                x.MaxDiscount,
                x.StartDate,
                x.EndDate,
                x.UsageLimit,
                x.UsedCount,
            })
            .ToListAsync(cancellationToken);

        return Ok(vouchers);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var exists = await db.Vouchers.AnyAsync(x => x.Code == body.Code, cancellationToken);
        if (exists)
            return Conflict(new { message = "Mã voucher đã tồn tại." });

        var voucher = new Voucher
        {
            Code = body.Code,
            Name = body.Name,
            Description = body.Description,
            DiscountType = body.DiscountType,
            DiscountValue = body.DiscountValue,
            MinOrderValue = body.MinOrderValue,
            MaxDiscount = body.MaxDiscount,
            UsageLimit = body.UsageLimit,
            UsedCount = 0,
            StartDate = body.StartDate,
            EndDate = body.EndDate,
            IsActive = body.IsActive,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow,
        };

        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { voucher.Id, message = "Tạo voucher thành công." });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:long}")]
    public async Task<IActionResult> UpdateVoucher(long id, [FromBody] UpdateVoucherRequest body, CancellationToken cancellationToken)
    {
        var voucher = await db.Vouchers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (voucher is null)
            return NotFound();

        voucher.Name = body.Name;
        voucher.Description = body.Description;
        voucher.DiscountType = body.DiscountType;
        voucher.DiscountValue = body.DiscountValue;
        voucher.MinOrderValue = body.MinOrderValue;
        voucher.MaxDiscount = body.MaxDiscount;
        voucher.UsageLimit = body.UsageLimit;
        voucher.StartDate = body.StartDate;
        voucher.EndDate = body.EndDate;
        voucher.IsActive = body.IsActive;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Cập nhật voucher thành công." });
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteVoucher(long id, CancellationToken cancellationToken)
    {
        var voucher = await db.Vouchers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (voucher is null)
            return NotFound();

        db.Vouchers.Remove(voucher);
        await db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [Authorize]
    [HttpPost("{id:long}/claim")]
    public async Task<IActionResult> ClaimVoucher(long id, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var voucher = await db.Vouchers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (voucher is null)
            return NotFound();

        var now = DateTime.UtcNow;
        if (!voucher.IsActive || voucher.StartDate > now || voucher.EndDate < now)
            return BadRequest(new { message = "Voucher không còn hiệu lực." });

        var hasClaimed = await db.UserVouchers.AnyAsync(x => x.UserId == userId && x.VoucherId == id && !x.IsUsed, cancellationToken);
        if (hasClaimed)
            return Ok(new { message = "Bạn đã lưu voucher này." });

        db.UserVouchers.Add(new UserVoucher
        {
            UserId = userId,
            VoucherId = id,
            ShopVoucherId = null,
            IsUsed = false,
            UsedAt = null,
            ExpiresAt = voucher.EndDate,
            CreatedAt = now,
        });
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Lưu voucher thành công." });
    }
}
