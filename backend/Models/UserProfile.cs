namespace Backend.Models;

public class UserProfile
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderType? Gender { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User User { get; set; } = null!;
}
