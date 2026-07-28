import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import {
  DashboardLayout,
  DashboardProfile,
  DashboardOrders,
  DashboardWishlist,
  DashboardTestimonials,
  DashboardSettings,
} from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { GenericPage } from './pages/GenericPage';
import { Blog } from './pages/Blog';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { OrderDetail } from './pages/OrderDetail';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartDrawer } from './components/cart/CartDrawer';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Toaster position="top-right" richColors closeButton />
          <Router>
          <CartDrawer />
          <Routes>
            {/* Public admin login — no Layout wrapper */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin panel — no Layout wrapper */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Main Application with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="auth" element={<Auth />} />
              <Route path="product/:slug" element={<ProductDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPostDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="about" element={<About />} />
              
              <Route path="support" element={<GenericPage title="Contact Support" />} />
              
              {/* Protected Customer Routes */}
              <Route path="dashboard" element={
                <ProtectedRoute requiredRole="customer">
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<DashboardProfile />} />
                <Route path="orders" element={<DashboardOrders />} />
                <Route path="wishlist" element={<DashboardWishlist />} />
                <Route path="testimonials" element={<DashboardTestimonials />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>
              <Route path="orders/:id" element={
                <ProtectedRoute requiredRole="customer">
                  <OrderDetail />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </WishlistProvider>
  </AuthProvider>
  );
}

export default App;
