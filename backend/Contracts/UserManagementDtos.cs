using Backend.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend.Contracts;

public record UserProfileResponse(
    long UserId,
    string Username,
    string Email,
    string? Phone,
    string? FullName,
    string? AvatarUrl,
    DateOnly? DateOfBirth,
    GenderType? Gender,
    string? Bio,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record UpdateUserProfileRequest(
    [property: Required, EmailAddress, MaxLength(100)] string Email,
    [property: MaxLength(20)] string? Phone,
    [property: MaxLength(100)] string? FullName,
    [property: MaxLength(500)] string? AvatarUrl,
    DateOnly? DateOfBirth,
    GenderType? Gender,
    string? Bio);

public record UserAddressResponse(
    long Id,
    string RecipientName,
    string RecipientPhone,
    string Province,
    string District,
    string Ward,
    string StreetAddress,
    double? Latitude,
    double? Longitude,
    string? PoiName,
    string? FormattedAddress,
    bool IsDefault,
    DateTime CreatedAt);

public class UpsertUserAddressRequest
{
    [Required, MaxLength(100)]
    public string RecipientName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string RecipientPhone { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Province { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Ward { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string StreetAddress { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    [MaxLength(200)]
    public string? PoiName { get; set; }

    [MaxLength(500)]
    public string? FormattedAddress { get; set; }

    public bool IsDefault { get; set; }
}

public record ChangePasswordRequest(
    [property: Required, MinLength(6), MaxLength(128)] string CurrentPassword,
    [property: Required, MinLength(6), MaxLength(128)] string NewPassword);

public record UserOrderItemResponse(
    long Id,
    string OrderNumber,
    long ShopId,
    string ShopName,
    decimal TotalAmount,
    string PaymentStatus,
    string Status,
    DateTime OrderedAt);

public record UserCartItemResponse(
    long Id,
    long ProductId,
    long ShopId,
    string ShopName,
    string ProductName,
    string ProductSlug,
    decimal UnitPrice,
    int Quantity,
    string? MainImageUrl,
    long? VariantId,
    string? VariantName,
    string? VariantValue,
    DateTime UpdatedAt);
