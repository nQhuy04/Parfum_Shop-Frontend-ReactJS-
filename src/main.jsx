import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';
import ProductDetailPage from './pages/productDetail.jsx';
import CartPage from './pages/cart.jsx';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import { CartWrapper } from './components/context/cart.context.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, //Chạy app, và bên trong App có header 
    children: [
      {
        index: true,
        element: <HomePage />
      },

      {
        path: "user",
        element: <UserPage />
      },

      {
        path: "product/:id", 
        element: <ProductDetailPage />
      },

      {
        path: "cart",
        element: <CartPage />
      },
    ]

  },

  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <CartWrapper> 
        <RouterProvider router={router} />
      </CartWrapper>
    </AuthWrapper>
  </React.StrictMode>,
)
