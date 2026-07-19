import { apiClient } from './client';
import { Product } from './products';

export interface OrderItem {
  id: number;
  product: number; // Product ID
  product_name: string;
  product_image?: string;
  quantity: number;
  size: string;
  price: string;
}

export interface Order {
  id: number;
  user: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  billing_address: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  total: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  shipping_address: string;
  billing_address?: string;
  items: {
    product_id: number;
    quantity: number;
    size?: string;
  }[];
}

export const ordersApi = {
  list: async () => {
    const res = await apiClient.get('/api/orders/');
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json() as Promise<Order[]>;
  },

  get: async (id: number) => {
    const res = await apiClient.get(`/api/orders/${id}/`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    return res.json() as Promise<Order>;
  },

  create: async (data: CreateOrderPayload) => {
    const res = await apiClient.post('/api/orders/', data);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to place order');
    }
    return res.json() as Promise<Order>;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await apiClient.patch(`/api/orders/${id}/update_status/`, { status });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json() as Promise<Order>;
  }
};
