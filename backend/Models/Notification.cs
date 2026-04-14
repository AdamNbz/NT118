using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("notifications")]
public class Notification
{
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("type")]
    public string Type { get; set; } = string.Empty;

    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("message")]
    public string? MessageText { get; set; }

    [Column("data")]
    public string? Data { get; set; }

    [Column("is_read")]
    public bool IsRead { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
