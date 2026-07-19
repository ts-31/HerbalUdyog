import { useState, useEffect, useCallback } from 'react';
import { ordersApi, Order, CreateOrderPayload } from '../api/orders';
import { useAuth } from '../context/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await ordersApi.list();
      setOrders(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const placeOrder = async (payload: CreateOrderPayload) => {
    try {
      const newOrder = await ordersApi.create(payload);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to place order');
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const updated = await ordersApi.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update status');
    }
  };

  return {
    orders,
    loading,
    error,
    placeOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
