// src/App.jsx

import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import { getAccountApi } from "./ultil/api";
import Footer from "./components/layout/Footer";

function App() {
  const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      if (localStorage.getItem("access_token")) {
        setAppLoading(true);
        const res = await getAccountApi();

        // === THAY ĐỔI QUAN TRỌNG NẰM Ở ĐÂY ===
        // Backend của bạn trả về dữ liệu trong `DT`, nên chúng ta cần kiểm tra `res.DT.user`
        if (res && res.DT && res.DT.user) { 
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.DT.user.email, // Lấy từ res.DT.user
              name: res.DT.user.name,   // Lấy từ res.DT.user
              role: res.DT.user.role    // Lấy từ res.DT.user
            }
          });
        } else {
          // Nếu token không hợp lệ hoặc có lỗi, xóa token và đặt lại trạng thái auth
          localStorage.removeItem("access_token");
          setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "" }
          });
        }
        setAppLoading(false);
      } else {
        setAppLoading(false);
      }
    }
    
    // Thêm một điều kiện nhỏ: chỉ chạy fetchAccount khi chưa đăng nhập.
    // Điều này giúp tránh việc gọi lại API không cần thiết khi di chuyển giữa các trang.
    if (!auth.isAuthenticated) {
        fetchAccount();
    } else {
        // Nếu đã đăng nhập rồi thì không cần hiển thị loading nữa
        setAppLoading(false);
    }
    
  }, [auth.isAuthenticated, setAppLoading, setAuth]); // Thêm dependencies để tuân thủ quy tắc của useEffect

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999
        }}>
          <Spin size="large" />
        </div>
        :
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      }
    </div>
  )
}

export default App;