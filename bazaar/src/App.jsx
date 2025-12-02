import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';

import SellerSignup from './pages/seller/SellerSignup';
import SellerLogin from './pages/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SubscriptionPlans from './pages/seller/SubscriptionPlans';
import SubscriptionSuccess from './pages/seller/SubscriptionSuccess';
import SubscriptionCancel from './pages/seller/SubscriptionCancel';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <div className="app">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:orderId" element={<OrderDetails />} />

                {/* Seller Routes */}
                <Route path="/seller/signup" element={<SellerSignup />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller" element={<SellerLayout />}>
                  <Route path="dashboard" element={<SellerDashboard />} />
                  <Route path="products" element={<SellerProducts />} />
                  <Route path="orders" element={<SellerOrders />} />
                  <Route path="subscription" element={<SubscriptionPlans />} />
                  <Route path="subscription/success" element={<SubscriptionSuccess />} />
                  <Route path="subscription/cancel" element={<SubscriptionCancel />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="sellers" element={<AdminSellers />} />
                  <Route path="products" element={<AdminProducts />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;
