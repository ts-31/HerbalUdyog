import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, ShoppingBag, Heart, Search, ShoppingCart } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../hooks/useWishlist';
import { ReviewForm } from '../components/products/ReviewForm';
import { Button } from '../components/ui/Button';
import { WishlistButton } from '../components/ui/WishlistButton';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { isAdmin, isAuthenticated, isCustomer } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState('100g');
  const [activeTab, setActiveTab] = useState('Description');

  // Allow deep-linking to a specific tab (used from Order Detail to jump to Reviews).
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab && ['Description', 'Benefits', 'Ingredients', 'Reviews'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  const { product, loading, error, refetch } = useProduct(slug);
  
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
      <div className="bg-surface min-h-screen pb-20 pt-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-surface min-h-screen pb-20 pt-20 text-center">
        <h2 className="font-display-md text-2xl text-error mb-4">Product not found</h2>
        <Link to="/marketplace" className="text-primary underline">Return to Marketplace</Link>
      </div>
    );
  }

  const primaryImage = selectedImage;
  const allImages = product.images || [];

  const relatedProducts = relatedData?.results.filter(p => p.id !== product.id).slice(0, 4) || [];
  const wishlisted = isInWishlist(product.id);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-surface min-h-screen pb-32">
      <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-16">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center text-xs text-on-surface-variant mb-6 space-x-2 font-label-sm uppercase tracking-widest"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-on-surface font-semibold">{product.name}</span>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-32">
          {/* Left - Images */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="aspect-[4/3] sm:aspect-square bg-surface-container-lowest rounded-[2rem] overflow-hidden relative border border-outline-variant/30 group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={primaryImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={primaryImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
              </AnimatePresence>
              <button className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:bg-white transition-colors text-on-surface opacity-0 group-hover:opacity-100 duration-300">
                <Search className="w-5 h-5" />
              </button>
            </div>
            {allImages.length > 0 && (
              <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x pb-4">
                {allImages.map((img: any) => {
                  const imgUrl = img.image_url || img.image;
                  return (
                    <button 
                      key={img.id || imgUrl} 
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 snap-start rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === imgUrl ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-outline-variant'} bg-surface-container-lowest`}
                    >
                      <img src={imgUrl} alt={img.alt_text || 'Thumbnail'} className="w-full h-full object-cover mix-blend-multiply" />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Right - Info */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center"
          >
            {product.is_featured && (
              <motion.span variants={itemVariants} className="inline-block bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 w-max shadow-sm">
                Featured
              </motion.span>
            )}
            <motion.h1 variants={itemVariants} className="font-display-lg text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight text-on-surface">
              {product.name}
            </motion.h1>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant mb-8 font-body-sm">
              <div className="flex items-center text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1.5 text-on-surface font-medium">{product.rating}</span>
              </div>
              <span className="opacity-50">•</span>
              <span>{product.review_count} Reviews</span>
              <span className="opacity-50 hidden sm:inline">•</span>
              <span className="font-mono text-xs text-on-surface-variant/70">SKU: {product.sku || `HZ-${product.id}`}</span>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-end gap-4 mb-3">
              <span className="text-4xl font-display-md font-semibold text-on-surface">₹{product.effective_price}</span>
              {product.discount_price && (
                <>
                  <span className="text-xl line-through text-on-surface-variant/50 mb-1">₹{product.price}</span>
                  <span className="text-error font-semibold text-sm mb-2 uppercase tracking-wide">Sale</span>
                </>
              )}
            </motion.div>
            <motion.p variants={itemVariants} className="text-sm text-on-surface-variant mb-12 font-body-sm">
              Tax included. Shipping calculated at checkout.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mb-12">
              <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-4">Quantity (Grams)</p>
              <div className="flex flex-wrap gap-3">
                {['100g', '250g', '500g'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setQuantity(size)}
                    className={`px-8 py-3 rounded-full border text-sm font-semibold transition-all ${
                      quantity === size 
                        ? 'bg-primary border-primary text-on-primary shadow-md transform scale-105' 
                        : 'bg-transparent border-outline-variant text-on-surface hover:border-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4 mb-12">
              {!isAdmin && (
                <Button 
                  size="lg"
                  onClick={() => addItem(product, 1, quantity)}
                  className="flex-1 text-lg h-14"
                  leftIcon={<ShoppingBag className="w-5 h-5" />}
                >
                  Add to Cart
                </Button>
              )}
              {!isAdmin && (
                <WishlistButton
                  isWishlisted={wishlisted}
                  size="lg"
                  onToggle={() => {
                    if (!isAuthenticated) {
                      toast.info('Please sign in to save items to your wishlist');
                      return;
                    }
                    toggleWishlist(product.id);
                    if (wishlisted) {
                      toast.info(`Removed ${product.name} from wishlist`);
                    } else {
                      toast.success(`Saved ${product.name} to wishlist`);
                    }
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-32"
        >
          <div className="flex overflow-x-auto hide-scrollbar gap-8 border-b border-outline-variant/30 mb-10">
            {['Description', 'Benefits', 'Ingredients', 'Reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm uppercase tracking-widest font-label-md transition-all relative ${
                  activeTab === tab 
                    ? 'text-primary font-bold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                  />
                )}
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl"
            >
              {activeTab === 'Description' && (
                <div className="prose prose-lg text-on-surface/80">
                  <p className="font-body-lg leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}
              {activeTab === 'Reviews' && (
                <div className="space-y-16">
                  <div>
                    <h3 className="font-headline-md text-3xl mb-8 tracking-tight">Customer Reviews</h3>
                    {(!product.reviews || product.reviews.length === 0) ? (
                      <div className="bg-surface-container-low p-10 rounded-3xl text-center">
                        <p className="text-on-surface-variant font-body-lg">No reviews yet. Be the first to share your experience!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {product.reviews.map(review => (
                          <div key={review.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2rem] p-8 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-label-lg font-bold text-on-surface">{review.user_name}</h4>
                              <span className="text-sm text-on-surface-variant font-mono">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-primary mb-6">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-outline-variant/30'}`} />
                              ))}
                            </div>
                            <p className="font-body-lg text-on-surface/80 leading-relaxed">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAuthenticated && isCustomer && (
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-10">
                      {product.user_has_reviewed ? (
                        <div className="text-center">
                          <h3 className="font-headline-sm text-2xl mb-3 tracking-tight">Thanks for your review</h3>
                          <p className="font-body-lg text-on-surface-variant">
                            You’ve already reviewed this product. Only one review is allowed per product.
                          </p>
                        </div>
                      ) : !product.user_can_review ? (
                        <div className="text-center">
                          <h3 className="font-headline-sm text-2xl mb-3 tracking-tight">Review available after delivery</h3>
                          <p className="font-body-lg text-on-surface-variant">
                            You can review this product only after at least one order containing it has been delivered.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-headline-sm text-2xl mb-8 tracking-tight">Write a Review</h3>
                          <ReviewForm
                            slug={product.slug}
                            onSuccess={async () => {
                              await refetch();
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                  {!isAuthenticated && (
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-[2rem] p-10 text-center">
                      <p className="font-body-lg text-on-surface-variant mb-6">Please log in to write a review.</p>
                      <Link to="/auth?mode=login">
                        <Button>Log In</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              {(activeTab === 'Benefits' || activeTab === 'Ingredients') && (
                <div className="bg-surface-container-low p-10 rounded-3xl text-center">
                  <p className="text-on-surface-variant font-body-lg italic">Information for {activeTab.toLowerCase()} is coming soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-display-md text-3xl md:text-4xl text-on-surface tracking-tight">Similar Products</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((prod, idx) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link to={`/product/${prod.slug}`} className="group relative flex flex-col h-full">
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-[#F5F5F7]">
                      <img src={prod.primary_image} alt={prod.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="font-label-lg text-on-surface mb-1 truncate">{prod.name}</h3>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-body-sm mb-3">
                        <Star className="w-3.5 h-3.5 fill-current text-primary" /> {prod.rating} ({prod.review_count})
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-headline-sm text-on-surface">₹{prod.effective_price}</span>
                        {!isAdmin && (
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-sm transform group-hover:scale-105">
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
