using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("user_vouchers")]
public class UserVoucher
{
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("voucher_id")]
    public long? VoucherId { get; set; }

    [Column("shop_voucher_id")]
    public long? ShopVoucherId { get; set; }

    [Column("is_used")]
    public bool IsUsed { get; set; }

    [Column("used_at")]
    public DateTime? UsedAt { get; set; }

    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
