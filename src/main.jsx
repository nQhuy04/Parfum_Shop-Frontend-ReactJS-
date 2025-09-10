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

// === CONTEXT WRAPPERS ===
import { AuthWrapper } from './components/context/auth.context.jsx';
import { CartWrapper } from './components/context/cart.context.jsx';

// === PAGE COMPONENTS ===
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import ProductDetailPage from './pages/productDetail.jsx';
import CartPage from './pages/cart.jsx';
import ProductsPage from './pages/ProductPage.jsx';
import { LoadingContext, LoadingWrapper } from './components/context/loading.context.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';


// --- Cấu hình Router ---
const router = createBrowserRouter([
  // Layout chính
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "user", element: <UserPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "checkout", element: <PageLoader><CheckoutPage /></PageLoader> },
      { path: "user/orders", element: <PageLoader><OrderHistoryPage /></PageLoader>},
      { path: "user/profile", element: <PageLoader><UserProfilePage /></PageLoader> },

    ]
  },
 
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ]
  },
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