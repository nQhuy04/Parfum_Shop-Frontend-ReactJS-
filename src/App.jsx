// src/App.jsx

import React, { useContext, useEffect } from "react"; // Chỉ cần import 1 lần
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import LoadingOverlay from "./components/common/LoadingOverlay";
import { AuthContext } from "./components/context/auth.context";
import { LoadingContext } from "./components/context/loading.context";
import { getAccountApi } from "./ultil/api";
import './styles/layout.css';

function App() {
  // 1. Chỉ lấy `auth` và `setAuth` từ AuthContext
  const { auth, setAuth } = useContext(AuthContext);

  // 2. Lấy `isLoading`, `showLoading`, `hideLoading` từ LoadingContext
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);

  useEffect(() => {
    const fetchAccount = async () => {
      // Chỉ fetch khi có token VÀ người dùng chưa được xác thực
      if (localStorage.getItem("access_token")) {
        const res = await getAccountApi();

        if (res && res.DT && res.DT.user) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.DT.user.email,
              name: res.DT.user.name,
              role: res.DT.user.role,
            },
          });
        }

      }
    };

    fetchAccount();

    // Thêm auth.isAuthenticated để useEffect chạy lại khi người dùng logout
    // Thêm các hàm vào dependency array là một thực hành tốt
  }, []);

  return (
    <div className="app-container">
      <LoadingOverlay isLoading={isLoading} />
      <Header />
    
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;