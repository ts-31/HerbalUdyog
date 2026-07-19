import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, ShoppingBag, Heart, Search, ShoppingCart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';
import { ReviewForm } from '../components/products/ReviewForm';

export const ProductDetail = () => {
  const { slug } = useParams();
  const { isAdmin, isAuthenticated, isCustomer } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState('100g');
  const [activeTab, setActiveTab] = useState('Description');
  
  const { product, loading, error } = useProduct(slug);
  
  // Track selected image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Set initial selected image when product loads
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const primary = product.images.find((img: any) => img.is_primary) || product.images[0];
      setSelectedImage(primary.image_url || primary.image);
    }
  }, [product]);
  
  // Fetch related products from the same category
  const { data: relatedData } = useProducts({
    category: product?.category?.slug,
    page: '1'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#fbfbe2] min-h-screen pb-20 pt-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#fbfbe2] min-h-screen pb-20 pt-20 text-center">
        <h2 className="font-display-md text-2xl text-error mb-4">Product not found</h2>
        <Link to="/marketplace" className="text-primary underline">Return to Marketplace</Link>
      </div>
    );
  }

  const primaryImage = selectedImage || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000";
  const allImages = product.images || [];

  const relatedProducts = relatedData?.results.filter(p => p.id !== product.id).slice(0, 4) || [];
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="bg-[#fbfbe2] min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-outline-variant mb-8 space-x-2 font-body-sm">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-on-surface font-medium">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] sm:aspect-square bg-white rounded-3xl overflow-hidden relative border border-outline-variant/20 shadow-sm">
              <img 
                src={primaryImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors text-on-surface">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {allImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img: any) => {
                  const imgUrl = img.image_url || img.image;
                  return (
                    <button 
                      key={img.id || imgUrl} 
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 ${selectedImage === imgUrl ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors bg-white`}
                    >
                      <img src={imgUrl} alt={img.alt_text || 'Thumbnail'} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div>
            {product.is_featured && (
              <span className="inline-block bg-[#ccebc7] text-[#154212] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Featured Product
              </span>
            )}
            <h1 className="font-display-lg text-4xl md:text-5xl mb-4 text-[#1b1d0e]">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-outline-variant mb-6 font-body-sm">
              <div className="flex items-center text-[#154212]">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-[#1b1d0e] font-medium">{product.rating}</span>
              </div>
              <span>({product.review_count} Reviews)</span>
              <span className="hidden sm:inline">|</span>
              <span>SKU: {product.sku || `HZ-${product.id}`}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl font-bold text-[#1b1d0e]">₹{product.effective_price}</span>
              {product.discount_price && (
                <>
                  <span className="text-xl line-through text-outline-variant">₹{product.price}</span>
                  <span className="text-[#ba1a1a] font-medium text-sm">Sale</span>
                </>
              )}
            </div>
            <p className="text-sm text-outline-variant mb-8 font-body-sm">
              Tax included. Shipping calculated at checkout.
            </p>
            
            <div className="mb-8">
              <p className="font-label-md text-on-surface mb-3">Quantity (Grams)</p>
              <div className="flex flex-wrap gap-3">
                {['100g', '250g', '500g'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setQuantity(size)}
                    className={`px-8 py-3 rounded-full border text-sm font-medium transition-colors ${
                      quantity === size 
                        ? 'bg-[#154212] border-[#154212] text-white' 
                        : 'bg-transparent border-outline-variant text-on-surface hover:border-[#154212]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              {!isAdmin && (
                <button 
                  onClick={() => addItem(product, 1, quantity)}
                  className="flex-1 bg-[#154212] text-white py-4 rounded-xl font-label-md text-lg hover:bg-[#2d5a27] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
              {!isAdmin && isAuthenticated && isCustomer && (
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-16 h-16 shrink-0 border rounded-xl flex items-center justify-center transition-colors ${
                    wishlisted 
                      ? 'border-error text-error bg-error/10 hover:bg-error/20' 
                      : 'border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                  aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-6 h-6 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>


          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20 border-b border-outline-variant/30">
          <div className="flex overflow-x-auto hide-scrollbar gap-8">
            {['Description', 'Benefits', 'Ingredients', 'Reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base whitespace-nowrap font-label-md transition-colors ${
                  activeTab === tab 
                    ? 'text-[#154212] border-b-2 border-[#154212]' 
                    : 'text-outline-variant hover:text-[#1b1d0e]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="py-8 max-w-3xl">
            {activeTab === 'Description' && (
              <p className="text-[#42493e] font-body-md leading-relaxed mb-4 whitespace-pre-wrap">
                {product.description}
              </p>
            )}
            {activeTab === 'Reviews' && (
              <div className="space-y-12">
                <div>
                  <h3 className="font-headline-md text-2xl mb-6">Customer Reviews</h3>
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <p className="text-outline-variant font-body-md">No reviews yet. Be the first to review this product!</p>
                  ) : (
                    <div className="space-y-6">
                      {product.reviews.map(review => (
                        <div key={review.id} className="bg-white border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-label-lg font-bold text-[#1b1d0e]">{review.user_name}</h4>
                            <span className="text-sm text-outline-variant font-body-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-[#154212] mb-3">
                            {[1,2,3,4,5].map(star => (
                              <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-outline-variant/30'}`} />
                            ))}
                          </div>
                          <p className="font-body-md text-[#42493e]">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isAuthenticated && isCustomer && (
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8">
                    <h3 className="font-headline-sm text-xl mb-6">Write a Review</h3>
                    <ReviewForm slug={product.slug} onSuccess={() => window.location.reload()} />
                  </div>
                )}
                {!isAuthenticated && (
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 text-center">
                    <p className="font-body-md text-outline-variant mb-4">Please log in to write a review.</p>
                    <Link to="/auth?mode=login" className="px-6 py-2 bg-[#154212] text-white rounded-lg font-label-md inline-block">Log In</Link>
                  </div>
                )}
              </div>
            )}
            {(activeTab === 'Benefits' || activeTab === 'Ingredients') && (
              <p className="text-outline-variant font-body-md italic">Information for {activeTab.toLowerCase()} is coming soon.</p>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-md text-2xl text-[#1b1d0e]">Similar Products</h2>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-180 text-on-surface" />
                </button>
                <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight className="w-5 h-5 text-on-surface" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <Link to={`/product/${prod.slug}`} key={prod.id} className="block bg-white rounded-3xl p-4 shadow-sm border border-outline-variant/10 group cursor-pointer hover:shadow-md transition-all">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-lowest mb-4">
                    <img src={prod.primary_image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-body-md text-[#1b1d0e] mb-1 truncate">{prod.name}</h3>
                  <div className="flex items-center gap-1 text-outline-variant text-sm font-body-sm mb-3">
                    <Star className="w-3.5 h-3.5 text-[#1b1d0e]" /> {prod.rating} ({prod.review_count})
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-label-md text-lg text-[#1b1d0e]">₹{prod.effective_price}</span>
                    {!isAdmin && (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-10 h-10 bg-[#f5f5dc] rounded-full flex items-center justify-center hover:bg-[#154212] hover:text-white transition-colors text-[#1b1d0e]">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
