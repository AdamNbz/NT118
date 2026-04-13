using Backend.Contracts;

namespace Backend.Services;

public interface IProductService
{
    Task<ProductListResponse> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
    Task<ProductDetailResponse?> GetProductDetailAsync(long productId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ProductReviewItemResponse>> GetProductReviewsAsync(long productId, int limit = 50, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CategoryResponse>> GetCategoriesAsync(CancellationToken cancellationToken = default);
    Task<ProductListResponse> SearchProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
    Task RecordViewAsync(long userId, long productId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ViewHistoryItemResponse>> GetViewHistoryAsync(long userId, int limit = 50, CancellationToken cancellationToken = default);
}
