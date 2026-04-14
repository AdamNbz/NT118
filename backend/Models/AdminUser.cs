using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("admin_users")]
public class AdminUser
{
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("role")]
    public string Role { get; set; } = "moderator";

    [Column("permissions")]
    public string? Permissions { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
