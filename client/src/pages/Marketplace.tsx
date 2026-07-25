import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ShoppingCart, Star, Heart, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export const Marketplace = () => {
  const { isAdmin, isAuthenticated, isCustomer } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const pageParam = searchParams.get('page') || '1';
  
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts({
    search: searchParam,
    category: categoryParam,
    page: pageParam
  });

  const { categories, loading: categoriesLoading } = useCategories();

  const handleCategorySelect = (slug: string) => {
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
    setIsFilterOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const getImageUrl = (product: any) => {
    if (product.primary_image) {
      return product.primary_image;
    }
    return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600";
  };

  const FiltersContent = () => (
    <div>
      <h3 className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-4">Categories</h3>
      {categoriesLoading ? (
         <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-surface-container rounded-lg w-full"></div>)}
         </div>
      ) : (
        <ul className="flex flex-col gap-2">
          <li>
            <button
              onClick={() => handleCategorySelect('')}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${categoryParam === '' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => handleCategorySelect(cat.slug)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${categoryParam === cat.slug ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl mb-4 tracking-tight">Marketplace</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl text-lg">
            Browse our full selection of organic, sustainably grown products from independent farmers across the region.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden"
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filters
          </Button>
          <Button variant="outline" rightIcon={<ChevronDown className="w-4 h-4" />}>
            Sort by: Featured
          </Button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div className={`fixed inset-0 z-[60] transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
        <div className="absolute inset-y-0 left-0 w-[280px] bg-surface shadow-2xl flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
            <span className="font-display-lg text-xl font-bold text-primary">Filters</span>
            <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FiltersContent />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block sticky top-28">
          <FiltersContent />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {productsError && (
             <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm">
                Failed to load products.
             </div>
          )}
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="relative aspect-square rounded-2xl bg-surface-container"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-container rounded w-3/4"></div>
                    <div className="h-3 bg-surface-container rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productsData?.results.length === 0 ? (
             <div className="text-center py-32 bg-surface-container-low rounded-3xl border border-outline-variant/30">
                <p className="font-body-lg text-on-surface-variant">No products found matching your criteria.</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {productsData?.results.map((product) => {
                  const wishlisted = isInWishlist(product.id);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={product.id} 
                      className="group relative flex flex-col"
                    >
                      <Link to={`/product/${product.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-5 bg-[#F5F5F7]">
                        <img 
                          src={getImageUrl(product)} 
                          alt={product.name} 
                          className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/5">
                          <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-widest">Organic</span>
                        </div>
                      </Link>
                      
                      <div className="flex flex-col flex-1">
                        <Link to={`/product/${product.slug}`} className="block">
                          <h3 className="font-label-lg text-on-surface leading-tight mb-1 truncate">{product.name}</h3>
                          <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-body-sm mb-3">
                            <Star className="w-3.5 h-3.5 fill-current text-primary" />
                            <span className="font-medium text-on-surface">{product.rating}</span>
                            <span>({product.review_count})</span>
                          </div>
                          <span className="font-headline-sm text-on-surface">₹{product.effective_price}</span>
                        </Link>
                      </div>
                      
                      {/* Interactive Buttons */}
                      <div className="absolute bottom-28 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:opacity-0 opacity-100">
                        {!isAdmin && isAuthenticated && isCustomer && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                              wishlisted 
                                ? 'bg-error text-white hover:bg-error/90' 
                                : 'bg-white text-on-surface hover:bg-surface-container border border-outline-variant/30'
                            }`}
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        {!isAdmin && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }} 
                            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-md transform hover:scale-105 active:scale-95"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {productsData && productsData.count > productsData.results.length && (
                <div className="flex justify-center mt-16 gap-3">
                  {productsData.previous && (
                    <Button variant="outline" onClick={() => handlePageChange(Number(pageParam) - 1)}>
                      Previous
                    </Button>
                  )}
                  {productsData.next && (
                    <Button variant="outline" onClick={() => handlePageChange(Number(pageParam) + 1)}>
                      Next
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
