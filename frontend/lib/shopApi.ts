import { apiClient } from './apiClient';
import { MOCK_SHOPS, ShopDTO } from './mockData';
import { ProductDTO, getProducts } from './productApi';

const USE_MOCK = true;

export interface CreateShopRequest {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
}


/**
 * Fetch shop details by ID
 */
export async function getShopById(id: number): Promise<ShopDTO | null> {
  if (USE_MOCK) {
    return MOCK_SHOPS.find(s => s.id === id) || MOCK_SHOPS[0];
  }

  try {
    const res = await apiClient.get(`/api/shops/${id}`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch shop:', err);
    return null;
  }
}

/**
 * Fetch products belonging to a shop
 */
export async function getShopProducts(shopId: number): Promise<ProductDTO[]> {
  if (USE_MOCK) {
    // Return all mock products for now, or filter if we add shopId to ProductDTO
    return (await getProducts()).data;
  }

  try {
    // Note: Backend might need to support filtering by shopId in GetProducts
    const res = await apiClient.get('/api/products', { params: { shopId } });
    return res.data?.items || [];
  } catch (err) {
    console.error('Failed to fetch shop products:', err);
    return [];
  }
}

/**
 * Follow or unfollow a shop
 */
export async function toggleFollowShop(shopId: number, isFollowing: boolean): Promise<boolean> {
  if (USE_MOCK) {
    return true;
  }

  try {
    if (isFollowing) {
      await apiClient.delete(`/api/shops/${shopId}/follow`);
    } else {
      await apiClient.post(`/api/shops/${shopId}/follow`);
    }
    return true;
  } catch (err) {
    console.error('Failed to toggle follow shop:', err);
    return false;
  }
}

/**
 * Register a new shop
 */
export async function registerShop(data: CreateShopRequest): Promise<{ id: number; name: string }> {
  try {
    const res = await apiClient.post('/api/shops/register', data);
    return res.data;
  } catch (err: any) {
    console.error('Failed to register shop:', err);
    throw new Error(err.message || 'Đăng ký shop thất bại.');
  }
}

/**
 * Fetch list of shops followed by the current user
 */
export async function getFollowedShops(): Promise<ShopDTO[]> {
  if (USE_MOCK) {
    return MOCK_SHOPS.slice(0, 3);
  }

  try {
    const res = await apiClient.get('/api/shops/followed');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch followed shops:', err);
    return [];
  }
}

/**
 * Check if the current user follows a specific shop
 */
export async function getFollowStatus(shopId: number): Promise<{ isFollowing: boolean; followedAt?: string }> {
  if (USE_MOCK) {
    return { isFollowing: false };
  }

  try {
    const res = await apiClient.get(`/api/shops/${shopId}/follow-status`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch follow status:', err);
    return { isFollowing: false };
  }
}

