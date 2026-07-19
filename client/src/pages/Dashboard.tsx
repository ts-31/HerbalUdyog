import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  
  const [activeTab, setActiveTab] = useState('profile');
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
                <div>
                  <h3 className="font-headline-md text-[#1b1d0e] truncate">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User'}
                  </h3>
                  <p className="font-body-sm text-outline-variant truncate">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-[#154212] text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <User className="w-5 h-5" />
                  Profile Details
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#154212] text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <Package className="w-5 h-5" />
                  Order History
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'wishlist' ? 'bg-[#154212] text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-[#154212] text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
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
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-headline-lg text-2xl text-[#1b1d0e] mb-6">Wishlist</h2>
                <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 border-dashed">
                  <Heart className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                  <h3 className="font-headline-md text-lg text-on-surface mb-2">Your wishlist is empty</h3>
                  <p className="font-body-md text-outline-variant max-w-sm mx-auto mb-6">
                    Save your favorite items here to easily find them later.
                  </p>
                </div>
              </div>
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
