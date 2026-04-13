namespace Backend.Models;

public class ViewHistory
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long ProductId { get; set; }
    public DateTime ViewedAt { get; set; }

    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
