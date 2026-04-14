namespace Backend.Models;

public class Order
{
    public long Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public long BuyerId { get; set; }
    public long ShopId { get; set; }
    public long ShippingAddressId { get; set; }
    public long? VoucherId { get; set; }
    public long? ShopVoucherId { get; set; }
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.pending;
    public OrderStatus Status { get; set; } = OrderStatus.pending;
    public DateTime OrderedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User Buyer { get; set; } = null!;
    public Shop Shop { get; set; } = null!;
}
