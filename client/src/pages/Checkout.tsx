import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Checkout = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-outline-variant hover:text-primary transition-colors font-label-md mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping
      </Link>
      
      <h1 className="font-display-lg text-4xl mb-10">Your Basket</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 mb-6">
            <h2 className="font-headline-md text-xl mb-6 border-b border-outline-variant/20 pb-4">Items (3)</h2>
            <ul className="space-y-6">
              {[
                { name: "Ashwagandha Root Powder", farm: "Pure Herbals", price: 14.99, qty: 2, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=200" },
                { name: "Mahanarayan Massage Oil", farm: "Ancient Oils", price: 24.50, qty: 1, img: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200" },
                { name: "Tulsi Green Tea", farm: "Sacred Leaves", price: 6.99, qty: 1, img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200" },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-xl bg-surface-container overflow-hidden shrink-0">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline-md text-lg">{item.name}</h3>
                      <p className="font-label-md text-lg font-medium">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <p className="font-body-sm text-outline-variant text-sm mb-4">{item.farm}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-outline-variant/30 rounded-full bg-surface">
                        <button className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-primary transition-colors">-</button>
                        <span className="font-label-md text-sm w-6 text-center">{item.qty}</span>
                        <button className="w-8 h-8 flex items-center justify-center text-outline-variant hover:text-primary transition-colors">+</button>
                      </div>
                      <button className="p-2 text-outline-variant hover:text-error transition-colors rounded-full hover:bg-error-container/50">
                        <Trash2 className="w-4 h-4" />
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
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 sticky top-24">
            <h2 className="font-headline-md text-2xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8 font-body-md">
              <div className="flex justify-between text-outline-variant">
                <span>Subtotal</span>
                <span className="text-on-surface">$25.97</span>
              </div>
              <div className="flex justify-between text-outline-variant">
                <span>Local Delivery</span>
                <span className="text-on-surface">$4.50</span>
              </div>
              <div className="flex justify-between text-outline-variant">
                <span>Estimated Tax</span>
                <span className="text-on-surface">$2.15</span>
              </div>
              <div className="pt-4 mt-4 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-headline-md text-lg">Total</span>
                <span className="font-headline-lg text-2xl">${(25.97 + 4.50 + 2.15).toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-on-primary rounded-full font-label-md text-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-lg shadow-primary/20 mb-4">
              Proceed to Checkout
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
