import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import AdminOrderDetail from '../pages/admin/OrderDetail';

import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminCategories from '../pages/admin/Categories';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= Public ================= */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* ================ Protected ================ */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<Cart />} />

          <Route path="checkout" element={<Checkout />} />

          <Route path="orders" element={<Orders />} />

          <Route
            path="orders/:id"
            element={<OrderDetail />}
          />

          <Route path="wishlist" element={<Wishlist />} />

          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ================= Admin ================= */}
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="orders/:id"
            element={<AdminOrderDetail />}
          />

          <Route
            path="categories"
            element={<AdminCategories />}
          />
        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}