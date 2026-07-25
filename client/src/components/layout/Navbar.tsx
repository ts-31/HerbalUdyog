import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, LogOut, Heart, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get('search');
    if (query) {
      navigate(`/marketplace?search=${encodeURIComponent(query as string)}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/50">
          <div className="max-w-[1200px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-8">
              <Link to="/" className="flex items-center shrink-0">
                  <span className="font-display-lg text-2xl font-bold text-primary tracking-tight">HerbalUdyog</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-8 shrink-0">
                  <Link to="/marketplace" className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Products</Link>
                  
                  {isAuthenticated && !isAdmin && (
                      <Link to="/dashboard" state={{ tab: 'orders' }} className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Orders</Link>
                  )}

                  {isAuthenticated && isAdmin && (
                    <Link to="/admin" className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Dashboard</Link>
                  )}

                  <Link to="/blog" className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Blog</Link>
                  <Link to="/contact" className="font-label-md text-sm text-on-surface-variant hover:text-primary transition-colors">Contact</Link>
              </nav>

              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center bg-surface-dim rounded-full px-5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-surface">
                  <Search className="w-4 h-4 text-on-surface-variant mr-3 shrink-0" />
                  <input 
                    type="text" 
                    name="search"
                    placeholder="Search herbs, remedies..." 
                    className="bg-transparent border-none outline-none font-body-sm text-sm w-full placeholder:text-on-surface-variant/70 text-on-surface" 
                  />
              </form>

              <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors" aria-label="Search">
                      <Search className="w-5 h-5" />
                  </button>
                  
                  {!isAdmin && (
                    <>
                      {isAuthenticated && (
                        <Link to="/dashboard" className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors relative" aria-label="Wishlist" state={{ tab: 'wishlist' }}>
                            <Heart className="w-5 h-5" />
                        </Link>
                      )}
                      <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors relative" 
                        aria-label="Cart"
                      >
                          <ShoppingCart className="w-5 h-5" />
                          {itemCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center border-2 border-surface">
                              {itemCount}
                            </span>
                          )}
                      </button>
                    </>
                  )}
                  
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors relative" aria-label="Profile">
                          <User className="w-5 h-5" />
                      </Link>
                      <button onClick={handleLogout} className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full hover:bg-error-container text-error transition-colors" aria-label="Logout">
                          <LogOut className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" className="hidden md:flex px-5 py-2 bg-primary text-on-primary rounded-full font-label-md text-sm hover:bg-primary/90 transition-all shadow-sm">
                        Sign In
                    </Link>
                  )}
                  <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors">
                      <Menu className="w-5 h-5" />
                  </button>
              </div>
          </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="absolute inset-y-0 left-0 w-[280px] bg-surface shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <span className="font-display-lg text-2xl font-bold text-primary">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-6 space-y-6">
            <nav className="flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary">Home</Link>
              <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary">Products</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary">Blog</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary">Contact</Link>
            </nav>

            <div className="border-t border-outline-variant/20 pt-6">
              {isAuthenticated ? (
                <div className="space-y-4">
                  {isAdmin ? (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary block">Admin Dashboard</Link>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary block">My Account</Link>
                      <Link to="/dashboard" state={{ tab: 'orders' }} onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary block">Order History</Link>
                      <Link to="/dashboard" state={{ tab: 'wishlist' }} onClick={() => setIsMobileMenuOpen(false)} className="font-label-lg text-lg text-on-surface hover:text-primary block">Wishlist</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="font-label-lg text-lg text-error hover:text-error/80 flex items-center gap-2">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-center hover:bg-primary-container hover:text-on-primary-container transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
