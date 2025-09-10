// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// === CSS IMPORTS ===
import './styles/global.css';

// === LAYOUT COMPONENTS ===
import App from './App.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';
import PageLoader from './components/common/PageLoader';
import AdminLayout from './components/layout/AdminLayout.jsx'; 
import AdminRoute from './routes/AdminRoute.jsx';  

// === CONTEXT WRAPPERS ===
import { AuthWrapper } from './components/context/auth.context.jsx';
import { CartWrapper } from './components/context/cart.context.jsx';
import { LoadingWrapper } from './components/context/loading.context.jsx';

// === PAGE COMPONENTS ===
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/admin/user.jsx';
import ProductDetailPage from './pages/productDetail.jsx';
import CartPage from './pages/cart.jsx';
import ProductsPage from './pages/ProductPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import AdminProductsManager from './pages/admin/AdminProductsManager.jsx';

// Tạm thời tạo các component rỗng còn lại
const AdminDashboard = () => <div><h2>Chào mừng đến với Trang quản trị</h2><p>Chọn một mục từ sidebar để bắt đầu.</p></div>;
const AdminOrdersManager = () => <div>Trang Quản lý Đơn hàng</div>;


// --- Cấu hình Router ---
const router = createBrowserRouter([
  // Layout chính của Khách hàng
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <PageLoader><HomePage /></PageLoader> },
      { path: "products", element: <PageLoader><ProductsPage /></PageLoader> },
      { path: "product/:id", element: <PageLoader><ProductDetailPage /></PageLoader> },
      { path: "cart", element: <PageLoader><CartPage /></PageLoader> },
      { path: "checkout", element: <PageLoader><CheckoutPage /></PageLoader> },
      {
        path: "user",
        children: [
          { path: "profile", element: <PageLoader><UserProfilePage /></PageLoader> },
          { path: "orders", element: <PageLoader><OrderHistoryPage /></PageLoader> }
        ]
      }
    ]
  },
 
  // Layout cho trang Đăng nhập / Đăng ký
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ]
  },

  // === NHÓM ROUTE DÀNH RIÊNG CHO ADMIN ĐÃ CẬP NHẬT ===
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <UserPage /> }, // `UserPage` đã được import từ đúng thư mục `admin`
      { path: "products", element: <AdminProductsManager /> }, // Sử dụng component thật
      { path: "orders", element: <AdminOrdersManager /> },
    ]
  }
]);


// --- Render ứng dụng ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadingWrapper>
      <AuthWrapper>
        <CartWrapper>
          <RouterProvider router={router} />
        </CartWrapper>
      </AuthWrapper>
    </LoadingWrapper>
  </React.StrictMode>,
);