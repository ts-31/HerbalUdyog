import { apiClient } from './client';

export interface WishlistItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: string;
  effective_price: string;
  image: string | null;
  created_at: string;
}

export const wishlistApi = {
  list: async () => {
    const res = await apiClient.get('/api/users/wishlist/');
    if (!res.ok) throw new Error('Failed to fetch wishlist');
    return res.json() as Promise<WishlistItem[]>;
  },

  add: async (productId: number) => {
    const res = await apiClient.post('/api/users/wishlist/', { product_id: productId });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || 'Failed to add to wishlist');
    }
    return res.json() as Promise<WishlistItem>;
  },

  remove: async (productId: number) => {
    const res = await apiClient.delete(`/api/users/wishlist/${productId}/`);
    if (!res.ok) throw new Error('Failed to remove from wishlist');
  }
};
