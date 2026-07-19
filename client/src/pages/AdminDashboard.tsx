import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/auth');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-64 bg-surface-container-low border-r border-outline-variant/30 flex-col h-screen sticky top-0 hidden md:flex">
        <div className="p-6">
          <h1 className="font-headline-md text-on-surface">Admin Panel</h1>
          <p className="font-body-md text-on-surface-variant mt-1">HerbalUdyog System</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-xl font-label-md transition-colors">
            <LayoutDashboard className="w-5 h-5"/> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md transition-colors">
            <Users className="w-5 h-5"/> User Management
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md transition-colors">
            <ShoppingBag className="w-5 h-5"/> Orders & Logistics
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md transition-colors">
            <Settings className="w-5 h-5"/> System Settings
          </a>
        </nav>
        <div className="p-4 border-t border-outline-variant/30">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container rounded-xl font-label-md transition-colors">
            <LogOut className="w-5 h-5"/> Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="font-headline-lg text-on-surface mb-2">System Overview</h2>
          <p className="font-body-md text-on-surface-variant">Global metrics and system health.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-md text-on-surface-variant">Total Users</h3>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center"><Users className="w-6 h-6"/></div>
            </div>
            <p className="font-display-lg text-on-surface mb-2">1,248</p>
            <div className="flex items-center font-label-sm text-primary">
              <TrendingUp className="w-4 h-4 mr-1"/> +12% this month
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-md text-on-surface-variant">Total Revenue</h3>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center"><ShoppingBag className="w-6 h-6"/></div>
            </div>
            <p className="font-display-lg text-on-surface mb-2">₹8.4L</p>
            <div className="flex items-center font-label-sm text-primary">
              <TrendingUp className="w-4 h-4 mr-1"/> +8% this month
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-label-md text-on-surface-variant">Active Farmers</h3>
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center"><LayoutDashboard className="w-6 h-6"/></div>
            </div>
            <p className="font-display-lg text-on-surface mb-2">342</p>
            <div className="flex items-center font-label-sm text-on-surface-variant">
              Stable network size
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/20 p-6">
          <h3 className="font-headline-md text-on-surface mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-container-low rounded-2xl transition-colors border border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md">
                    U{i}
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">New Farmer Registration</p>
                    <p className="font-body-md text-sm text-on-surface-variant">Rajesh Kumar verified from Uttarakhand</p>
                  </div>
                </div>
                <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
