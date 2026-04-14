using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("order_items")]
public class OrderItem
{
    [Column("id")]
    public long Id { get; set; }

    [Column("order_id")]
    public long OrderId { get; set; }

    [Column("product_id")]
    public long ProductId { get; set; }

    [Column("variant_id")]
    public long? VariantId { get; set; }

    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [Column("product_image")]
    public string? ProductImage { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; }

    [Column("unit_price")]
    public decimal UnitPrice { get; set; }

    [Column("total_price")]
    public decimal TotalPrice { get; set; }
}
