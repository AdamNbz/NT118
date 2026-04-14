using System.Text.Json;
using Backend.Contracts;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api/payments")]
public class PaymentsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest body, CancellationToken cancellationToken)
    {
        if (!this.TryGetCurrentUserId(out var userId))
            return Unauthorized();

        var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == body.OrderId && x.BuyerId == userId, cancellationToken);
        if (order is null)
            return NotFound(new { message = "Không tìm thấy đơn hàng." });

        var payment = new Payment
        {
            OrderId = body.OrderId,
            PaymentMethod = body.PaymentMethod,
            TransactionId = $"PAY-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            Amount = body.Amount,
            Currency = body.Currency,
            Status = PaymentStatus.pending,
            PaymentData = JsonSerializer.Serialize(new { source = "manual", createdBy = userId }),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        db.Payments.Add(payment);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Tạo thanh toán thành công.", payment.Id, payment.TransactionId });
    }

    [HttpPost("apply-voucher")]
    public async Task<IActionResult> ApplyVoucher([FromBody] ApplyVoucherRequest body, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var voucher = await db.Vouchers.FirstOrDefaultAsync(
            x => x.Code == body.Code && x.IsActive && x.StartDate <= now && x.EndDate >= now,
            cancellationToken);

        if (voucher is null)
            return NotFound(new { message = "Voucher không hợp lệ." });

        if (voucher.MinOrderValue.HasValue && body.OrderAmount < voucher.MinOrderValue)
            return BadRequest(new { message = "Đơn hàng chưa đạt giá trị tối thiểu để áp voucher." });

        var discount = voucher.DiscountType == VoucherDiscountType.@fixed
            ? voucher.DiscountValue
            : body.OrderAmount * (voucher.DiscountValue / 100m);

        if (voucher.MaxDiscount.HasValue)
            discount = Math.Min(discount, voucher.MaxDiscount.Value);

        discount = Math.Min(discount, body.OrderAmount);

        return Ok(new
        {
            voucher.Id,
            voucher.Code,
            discount,
            finalAmount = body.OrderAmount - discount,
        });
    }

    [HttpPost("vnpay/create")]
    public IActionResult CreateVnPayPayment([FromBody] CreatePaymentRequest body)
    {
        var txnRef = $"VNP-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        var paymentUrl = $"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_TxnRef={txnRef}&vnp_Amount={body.Amount}";
        return Ok(new { txnRef, paymentUrl });
    }

    [AllowAnonymous]
    [HttpGet("vnpay/callback")]
    public async Task<IActionResult> VnPayCallback([FromQuery] string? txnRef, [FromQuery] string? status, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(txnRef))
            return BadRequest(new { message = "Thiếu txnRef." });

        var payment = await db.Payments.FirstOrDefaultAsync(x => x.TransactionId == txnRef, cancellationToken);
        if (payment is null)
            return NotFound(new { message = "Không tìm thấy giao dịch." });

        payment.Status = string.Equals(status, "success", StringComparison.OrdinalIgnoreCase)
            ? PaymentStatus.paid
            : PaymentStatus.failed;
        payment.UpdatedAt = DateTime.UtcNow;

        var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == payment.OrderId, cancellationToken);
        if (order is not null)
        {
            order.PaymentStatus = payment.Status;
            order.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Đã xử lý callback thanh toán.", payment.Status });
    }
}
