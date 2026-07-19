import React, { useState, useEffect } from 'react';
import { Package, ChevronDown } from 'lucide-react';
import { adminOrdersApi } from '../../api/admin';
import { Order } from '../../api/orders';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const AdminOrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrdersApi.list();
      setOrders(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      setUpdatingId(id);
      const updated = await adminOrdersApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 text-on-surface-variant">
        <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p className="font-medium">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-on-surface-variant">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Order</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Items</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="px-5 py-4 font-medium text-on-surface">#{order.id}</td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {(order as any).user_email || `User #${order.user}`}
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-4 font-semibold text-on-surface">₹{order.total}</td>
                  <td className="px-5 py-4 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`appearance-none pr-8 pl-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border-0 outline-none ${statusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} className="bg-white text-on-surface">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
