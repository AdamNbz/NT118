using Backend.Contracts;

namespace Backend.Services;

public interface IUserManagementService
{
    Task<UserProfileResponse> GetProfileAsync(long userId, CancellationToken cancellationToken = default);
    Task<UserProfileResponse> UpdateProfileAsync(long userId, UpdateUserProfileRequest request, CancellationToken cancellationToken = default);
    Task<MessageResponse> ChangePasswordAsync(long userId, ChangePasswordRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserAddressResponse>> GetAddressesAsync(long userId, CancellationToken cancellationToken = default);
    Task<UserAddressResponse> AddAddressAsync(long userId, UpsertUserAddressRequest request, CancellationToken cancellationToken = default);
    Task<UserAddressResponse> UpdateAddressAsync(long userId, long addressId, UpsertUserAddressRequest request, CancellationToken cancellationToken = default);
    Task DeleteAddressAsync(long userId, long addressId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserCartItemResponse>> GetCartItemsAsync(long userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserOrderItemResponse>> GetOrdersAsync(long userId, CancellationToken cancellationToken = default);
}
