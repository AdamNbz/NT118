namespace Backend.Models;

public class Category
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public long? ParentId { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public CategoryStatus Status { get; set; } = CategoryStatus.active;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<Product> Products { get; set; } = [];
}
