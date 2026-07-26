import React, { useState } from 'react';
import { ArrowLeft, Trash2, Minus, Plus, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';

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
      toast.info('Please log in to complete your purchase');
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
      toast.success('Order placed successfully! Thank you for shopping with HerbalUdyog.');
      clearCart();
      navigate('/dashboard', { state: { tab: 'orders' } });
    } catch (err: any) {
      const errMsg = err.message || 'Failed to place order. Please try again.';
      setOrderError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-32 text-center">
        <Package className="w-20 h-20 text-on-surface-variant/30 mx-auto mb-8" />
        <h1 className="font-display-lg text-4xl md:text-5xl mb-6 tracking-tight text-on-surface">Your Basket is Empty</h1>
        <p className="font-body-lg text-on-surface-variant mb-10 max-w-md mx-auto">
          Explore our marketplace to discover organic wellness products.
        </p>
        <Link to="/marketplace">
          <Button size="lg">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-md mb-6 uppercase tracking-widest text-xs">
        <ArrowLeft className="w-3 h-3" />
        Continue Shopping
      </Link>
      
      <h1 className="font-display-lg text-3xl md:text-4xl mb-8 tracking-tight text-on-surface">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 mb-6 shadow-sm">
            <h2 className="font-headline-md text-2xl mb-8 border-b border-outline-variant/30 pb-6 text-on-surface tracking-tight">
              Items ({itemCount})
            </h2>
            <ul className="space-y-8">
              {items.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                  <div className="w-28 h-28 rounded-2xl bg-[#F5F5F7] overflow-hidden shrink-0 border border-outline-variant/20">
                    <img 
                      src={
                        item.product.primary_image || 
                        (item.product.images?.length > 0 ? (item.product.images.find((i: any) => i.is_primary)?.image_url || item.product.images[0].image_url) : null) || 
                        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
                      } 
                      alt={item.product.name} 
                      className="w-full h-full object-cover mix-blend-multiply" 
                    />
                  </div>
                  <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-label-lg text-xl text-on-surface pr-4 leading-tight">{item.product.name}</h3>
                      </div>
                      {item.size && <p className="font-body-sm text-on-surface-variant text-sm mb-4">Size: {item.size}</p>}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-outline-variant/50 rounded-xl bg-surface px-1 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-label-md text-sm w-10 text-center text-on-surface">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-xs font-label-md uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-2xl font-medium text-on-surface">
                        ₹{(Number(item.product.effective_price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 md:p-10 sticky top-28 shadow-sm">
            <h2 className="font-headline-md text-2xl mb-8 text-on-surface tracking-tight">Order Summary</h2>
            
            <div className="space-y-5 mb-8 font-body-md text-on-surface/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-on-surface">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-on-surface">₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-medium text-on-surface">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="font-headline-sm text-lg text-on-surface">Total</span>
                <span className="font-display-md text-3xl font-bold text-on-surface">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {orderError && (
              <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-body-sm text-sm border border-error/20">
                {orderError}
              </div>
            )}

            <Button 
              size="lg"
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="w-full h-14 text-lg mb-6"
            >
              {!isAuthenticated ? 'Login to Checkout' : (isPlacingOrder ? 'Processing...' : 'Proceed to Payment')}
            </Button>
            <p className="font-body-sm text-xs text-center text-on-surface-variant">
              By proceeding, you support pure herbal, high-quality, and organic wellness practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

