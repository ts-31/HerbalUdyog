import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi, WishlistItem } from '../api/wishlist';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  refetch: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isCustomer } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await wishlistApi.list();
      const list = Array.isArray(data) ? data : (data as any).results || [];
      // Ensure each item has both product_id and id set to product.id
      const normalized = list.map(item => ({
        ...item,
        product_id: item.product_id || item.id,
        id: item.id || item.product_id
      }));
      setItems(normalized);
    } catch (err: any) {
      setError(err.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId: number) => {
    return items.some(item => (item.product_id === productId || item.id === productId));
  }, [items]);

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated || !isCustomer) {
      toast.info('Please sign in to save items to your wishlist');
      return false;
    }

    const isWishlisted = isInWishlist(productId);
    const previousItems = [...items];

    // 1. Optimistic Instant UI Update (Zero Delay)
    if (isWishlisted) {
      setItems(prev => prev.filter(item => item.product_id !== productId && item.id !== productId));
      toast.info('Removed from wishlist');
    } else {
      const tempItem: WishlistItem = {
        id: productId,
        product_id: productId,
        name: 'Product',
        slug: '',
        price: '0.00',
        effective_price: '0.00',
        image: null,
        created_at: new Date().toISOString()
      };
      setItems(prev => [tempItem, ...prev]);
      toast.success('Saved to wishlist');
    }

    // 2. Perform API call
    try {
      if (isWishlisted) {
        await wishlistApi.remove(productId);
      } else {
        const newItem = await wishlistApi.add(productId);
        const normalizedItem: WishlistItem = {
          ...newItem,
          product_id: productId,
          id: productId
        };
        setItems(prev => prev.map(item => (item.product_id === productId || item.id === productId) ? normalizedItem : item));
      }
      return true;
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      // Revert optimistic update on API error
      setItems(previousItems);
      toast.error('Failed to update wishlist. Please try again.');
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      error,
      toggleWishlist,
      isInWishlist,
      refetch: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
