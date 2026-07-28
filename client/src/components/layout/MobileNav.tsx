import React from 'react';
import { Home, Store, LayoutDashboard, ShoppingBasket, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const { isAuthenticated, isAdmin } = useAuth();

  const accountPath = isAuthenticated
    ? isAdmin
      ? '/admin'
      : '/dashboard'
    : '/auth';

  const accountActive = isAuthenticated
    ? ['/dashboard', '/admin'].includes(path)
    : path === '/auth';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
            <Link to="/" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${path === '/' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <div className={`w-14 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${path === '/' ? 'bg-surface-container-high' : ''}`}>
                    <Home className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Home</span>
            </Link>
            <Link to="/marketplace" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${path === '/marketplace' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <div className={`w-14 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${path === '/marketplace' ? 'bg-surface-container-high' : ''}`}>
                    <Store className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">Shop</span>
            </Link>
            <Link to={accountPath} className={`flex flex-col items-center justify-center w-full h-full transition-colors ${accountActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <div className={`w-14 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${accountActive ? 'bg-surface-container-high' : ''}`}>
                    {isAuthenticated ? <LayoutDashboard className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-medium">{isAuthenticated ? 'Account' : 'Sign in'}</span>
            </Link>
            {!isAdmin && (
              <Link to="/checkout" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${path === '/checkout' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  <div className={`w-14 h-8 rounded-full flex items-center justify-center mb-1 relative transition-all ${path === '/checkout' ? 'bg-surface-container-high' : ''}`}>
                      <ShoppingBasket className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium">Cart</span>
              </Link>
            )}
        </div>
    </div>
  );
};
