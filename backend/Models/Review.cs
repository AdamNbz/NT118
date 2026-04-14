namespace Backend.Models;

public class Review
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public long ProductId { get; set; }
    public long ReviewerId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsVerified { get; set; }
    public int HelpfulVotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product Product { get; set; } = null!;
    public User Reviewer { get; set; } = null!;
}
