using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("follows")]
public class Follow
{
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("shop_id")]
    public long ShopId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
