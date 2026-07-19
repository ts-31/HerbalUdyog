import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ShoppingCart, Star, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useWishlist } from '../hooks/useWishlist';

export const Marketplace = () => {
  const { isAdmin, isAuthenticated, isCustomer } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  
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
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const getImageUrl = (product: any) => {
    if (product.primary_image) {
      return product.primary_image;
    }
    // Fallback if needed
    return "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600";
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-display-lg text-5xl mb-4">Marketplace</h1>
          <p className="font-body-md text-outline-variant max-w-2xl">
            Browse our full selection of organic, sustainably grown products from independent farmers across the region.
          </p>
        </div>
        <div className="flex gap-4">
          <button
                       className="flex items-center gap-2 px-4 py-2 border border-outline/30 rounded-full font-label-md text-on-surface hover:bg-surface-container transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button
                       className="flex items-center gap-2 px-4 py-2 border border-outline/30 rounded-full font-label-md text-on-surface hover:bg-surface-container transition-colors">
            Sort by: Featured
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 hidden md:block space-y-8">
          <div>
            <h3 className="font-label-md text-lg border-b border-outline/20 pb-2 mb-4">Categories</h3>
            {categoriesLoading ? (
               <div className="animate-pulse space-y-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-outline-variant/30 rounded w-3/4"></div>)}
               </div>
            ) : (
              <ul className="space-y-3">
                <li>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={categoryParam === ''}
                      onChange={() => handleCategorySelect('')}
                      className="w-4 h-4 rounded-full border-outline text-primary focus:ring-primary accent-primary" 
                    />
                    <span className={`font-body-md ${categoryParam === '' ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-primary'}`}>All Products</span>
                  </label>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={categoryParam === cat.slug}
                        onChange={() => handleCategorySelect(cat.slug)}
                        className="w-4 h-4 rounded-full border-outline text-primary focus:ring-primary accent-primary" 
                      />
                      <span className={`font-body-md ${categoryParam === cat.slug ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-primary'}`}>{cat.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {productsError && (
             <div className="p-4 bg-error-container text-on-error-container rounded-xl">
                Failed to load products.
             </div>
          )}
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse block bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/10">
                  <div className="relative aspect-square rounded-2xl mb-4 bg-outline-variant/20"></div>
                  <div className="h-4 bg-outline-variant/20 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-outline-variant/20 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-end pt-2">
                    <div className="h-5 bg-outline-variant/20 rounded w-1/3"></div>
                    <div className="w-10 h-10 bg-outline-variant/20 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productsData?.results.length === 0 ? (
             <div className="text-center py-20">
                <p className="font-body-lg text-outline">No products found matching your criteria.</p>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData?.results.map((product) => {
                  const wishlisted = isInWishlist(product.id);
                  return (
                    <div key={product.id} className="relative block group bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
                      <Link to={`/product/${product.slug}`} className="block">
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-surface-container-lowest">
                          <img 
                            src={getImageUrl(product)} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-outline-variant/10">
                            <span className="font-label-sm text-xs font-bold text-[#154212]">Organic</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-body-md text-[#1b1d0e] leading-tight truncate">{product.name}</h3>
                          <div className="flex items-center gap-1 text-outline-variant text-sm font-body-sm">
                            <Star className="w-3.5 h-3.5 text-[#1b1d0e] fill-[#1b1d0e]" />
                            <span className="text-[#1b1d0e] font-medium">{product.rating}</span>
                            <span>({product.review_count})</span>
                          </div>
                          <div className="flex justify-between items-end pt-2">
                            <span className="font-label-md text-xl text-[#1b1d0e]">₹{product.effective_price}</span>
                          </div>
                        </div>
                      </Link>
                      
                      {/* Interactive Buttons (Outside Link) */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {!isAdmin && isAuthenticated && isCustomer && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                              wishlisted 
                                ? 'bg-error/10 text-error hover:bg-error/20' 
                                : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'
                            }`}
                            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        {!isAdmin && (
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }} 
                            className="w-10 h-10 bg-[#f5f5dc] text-[#1b1d0e] rounded-full flex items-center justify-center hover:bg-[#154212] hover:text-white transition-colors shadow-sm"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination */}
              {productsData && productsData.count > productsData.results.length && (
                <div className="flex justify-center mt-12 gap-2">
                  {productsData.previous && (
                    <button 
                      onClick={() => handlePageChange(Number(pageParam) - 1)}
                      className="px-4 py-2 border border-outline/30 rounded-lg hover:bg-surface-container"
                    >
                      Previous
                    </button>
                  )}
                  {productsData.next && (
                    <button 
                      onClick={() => handlePageChange(Number(pageParam) + 1)}
                      className="px-4 py-2 border border-outline/30 rounded-lg hover:bg-surface-container"
                    >
                      Next
                    </button>
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
