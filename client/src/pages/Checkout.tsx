import React, { useState } from 'react';
import { ArrowLeft, Trash2, Minus, Plus, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';

export const Checkout = () => {
  const { items, updateQuantity, removeItem, cartTotal, itemCount, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { profile } = useProfile();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const shipping = 50.00;
  const tax = cartTotal * 0.05; // 5% GST
  const finalTotal = cartTotal + shipping + tax;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    try {
      setIsPlacingOrder(true);
      setOrderError(null);
      
      const payload = {
        shipping_address: profile?.address_line1 ? `${profile.address_line1}, ${profile.city}, ${profile.state} ${profile.postal_code}` : 'Address Pending',
        billing_address: profile?.address_line1 ? `${profile.address_line1}, ${profile.city}, ${profile.state} ${profile.postal_code}` : 'Address Pending',
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size: item.size
        }))
      };
      
      await placeOrder(payload as any);
      clearCart();
      navigate('/dashboard', { state: { tab: 'orders' } });
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <Package className="w-16 h-16 text-outline-variant mx-auto mb-6" />
        <h1 className="font-display-lg text-4xl mb-4 text-[#1b1d0e]">Your Basket is Empty</h1>
        <p className="font-body-md text-outline-variant mb-8 max-w-md mx-auto">
          Explore our marketplace to discover organic wellness products.
        </p>
        <Link to="/marketplace" className="inline-block px-8 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27] transition-colors">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors font-label-md mb-8">
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>
      
      <h1 className="font-display-lg text-4xl mb-10 text-[#1b1d0e]">Your Basket</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-headline-md text-xl mb-6 border-b border-outline-variant/20 pb-4 text-[#1b1d0e]">
              Items ({itemCount})
            </h2>
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                    <img 
                      src={
                        item.product.primary_image || 
                        (item.product.images?.length > 0 ? (item.product.images.find((i: any) => i.is_primary)?.image_url || item.product.images[0].image_url) : null) || 
                        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
                      } 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline-md text-lg text-[#1b1d0e] pr-4">{item.product.name}</h3>
                      <p className="font-label-md text-lg font-medium text-[#1b1d0e]">
                        ₹{(Number(item.product.effective_price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    {item.size && <p className="font-body-sm text-outline-variant text-sm mb-4">Size: {item.size}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-outline-variant/30 rounded-lg bg-surface px-1 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-label-md text-sm w-8 text-center text-[#1b1d0e]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-outline-variant hover:text-error transition-colors rounded-full hover:bg-error/10"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-8 sticky top-28 shadow-sm">
            <h2 className="font-headline-md text-2xl mb-6 text-[#1b1d0e]">Order Summary</h2>
            
            <div className="space-y-4 mb-8 font-body-md">
              <div className="flex justify-between text-outline-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-outline-variant">
                <span>Shipping</span>
                <span className="text-on-surface">₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-outline-variant">
                <span>Estimated Tax (5%)</span>
                <span className="text-on-surface">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-headline-md text-lg text-[#1b1d0e]">Total</span>
                <span className="font-headline-lg text-2xl font-bold text-[#154212]">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {orderError && (
              <div className="mb-4 p-3 bg-error/10 text-error rounded-xl font-body-sm text-sm">
                {orderError}
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="w-full py-4 bg-[#154212] text-white rounded-xl font-label-md text-lg hover:bg-[#2d5a27] transition-colors shadow-lg shadow-primary/20 mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {!isAuthenticated ? 'Login to Checkout' : (isPlacingOrder ? 'Processing...' : 'Proceed to Payment')}
            </button>
            <p className="font-body-sm text-xs text-center text-outline-variant">
              By proceeding, you support pure herbal, high-quality, and organic wellness practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

