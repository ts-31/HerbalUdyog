import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get('search');
    if (query) {
      navigate(`/marketplace?search=${encodeURIComponent(query as string)}`);
    }
  };


  return (
    <header className="sticky top-0 z-50 bg-[#fbfbe2]/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
            <Link to="/" className="flex items-center shrink-0">
                <span className="font-display-lg text-2xl md:text-[28px] font-bold text-primary tracking-tight">HerbalUdyog</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 shrink-0">
                <Link to="/marketplace" className="font-label-md text-sm text-on-surface hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Products</Link>
                
                {isAuthenticated && !isAdmin && (
                  <>
                    <Link to="/orders" className="font-label-md text-sm text-on-surface hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Order History</Link>
                  </>
                )}

                {isAuthenticated && isAdmin && (
                  <Link to="/admin" className="font-label-md text-sm text-on-surface hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Dashboard</Link>
                )}

                <Link to="/blog" className="font-label-md text-sm text-on-surface hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Blog</Link>
                <Link to="/contact" className="font-label-md text-sm text-on-surface hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">Contact</Link>
            </nav>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md items-center bg-surface-container rounded-full px-5 py-2.5">
                <Search className="w-4 h-4 text-outline mr-3 shrink-0" />
                <input 
                  type="text" 
                  name="search"
                  placeholder="Search herbs..." 
                  className="bg-transparent border-none outline-none font-body-sm text-sm w-full placeholder:text-outline text-on-surface" 
                />
            </form>

            <div className="flex items-center gap-4 shrink-0">
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
                          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center border-2 border-background">
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
                    <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-error transition-colors" aria-label="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <Link to="/auth" className="hidden md:flex px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors">
                      Sign In
                  </Link>
                )}
                <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>
    </header>
  );
};
