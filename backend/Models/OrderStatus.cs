namespace Backend.Models;

public enum OrderStatus
{
    pending,
    confirmed,
    shipping,
    delivered,
    cancelled,
    refunded,
}
