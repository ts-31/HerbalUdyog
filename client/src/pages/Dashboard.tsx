import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, LogOut, Star, ExternalLink, MessageSquare } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useWishlist } from '../hooks/useWishlist';
import { useOrders } from '../hooks/useOrders';
import { coreApi } from '../api/core';

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
        <div className="w-16 h-16 bg-[#ccebc7] text-[#154212] rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-7 h-7 fill-current" />
        </div>
        <h3 className="font-headline-md text-2xl text-[#1b1d0e] mb-3">Thank you for your feedback!</h3>
        <p className="font-body-md text-outline-variant">Your testimonial has been submitted and is pending review. It will appear on our homepage once approved.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-headline-lg text-2xl text-[#1b1d0e] mb-2">Share Your Experience</h2>
      <p className="font-body-md text-outline-variant mb-8">Your feedback helps others make informed wellness choices. Approved testimonials appear on our homepage.</p>
      {error && <div className="mb-4 p-3 bg-error/10 text-error rounded-xl text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md mb-2">Your Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-xl bg-surface focus:ring-2 focus:ring-primary outline-none font-body-md" />
          </div>
          <div>
            <label className="block font-label-md mb-2">Role / Location (optional)</label>
            <input type="text" placeholder="e.g. Wellness Enthusiast, Mumbai" value={form.role} onChange={e => setForm({...form, role: e.target.value})}
              className="w-full px-4 py-2.5 border border-outline-variant/50 rounded-xl bg-surface focus:ring-2 focus:ring-primary outline-none font-body-md" />
          </div>
        </div>
        <div>
          <label className="block font-label-md mb-2">Rating</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(star => (
              <button type="button" key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setForm({...form, rating: star})}
                className="p-1">
                <Star className={`w-6 h-6 ${star <= (hoveredRating || form.rating) ? 'fill-[#154212] text-[#154212]' : 'text-outline-variant/30'} transition-colors`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-label-md mb-2">Your Testimonial</label>
          <textarea required rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            placeholder="Tell us about your experience with our products and brand..."
            className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl bg-surface focus:ring-2 focus:ring-primary outline-none font-body-md resize-none" />
        </div>
        <button type="submit" disabled={submitting}
          className="px-8 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27] transition-colors disabled:opacity-70">
          {submitting ? 'Submitting...' : 'Submit Testimonial'}
        </button>
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
      <div className="min-h-screen bg-[#fbfbe2] flex justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbe2] py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="font-display-lg text-4xl text-[#1b1d0e] mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/20 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-2xl">
                  {profile?.first_name?.[0] || user?.email[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-headline-md text-[#1b1d0e] truncate" title={profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}>
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </h3>
                  <p className="font-body-sm text-outline-variant truncate" title={user?.email}>{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile Details', icon: User },
                  { id: 'orders', label: 'Order History', icon: Package },
                  { id: 'wishlist', label: 'Wishlist', icon: Heart },
                  { id: 'testimonials', label: 'My Testimonial', icon: MessageSquare },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === id ? 'bg-[#154212] text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white text-error rounded-3xl shadow-sm border border-outline-variant/20 font-label-md hover:bg-error-container hover:text-on-error-container transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </aside>
          
          {/* Content */}
          <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-outline-variant/20">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-headline-lg text-2xl text-[#1b1d0e]">Personal Information</h2>
                  {!isEditing && (
                    <button 
                      onClick={handleEditClick}
                      className="px-4 py-2 border border-outline-variant/50 rounded-lg text-sm font-label-md hover:bg-surface-container"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">First Name</label>
                        <input 
                          type="text" 
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">Last Name</label>
                        <input 
                          type="text" 
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">Phone Number</label>
                        <input 
                          type="text" 
                          value={editForm.phone_number}
                          onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-label-md text-on-surface mb-2">Address</label>
                        <input 
                          type="text" 
                          value={editForm.address_line1}
                          onChange={(e) => setEditForm({...editForm, address_line1: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">City</label>
                        <input 
                          type="text" 
                          value={editForm.city}
                          onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">State</label>
                        <input 
                          type="text" 
                          value={editForm.state}
                          onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface mb-2">Postal Code</label>
                        <input 
                          type="text" 
                          value={editForm.postal_code}
                          onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                          className="w-full px-4 py-2 border border-outline-variant/50 rounded-lg bg-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-outline-variant/50 rounded-lg font-label-md hover:bg-surface-container"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-6 py-2 bg-[#154212] text-white rounded-lg font-label-md hover:bg-[#2d5a27]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="font-label-sm text-outline-variant mb-1">Email</p>
                      <p className="font-body-md text-[#1b1d0e]">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="font-label-sm text-outline-variant mb-1">Phone</p>
                      <p className="font-body-md text-[#1b1d0e]">{profile?.phone_number || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2 border-t border-outline-variant/20 pt-6">
                      <h3 className="font-headline-sm text-lg text-[#1b1d0e] mb-4">Shipping Address</h3>
                      {profile?.address_line1 ? (
                        <div className="text-body-md text-[#1b1d0e]">
                          <p>{profile.address_line1}</p>
                          {profile.address_line2 && <p>{profile.address_line2}</p>}
                          <p>{profile.city}, {profile.state} {profile.postal_code}</p>
                        </div>
                      ) : (
                        <p className="font-body-md text-outline-variant italic">No address provided yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-headline-lg text-2xl text-[#1b1d0e] mb-6">Order History</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 border-dashed">
                    <Package className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                    <h3 className="font-headline-md text-lg text-on-surface mb-2">No orders yet</h3>
                    <p className="font-body-md text-outline-variant max-w-sm mx-auto mb-6">
                      Looks like you haven't made your first purchase. Explore our marketplace to discover organic wellness products.
                    </p>
                    <a href="/marketplace" className="inline-block px-6 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27]">
                      Browse Marketplace
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-[#fcfcdb]/30 hover:bg-[#fbfbe2]/70 transition-colors rounded-3xl p-6 border border-outline-variant/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-6 border-b border-outline-variant/20 gap-4">
                          <div>
                            <p className="font-label-md text-outline-variant mb-2">
                              Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-label-md text-sm capitalize shadow-sm ${
                              order.status === 'delivered' ? 'bg-[#154212] text-white' :
                              order.status === 'cancelled' ? 'bg-error text-white' :
                              'bg-[#e8f3d6] text-[#154212]'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="sm:text-right">
                            <p className="font-label-md text-outline-variant mb-1">Total Amount</p>
                            <p className="font-headline-md text-2xl text-[#1b1d0e]">₹{order.total}</p>
                            <Link to={`/orders/${order.id}`}
                              className="inline-flex items-center gap-1.5 text-sm text-[#154212] hover:underline mt-2 font-label-md bg-white px-3 py-1.5 rounded-lg border border-[#154212]/20 shadow-sm">
                              <ExternalLink className="w-4 h-4" /> View Details
                            </Link>
                          </div>
                        </div>
                        
                        <div className="space-y-5">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-5">
                              <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-outline-variant/10 shadow-sm">
                                <img 
                                  src={item.product_image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200"} 
                                  alt={item.product_name} 
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-headline-sm text-lg text-on-surface truncate">{item.product_name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="font-body-md text-outline-variant bg-white px-2 py-0.5 rounded border border-outline-variant/10 shadow-sm text-sm">Qty: {item.quantity}</span>
                                  {item.size && <span className="font-body-md text-outline-variant bg-white px-2 py-0.5 rounded border border-outline-variant/10 shadow-sm text-sm">{item.size}</span>}
                                </div>
                              </div>
                              <p className="font-label-lg text-[#1b1d0e]">₹{item.price}</p>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-sm font-label-md text-outline-variant bg-white inline-block px-3 py-1 rounded-full border border-outline-variant/10">
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
                <h2 className="font-headline-lg text-2xl text-[#1b1d0e] mb-6">Wishlist</h2>
                {wishlistLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 border-dashed">
                    <Heart className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                    <h3 className="font-headline-md text-lg text-on-surface mb-2">Your wishlist is empty</h3>
                    <p className="font-body-md text-outline-variant max-w-sm mx-auto mb-6">
                      Save your favorite items here to easily find them later.
                    </p>
                    <a href="/marketplace" className="inline-block px-6 py-3 bg-[#154212] text-white rounded-xl font-label-md hover:bg-[#2d5a27]">
                      Browse Marketplace
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm border border-outline-variant/10 group flex flex-col">
                        <a href={`/product/${item.slug}`} className="block aspect-square rounded-2xl overflow-hidden bg-surface-container-lowest mb-4">
                          <img 
                            src={item.image || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000"} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </a>
                        <h3 className="font-body-md text-[#1b1d0e] mb-1 truncate" title={item.name}>{item.name}</h3>
                        <div className="flex items-center justify-between mt-auto pt-3">
                          <span className="font-label-md text-lg text-[#1b1d0e]">₹{item.effective_price}</span>
                          <button 
                            onClick={() => toggleWishlist(item.product_id)}
                            className="w-10 h-10 shrink-0 border border-error text-error bg-error/10 rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <TestimonialTab />
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-headline-lg text-2xl text-[#1b1d0e] mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-outline-variant/30 rounded-xl">
                    <h3 className="font-label-lg mb-2">Change Password</h3>
                    <p className="text-sm text-outline-variant mb-4">Ensure your account is using a long, random password to stay secure.</p>
                    <button className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg font-label-md transition-colors">
                      Update Password
                    </button>
                  </div>
                  <div className="p-4 border border-error/30 rounded-xl bg-error-container/10">
                    <h3 className="font-label-lg text-error mb-2">Delete Account</h3>
                    <p className="text-sm text-outline-variant mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="px-4 py-2 bg-error text-on-error hover:bg-error/90 rounded-lg font-label-md transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
