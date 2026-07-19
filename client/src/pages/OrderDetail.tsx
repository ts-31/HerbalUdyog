import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, Clock } from 'lucide-react';
import { ordersApi, Order } from '../api/orders';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const statusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await ordersApi.get(Number(id));
        setOrder(data);
      } catch {
        setError('Order not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#fbfbe2] min-h-screen pt-32 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#fbfbe2] min-h-screen pt-32 text-center">
        <h2 className="font-display-md text-2xl text-error mb-4">{error || 'Order not found'}</h2>
        <Link to="/dashboard" className="text-primary underline">Back to Dashboard</Link>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="bg-[#fbfbe2] min-h-screen py-12">
      <div className="max-w-[900px] mx-auto px-6">
        <Link to="/dashboard" state={{ tab: 'orders' }} className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors font-label-md mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Order History
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/20 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display-md text-3xl text-[#1b1d0e] mb-1">Order #{order.id}</h1>
              <p className="text-sm text-outline-variant font-body-sm">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                {/* Line behind steps */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-outline-variant/20" />
                <div
                  className="absolute top-4 left-4 h-0.5 bg-[#154212] transition-all duration-500"
                  style={{ width: currentStep === 0 ? '0%' : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      i <= currentStep
                        ? 'bg-[#154212] border-[#154212] text-white'
                        : 'bg-white border-outline-variant/30 text-outline-variant'
                    }`}>
                      {i < currentStep ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="text-xs font-bold">{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium capitalize ${i <= currentStep ? 'text-[#154212]' : 'text-outline-variant'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/20">
            <h2 className="font-headline-md text-xl text-[#1b1d0e] mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" /> Items Ordered
            </h2>
            <div className="space-y-5">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 pb-5 border-b border-outline-variant/10 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-surface-container rounded-xl overflow-hidden shrink-0 border border-outline-variant/20">
                    <img
                      src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200"
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-on-surface truncate">{item.product_name}</h4>
                    <p className="font-body-sm text-outline-variant">
                      Qty: {item.quantity}{item.size ? ` • Size: ${item.size}` : ''}
                    </p>
                  </div>
                  <p className="font-label-md text-[#1b1d0e] shrink-0">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Shipping */}
          <div className="space-y-4">
            {/* Price Breakdown */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20">
              <h2 className="font-headline-md text-base text-[#1b1d0e] mb-4">Price Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span>₹{order.shipping_cost}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Tax (5%)</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between font-semibold text-on-surface text-base pt-3 border-t border-outline-variant/20">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20">
              <h2 className="font-headline-md text-base text-[#1b1d0e] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Shipping Address
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{order.shipping_address}</p>
            </div>

            {/* Timestamps */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20">
              <h2 className="font-headline-md text-base text-[#1b1d0e] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Timeline
              </h2>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Ordered</span>
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span>{new Date(order.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
