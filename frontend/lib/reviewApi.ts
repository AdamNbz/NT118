import { apiClient } from './apiClient';
import { MOCK_REVIEWS, ProductReviewItemResponse } from './mockData';

// Toggle to use mock data for testing
const USE_MOCK = false;

export interface CreateReviewRequest {
  orderId: number;
  rating: number;
  comment?: string;
}

/**
 * Fetch reviews for a specific product
 */
export async function getProductReviews(productId: number, limit: number = 50): Promise<ProductReviewItemResponse[]> {
  if (USE_MOCK) {
    // In mock mode, we just return a shuffled set of mock reviews
    return MOCK_REVIEWS.slice(0, limit);
  }

  const res = await apiClient.get(`/api/products/${productId}/reviews`, { params: { limit } });
  return res.data?.data || res.data || [];
}

/**
 * Create a new review
 */
export async function createReview(productId: number, data: CreateReviewRequest): Promise<{ success: boolean; message: string; reviewId?: number }> {
  if (USE_MOCK) {
    console.log('Simulating review submission for product:', productId, data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Đánh giá thành công (Mock Mode)',
          reviewId: Math.floor(Math.random() * 1000)
        });
      }, 1000);
    });
  }

  try {
    const res = await apiClient.post(`/api/products/${productId}/reviews`, data);
    return {
      success: true,
      message: res.data?.message || 'Đánh giá thành công.',
      reviewId: res.data?.reviewId
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gửi đánh giá thất bại.'
    };
  }
}
