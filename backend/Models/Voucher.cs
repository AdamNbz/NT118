using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("vouchers")]
public class Voucher
{
    [Column("id")]
    public long Id { get; set; }

    [Column("code")]
    public string Code { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("description")]
    public string? Description { get; set; }

    [Column("discount_type", TypeName = "voucher_discount_type")]
    public VoucherDiscountType DiscountType { get; set; }

    [Column("discount_value")]
    public decimal DiscountValue { get; set; }

    [Column("min_order_value")]
    public decimal? MinOrderValue { get; set; }

    [Column("max_discount")]
    public decimal? MaxDiscount { get; set; }

    [Column("usage_limit")]
    public int? UsageLimit { get; set; }

    [Column("used_count")]
    public int UsedCount { get; set; }

    [Column("start_date")]
    public DateTime StartDate { get; set; }

    [Column("end_date")]
    public DateTime EndDate { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_by")]
    public long? CreatedBy { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
