import React from 'react';
import { Home, Store, LayoutDashboard, ShoppingBasket } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, isAdmin } = useAuth();

  // Resolve the account/dashboard link based on role
  const accountPath = isAuthenticated
    ? isAdmin
      ? '/admin'
      : '/dashboard'
    : '/auth';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
            <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${path === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>
                <div className={`w-16 h-8 rounded-full flex items-center justify-center mb-1 ${path === '/' ? 'bg-secondary-container' : ''}`}>
                    <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/marketplace" className={`flex flex-col items-center justify-center w-full h-full ${path === '/marketplace' ? 'text-primary' : 'text-on-surface-variant'}`}>
                <div className={`w-16 h-8 rounded-full flex items-center justify-center mb-1 ${path === '/marketplace' ? 'bg-secondary-container' : ''}`}>
                    <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Shop</span>
            </Link>
            <Link to={accountPath} className={`flex flex-col items-center justify-center w-full h-full ${['/dashboard', '/admin'].includes(path) ? 'text-primary' : 'text-on-surface-variant'}`}>
                <div className={`w-16 h-8 rounded-full flex items-center justify-center mb-1 ${['/dashboard', '/admin'].includes(path) ? 'bg-secondary-container' : ''}`}>
                    <LayoutDashboard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Account</span>
            </Link>
            {!isAdmin && (
              <Link to="/checkout" className={`flex flex-col items-center justify-center w-full h-full ${path === '/checkout' ? 'text-primary' : 'text-on-surface-variant'}`}>
                  <div className={`w-16 h-8 rounded-full flex items-center justify-center mb-1 relative ${path === '/checkout' ? 'bg-secondary-container' : ''}`}>
                      <ShoppingBasket className="w-5 h-5" />
                      <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-error"></span>
                  </div>
                  <span className="text-[10px] font-medium">Cart</span>
              </Link>
            )}
        </div>
    </div>
  );
};
