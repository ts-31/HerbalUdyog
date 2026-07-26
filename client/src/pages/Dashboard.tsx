import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, LogOut, Star, ExternalLink, MessageSquare } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useWishlist } from '../hooks/useWishlist';
import { useOrders } from '../hooks/useOrders';
import { coreApi } from '../api/core';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { WishlistButton } from '../components/ui/WishlistButton';
import { motion, AnimatePresence } from 'motion/react';

// ─── Testimonial Submission Component ────────────────────────────────────────

const TestimonialTab = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await coreApi.submitTestimonial(form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-7 h-7 fill-current" />
        </div>
        <h3 className="font-headline-md text-2xl text-on-surface mb-3">Thank you for your feedback!</h3>
        <p className="font-body-md text-on-surface-variant">Your testimonial has been submitted and is pending review. It will appear on our homepage once approved.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-headline-lg text-2xl text-on-surface mb-2">Share Your Experience</h2>
      <p className="font-body-md text-on-surface-variant mb-8">Your feedback helps others make informed wellness choices. Approved testimonials appear on our homepage.</p>
      {error && <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Your Name"
            required 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <Input 
            label="Role / Location (optional)"
            type="text" 
            placeholder="e.g. Wellness Enthusiast, Mumbai" 
            value={form.role} 
            onChange={e => setForm({...form, role: e.target.value})}
          />
        </div>
        <div>
          <label className="block font-label-md mb-2 text-on-surface">Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(star => (
              <button type="button" key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setForm({...form, rating: star})}
                className="p-1">
                <Star className={`w-6 h-6 ${star <= (hoveredRating || form.rating) ? 'fill-primary text-primary' : 'text-outline-variant/30'} transition-colors`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-label-md mb-2 text-on-surface">Your Testimonial</label>
          <textarea required rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            placeholder="Tell us about your experience with our products and brand..."
            className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl bg-surface focus:ring-2 focus:ring-primary outline-none font-body-md resize-none" />
        </div>
        <Button type="submit" isLoading={submitting}>
          Submit Testimonial
        </Button>
      </form>
    </div>
  );
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { profile, loading, updateProfile } = useProfile();
  const { items: wishlistItems, loading: wishlistLoading, toggleWishlist } = useWishlist();
  const { orders, loading: ordersLoading } = useOrders();
  
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: ''
  });

  const handleEditClick = () => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone_number: profile.phone_number || '',
        address_line1: profile.address_line1 || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || ''
      });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-8 pb-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface mb-6 tracking-tight">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30 mb-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-2xl">
                  {profile?.first_name?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-headline-md text-on-surface truncate" title={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}>
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant truncate" title={user?.email}>{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {[
                  { id: 'profile', label: 'Profile Details', icon: User },
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'testimonials', label: 'My Testimonial', icon: MessageSquare },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-label-md transition-all ${activeTab === id ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-error-container/50 text-error rounded-3xl shadow-sm border border-error/20 font-label-md hover:bg-error-container transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </aside>
          
          {/* Content */}
          <main className="flex-1 bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant/30">
                      <h2 className="font-headline-lg text-2xl text-on-surface tracking-tight">Personal Information</h2>
                      {!isEditing && (
                        <Button 
                          variant="outline"
                          onClick={handleEditClick}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input 
                            label="First Name"
                            type="text" 
                            value={editForm.first_name}
                            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          />
                          <Input 
                            label="Last Name"
                            type="text" 
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          />
                          <Input 
                            label="Phone Number"
                            type="text" 
                            value={editForm.phone_number}
                            onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                          />
                          <div className="md:col-span-2">
                            <Input 
                              label="Address"
                              type="text" 
                              value={editForm.address_line1}
                              onChange={(e) => setEditForm({...editForm, address_line1: e.target.value})}
                            />
                          </div>
                          <Input 
                            label="City"
                            type="text" 
                            value={editForm.city}
                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                          />
                          <Input 
                            label="State"
                            type="text" 
                            value={editForm.state}
                            onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                          />
                          <Input 
                            label="Postal Code"
                            type="text" 
                            value={editForm.postal_code}
                            onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-4 pt-6 mt-4 border-t border-outline-variant/30">
                          <Button 
                            variant="outline"
                            type="button"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email</p>
                          <p className="font-body-lg text-on-surface">{profile?.email}</p>
                        </div>
                        <div>
                          <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-2">Phone</p>
                          <p className="font-body-lg text-on-surface">{profile?.phone_number || 'Not provided'}</p>
                        </div>
                        <div className="md:col-span-2 pt-6 border-t border-outline-variant/30">
                          <h3 className="font-headline-sm text-lg text-on-surface mb-4 tracking-tight">Shipping Address</h3>
                          {profile?.address_line1 ? (
                            <div className="text-body-lg text-on-surface leading-relaxed">
                              <p>{profile.address_line1}</p>
                              {profile.address_line2 && <p>{profile.address_line2}</p>}
                              <p>{profile.city}, {profile.state} {profile.postal_code}</p>
                            </div>
                          ) : (
                            <p className="font-body-lg text-on-surface-variant italic">No address provided yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-headline-lg text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/30 tracking-tight">Order History</h2>
                    {ordersLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 border-dashed">
                        <Package className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-4" />
                        <h3 className="font-headline-md text-lg text-on-surface mb-2">No orders yet</h3>
                        <p className="font-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
                          Looks like you haven't made your first purchase. Explore our marketplace to discover organic wellness products.
                        </p>
                        <Link to="/marketplace">
                          <Button>Browse Marketplace</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="bg-surface hover:bg-surface-container-lowest transition-colors rounded-[2rem] p-8 border border-outline-variant/30 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-outline-variant/30 gap-4">
                              <div>
                                <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-3">
                                  Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-label-md text-sm capitalize shadow-sm ${
                                  order.status === 'delivered' ? 'bg-primary text-on-primary' :
                                  order.status === 'cancelled' ? 'bg-error text-white' :
                                  'bg-primary-container text-on-primary-container border border-primary/10'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="sm:text-right">
                                <p className="font-label-md text-xs uppercase tracking-widest text-on-surface-variant mb-2">Total Amount</p>
                                <p className="font-headline-md text-3xl text-on-surface tracking-tight mb-2">₹{order.total}</p>
                                <Link to={`/orders/${order.id}`}
                                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-label-md px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                                  <ExternalLink className="w-3.5 h-3.5" /> View Details
                                </Link>
                              </div>
                            </div>
                            
                            <div className="space-y-5">
                              {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center gap-6">
                                  <div className="w-20 h-20 bg-surface-container-lowest rounded-2xl overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm">
                                    <img 
                                      src={item.product_image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200"} 
                                      alt={item.product_name} 
                                      className="w-full h-full object-cover mix-blend-multiply hover:scale-105 transition-transform duration-500" 
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-label-lg text-lg text-on-surface truncate mb-1">{item.product_name}</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="font-body-sm text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline-variant/20 shadow-sm text-xs uppercase tracking-widest">Qty: {item.quantity}</span>
                                      {item.size && <span className="font-body-sm text-on-surface-variant bg-surface px-2.5 py-1 rounded-md border border-outline-variant/20 shadow-sm text-xs uppercase tracking-widest">{item.size}</span>}
                                    </div>
                                  </div>
                                  <p className="font-headline-sm text-on-surface">₹{item.price}</p>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <p className="text-xs font-label-md uppercase tracking-widest text-on-surface-variant bg-surface-container inline-block px-3 py-1.5 rounded-md border border-outline-variant/20 mt-2">
                                  +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="font-headline-lg text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/30 tracking-tight">Wishlist</h2>
                    {wishlistLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : wishlistItems.length === 0 ? (
                      <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 border-dashed">
                        <Heart className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-4" />
                        <h3 className="font-headline-md text-lg text-on-surface mb-2">Your wishlist is empty</h3>
                        <p className="font-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
                          Save your favorite items here to easily find them later.
                        </p>
                        <Link to="/marketplace">
                          <Button>Browse Marketplace</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                          {wishlistItems.map((item) => (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8, y: -10 }}
                              transition={{ duration: 0.3 }}
                              key={item.product_id || item.id} 
                              className="relative group bg-surface-container-lowest rounded-[2rem] p-4 shadow-sm hover:shadow-md transition-all border border-outline-variant/30 flex flex-col"
                            >
                              <Link to={`/product/${item.slug}`} className="block aspect-square rounded-2xl overflow-hidden bg-[#F5F5F7] mb-4">
                                <img 
                                  src={item.image || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000"} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                                />
                              </Link>
                              <Link to={`/product/${item.slug}`} className="block">
                                <h3 className="font-label-lg text-on-surface mb-1 truncate" title={item.name}>{item.name}</h3>
                                <div className="flex items-center justify-between mt-auto pt-3">
                                  <span className="font-headline-sm text-on-surface">₹{item.effective_price}</span>
                                </div>
                              </Link>
                              <div className="absolute top-6 right-6">
                                <WishlistButton
                                  isWishlisted={true}
                                  onToggle={() => toggleWishlist(item.product_id || item.id)}
                                  size="md"
                                />
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'testimonials' && (
                  <TestimonialTab />
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="font-headline-lg text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/30 tracking-tight">Account Settings</h2>
                    <div className="space-y-6">
                      <div className="p-6 border border-outline-variant/30 rounded-2xl bg-surface">
                        <h3 className="font-headline-sm text-lg mb-2 text-on-surface">Change Password</h3>
                        <p className="text-sm text-on-surface-variant font-body-sm mb-6">Ensure your account is using a long, random password to stay secure.</p>
                        <Button variant="outline">
                          Update Password
                        </Button>
                      </div>
                      <div className="p-6 border border-error/30 rounded-2xl bg-error-container/10">
                        <h3 className="font-headline-sm text-lg text-error mb-2">Delete Account</h3>
                        <p className="text-sm text-on-error-container/80 font-body-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="px-6 py-2.5 bg-error text-white hover:bg-error/90 rounded-xl font-label-md transition-colors shadow-sm">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
