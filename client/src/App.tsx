import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { GenericPage } from './pages/GenericPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="auth" element={<Auth />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="blog" element={<GenericPage title="Blog" />} />
            <Route path="support" element={<GenericPage title="Contact Support" />} />
            
            {/* Protected Customer Routes */}
            <Route path="dashboard" element={
              <ProtectedRoute requiredRole="customer">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="wishlist" element={
              <ProtectedRoute requiredRole="customer">
                <GenericPage title="Your Wishlist" />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute requiredRole="customer">
                <GenericPage title="Your Orders" />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute requiredRole="customer">
                <GenericPage title="Manage Profile" />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
