import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./ultil/axios.customize";// thay vì "axios" thì ta trỏ đến file customize, không can thiệp vào cả thư viên axios mà chỉ can thiệp vào 1 đối tượng. lúc này tên biến ta không cần bắt buộc đặt tên là axios mà ta có thể đặt bất cứ tên gì cũng có thể sử dụng được
import { useContext, useEffect } from "react"
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {

  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      //ta sử dụng env của Vite, đẩy tham số môi trường, gọi từ file .env.production
      const res = await axios.get(`/v1/api/account`);
      if (res) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            name: res.name,
          }
        })
      }
      setAppLoading(false);
    }


    fetchAccount()
  }, [])




  //Nơi hiển thị giao diện
  return (
    <div>
      {appLoading === true ?
        <div style={{

          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "-webkit-translate(-50%, -50%)",
        }}>
          <Spin>

          </Spin>
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

export default App
