import { apiClient } from './apiClient';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItemDTO {
  id: number;
  productId: number;
  variantId?: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDTO {
  id: number;
  orderNumber: string;
  shopId: number;
  totalAmount: number;
  paymentStatus: string;
  status: OrderStatus;
  orderedAt: string;
}

export interface OrderDetailDTO {
  order: {
    id: number;
    orderNumber: string;
    shopId: number;
    shippingAddressId: number;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: OrderStatus;
    notes: string | null;
    orderedAt: string;
  };
  items: OrderItemDTO[];
}

export const orderApi = {
  getMyOrders: async (): Promise<OrderDTO[]> => {
    const res = await apiClient.get('/api/orders');
    return res.data?.data || res.data || [];
  },

  getOrderDetail: async (id: number): Promise<OrderDetailDTO> => {
    const res = await apiClient.get(`/api/orders/${id}`);
    return res.data?.data || res.data;
  },

  updateOrderStatus: async (id: number, status: OrderStatus): Promise<void> => {
    await apiClient.patch(`/api/orders/${id}/status`, { status });
  },

  cancelOrder: async (id: number): Promise<void> => {
    await apiClient.patch(`/api/orders/${id}/status`, { status: 'cancelled' });
  }
};
