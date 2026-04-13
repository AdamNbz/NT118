using Backend.Models;

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
    string Email,
    string? Phone,
    string? FullName,
    string? AvatarUrl,
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
    bool IsDefault,
    DateTime CreatedAt);

public record UpsertUserAddressRequest(
    string RecipientName,
    string RecipientPhone,
    string Province,
    string District,
    string Ward,
    string StreetAddress,
    bool IsDefault);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

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
    string ProductName,
    string ProductSlug,
    decimal UnitPrice,
    int Quantity,
    string? MainImageUrl,
    long? VariantId,
    string? VariantName,
    string? VariantValue,
    DateTime UpdatedAt);
