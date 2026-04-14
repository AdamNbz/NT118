using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("messages")]
public class Message
{
    [Column("id")]
    public long Id { get; set; }

    [Column("sender_id")]
    public long SenderId { get; set; }

    [Column("receiver_id")]
    public long ReceiverId { get; set; }

    [Column("order_id")]
    public long? OrderId { get; set; }

    [Column("message_type", TypeName = "message_type")]
    public MessageType MessageType { get; set; } = MessageType.text;

    [Column("content")]
    public string? Content { get; set; }

    [Column("attachment_url")]
    public string? AttachmentUrl { get; set; }

    [Column("is_read")]
    public bool IsRead { get; set; }

    [Column("sent_at")]
    public DateTime SentAt { get; set; }
}
