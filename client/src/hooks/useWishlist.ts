import { useState, useEffect, useCallback } from 'react';
import { wishlistApi, WishlistItem } from '../api/wishlist';
import { useAuth } from '../context/AuthContext';

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isCustomer } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await wishlistApi.list();
      setItems(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: number) => {
    if (!isAuthenticated || !isCustomer) return false;

    const isWishlisted = items.some(item => item.product_id === productId);
    
    try {
      if (isWishlisted) {
        await wishlistApi.remove(productId);
        setItems(prev => prev.filter(item => item.product_id !== productId));
      } else {
        const newItem = await wishlistApi.add(productId);
        setItems(prev => [newItem, ...prev]);
      }
      return true;
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      return false;
    }
  };

  const isInWishlist = (productId: number) => items.some(item => item.product_id === productId);

  return {
    items,
    loading,
    error,
    toggleWishlist,
    isInWishlist,
    refetch: fetchWishlist
  };
};
