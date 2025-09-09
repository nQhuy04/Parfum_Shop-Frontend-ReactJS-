import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";
import { getAccountApi } from "./ultil/api"; // Import API mới

function App() {
  const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext); // Lấy cả auth object

  useEffect(() => {
    const fetchAccount = async () => {
      // Chỉ chạy fetchAccount nếu có token trong localStorage
      if (localStorage.getItem("access_token")) {
        setAppLoading(true);
        const res = await getAccountApi(); // Sử dụng API mới
        if (res && res.EC === 0) { // Giả định API trả về EC=0 khi thành công
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.user.email, // Giả định response có cấu trúc { EC: 0, user: { email, name, role } }
              name: res.user.name,
              role: res.user.role // Thêm role vào user object để kiểm tra quyền sau này
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
        // Nếu không có token, không cần loading, đặt appLoading về false ngay
        setAppLoading(false);
      }
    }

    fetchAccount();
  }, []); // [] để chỉ chạy một lần khi component mount

  return (
    <div>
      {appLoading === true ?
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Sửa lỗi cú pháp CSS
          zIndex: 9999 // Đảm bảo spinner hiển thị trên cùng
        }}>
          <Spin size="large" /> {/* Thêm size cho spinner */}
        </div>
        :
        <>
          <Header />
          <Outlet />
        </>
      }
    </div>
  )
}

export default App;