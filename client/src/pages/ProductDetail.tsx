import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, ShoppingBag, Heart, Search, ShoppingCart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';

export const ProductDetail = () => {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState('100g');
  const [activeTab, setActiveTab] = useState('Description');
  
  const { product, loading, error } = useProduct(slug);
  
  // Fetch related products from the same category
  const { data: relatedData } = useProducts({
    category: product?.category.slug,
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

  const getImageUrl = (images: any[], fallbackIndex = 0) => {
    if (images && images.length > 0) {
      const img = images[fallbackIndex] || images[0];
      return img.image;
    }
    return "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000";
  };

  const primaryImage = getImageUrl(product.images);
  const thumbnails = [
    primaryImage,
    "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=300"
  ]; // Fallbacks for demo since we only have 1 image per product

  const relatedProducts = relatedData?.results.filter(p => p.id !== product.id).slice(0, 4) || [];

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
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((img, idx) => (
                <button key={idx} className={`aspect-square rounded-2xl overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors bg-white`}>
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
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
              {!isAdmin && (<button className="flex-1 bg-[#154212] text-white py-4 rounded-xl font-label-md text-lg hover:bg-[#2d5a27] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>)}
              {!isAdmin && (<button className="w-16 h-16 shrink-0 border border-outline-variant rounded-xl flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                <Heart className="w-6 h-6" />
              </button>)}
            </div>

            {/* Sourcing Card */}
            <div className="bg-[#f5f5dc] rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-[#e4e4cc]">
              <img 
                src="https://images.unsplash.com/photo-1595825833427-bcfa0ba1b5bc?auto=format&fit=crop&q=80&w=150" 
                alt="Farmer Rajesh" 
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
              />
              <div>
                <p className="text-xs font-bold tracking-wider text-outline mb-1 uppercase font-body-sm">Directly Sourced</p>
                <h4 className="font-label-md text-[#1b1d0e] mb-2">Cultivated by Farmer Rajesh Kumar</h4>
                <p className="text-sm text-outline-variant leading-relaxed font-body-sm">
                  Harvested 12 days ago in the pristine fields of Uttarakhand using 100% regenerative organic methods.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20 border-b border-outline-variant/30">
          <div className="flex overflow-x-auto hide-scrollbar gap-8">
            {['Description', 'Benefits', 'Ingredients'].map(tab => (
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
            <p className="text-[#42493e] font-body-md leading-relaxed mb-4 whitespace-pre-wrap">
              {product.description}
            </p>
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
                    <img src={getImageUrl(prod.images)} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
