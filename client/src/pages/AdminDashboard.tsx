import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Tag, LogOut, Package,
  TrendingUp, Users, Newspaper, Mail, Star, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminCategoriesTab } from './admin/AdminCategoriesTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCustomersTab } from './admin/AdminCustomersTab';
import { AdminBlogTab } from './admin/AdminBlogTab';
import { AdminContactTab } from './admin/AdminContactTab';
import { AdminTestimonialsTab } from './admin/AdminTestimonialsTab';
import { adminStatsApi, AdminStats } from '../api/admin';

type Tab = 'overview' | 'products' | 'categories' | 'orders' | 'customers' | 'blog' | 'contact' | 'testimonials';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'products',      label: 'Products',       icon: Package },
  { id: 'categories',    label: 'Categories',     icon: Tag },
  { id: 'orders',        label: 'Orders',         icon: ShoppingCart },
  { id: 'customers',     label: 'Customers',      icon: Users },
  { id: 'blog',          label: 'Blog',           icon: Newspaper },
  { id: 'contact',       label: 'Contact Inbox',  icon: Mail },
  { id: 'testimonials',  label: 'Testimonials',   icon: Star },
];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  overview:     'System overview and key metrics',
  products:     'Create, edit, and manage your product catalog',
  categories:   'Organise products into categories',
  orders:       'View and manage all customer orders',
  customers:    'Browse and manage registered customers',
  blog:         'Create, edit, and publish blog articles',
  contact:      'View and respond to customer inquiries',
  testimonials: 'Approve or remove customer testimonials',
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminStatsApi.get();
        setStats(data);
      } catch {
        // Non-critical — fail silently
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const formatRevenue = (val: string) => {
    const n = parseFloat(val);
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-outline-variant/20 flex-col h-screen sticky top-0 hidden md:flex shadow-sm">
        <div className="p-6 border-b border-outline-variant/10">
          <h1 className="font-bold text-lg text-on-surface tracking-tight">HerbalUdyog</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
              {user?.first_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-outline-variant/20 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-semibold text-on-surface capitalize">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-on-surface-variant">{TAB_DESCRIPTIONS[activeTab]}</p>
          </div>

          {/* Mobile tab switcher */}
          <div className="flex md:hidden gap-1 overflow-x-auto">
            {NAV_ITEMS.map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors shrink-0 ${activeTab === id ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </header>

        <div className="p-6">
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Live Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Customers',
                    icon: Users,
                    color: 'bg-blue-100 text-blue-700',
                    value: statsLoading ? '—' : String(stats?.total_customers ?? '—'),
                    note: 'Registered accounts',
                  },
                  {
                    label: 'Total Orders',
                    icon: ShoppingBag,
                    color: 'bg-green-100 text-green-700',
                    value: statsLoading ? '—' : String(stats?.total_orders ?? '—'),
                    note: 'All time orders',
                  },
                  {
                    label: 'Active Products',
                    icon: Package,
                    color: 'bg-purple-100 text-purple-700',
                    value: statsLoading ? '—' : String(stats?.total_products ?? '—'),
                    note: 'Listed in catalog',
                  },
                  {
                    label: 'Total Revenue',
                    icon: TrendingUp,
                    color: 'bg-orange-100 text-orange-700',
                    value: statsLoading ? '—' : (stats?.total_revenue ? formatRevenue(stats.total_revenue) : '₹0'),
                    note: 'From all orders',
                  },
                ].map(({ label, icon: Icon, color, value, note }) => (
                  <div key={label} className="bg-white rounded-2xl border border-outline-variant/20 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-on-surface-variant">{label}</span>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-on-surface">{value}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{note}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
                <h3 className="font-semibold text-on-surface mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { tab: 'products' as Tab, label: 'Manage Products', sub: 'Add, edit, or remove products', icon: Package, bg: 'bg-primary-container text-on-primary-container' },
                    { tab: 'orders' as Tab, label: 'Manage Orders', sub: 'Update order statuses', icon: ShoppingCart, bg: 'bg-green-100 text-green-700' },
                    { tab: 'blog' as Tab, label: 'Write Article', sub: 'Create a new blog post', icon: Newspaper, bg: 'bg-purple-100 text-purple-700' },
                    { tab: 'contact' as Tab, label: 'Inbox', sub: 'View customer inquiries', icon: Mail, bg: 'bg-orange-100 text-orange-700' },
                  ].map(({ tab, label, sub, icon: Icon, bg }) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant/20 hover:bg-surface-container transition-colors text-left">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-on-surface text-sm">{label}</p>
                        <p className="text-xs text-on-surface-variant">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products'     && <AdminProductsTab />}
          {activeTab === 'categories'   && <AdminCategoriesTab />}
          {activeTab === 'orders'       && <AdminOrdersTab />}
          {activeTab === 'customers'    && <AdminCustomersTab />}
          {activeTab === 'blog'         && <AdminBlogTab />}
          {activeTab === 'contact'      && <AdminContactTab />}
          {activeTab === 'testimonials' && <AdminTestimonialsTab />}
        </div>
      </main>
    </div>
  );
};
