import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="font-headline-md text-xl text-on-surface flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-body-lg">Your cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 text-primary font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20">
                <div className="w-20 h-20 bg-surface-container rounded-xl overflow-hidden shrink-0">
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
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-on-surface text-sm truncate">{item.product.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-outline-variant hover:text-error transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {item.size && <p className="text-xs text-outline-variant mt-0.5">{item.size}</p>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-label-md text-on-surface">₹{item.product.effective_price}</span>
                    <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-on-surface-variant hover:text-primary transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-on-surface">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-on-surface-variant hover:text-primary transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-outline-variant/20 bg-surface">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-on-surface">Subtotal</span>
              <span className="font-headline-md text-xl text-on-surface">₹{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-outline-variant text-center mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-primary text-on-primary rounded-xl font-label-md text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};
