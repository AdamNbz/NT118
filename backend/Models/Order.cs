namespace Backend.Models;

public class Order
{
    public long Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public long BuyerId { get; set; }
    public long ShopId { get; set; }
    public decimal TotalAmount { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.pending;
    public OrderStatus Status { get; set; } = OrderStatus.pending;
    public DateTime OrderedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User Buyer { get; set; } = null!;
    public Shop Shop { get; set; } = null!;
}
