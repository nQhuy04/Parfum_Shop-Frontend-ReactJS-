# Parfum Shop - Frontend (React.JS)

Chào mừng đến với giao diện người dùng của Parfum Shop, một trang web thương mại điện tử nước hoa được xây dựng bằng React.JS. Dự án này thể hiện một luồng mua sắm hoàn chỉnh, giao diện hiện đại, và được tối ưu hóa cho trải nghiệm người dùng.

> Đây là phần Frontend của một dự án Full-stack. Vui lòng tham khảo repository của Backend tại đây: `[Link tới repo Backend của bạn]`

## ✨ Các Tính Năng Nổi Bật

### Giao diện Khách hàng:
- **Trang chủ sống động:** Tích hợp Carousel Banner tự động chuyển ảnh, các section bán hàng (Bộ sưu tập, Sản phẩm nổi bật) được thiết kế hiện đại.
- **Trải nghiệm mua sắm hoàn chỉnh:** Người dùng có thể xem danh sách sản phẩm, xem chi tiết, thêm vào giỏ hàng, và tiến hành thanh toán.
- **Quản lý Giỏ hàng:** Giao diện giỏ hàng dạng bảng, cho phép cập nhật số lượng và xóa sản phẩm.
- **Xác thực Người dùng:** Luồng Đăng ký / Đăng nhập an toàn, phân tách layout riêng để tối ưu chuyển đổi.
- **Quản lý Tài khoản:** Người dùng có thể xem lại Lịch sử đơn hàng và cập nhật Thông tin cá nhân.
- **Trải nghiệm Người dùng (UX) được tối ưu:**
  - **Loading mượt mà:** Hiệu ứng loading overlay đẹp mắt xuất hiện khi tải dữ liệu và chuyển trang.
  - **Nhất quán:** Toàn bộ trang web sử dụng hệ thống thiết kế đồng bộ từ font chữ, màu sắc đến layout.

### Giao diện Admin:
- **Phân quyền chặt chẽ:** Khu vực Admin được bảo vệ, chỉ tài khoản có vai trò `admin` mới có thể truy cập.
- **Dashboard Quản trị:** Layout Admin chuyên nghiệp với Sidebar điều hướng.
- **Quản lý Sản phẩm (CRUD):** Giao diện bảng cho phép Thêm, Sửa, Xóa sản phẩm một cách trực quan thông qua Modal Form.
- **Quản lý Đơn hàng:** Xem toàn bộ đơn hàng, xem chi tiết, và cập nhật trạng thái đơn hàng (Chờ xử lý, Đang giao, Hoàn thành...).
- **Quản lý Người dùng:** Xem danh sách và quản lý tài khoản người dùng.

## 🚀 Công nghệ sử dụng

- **Thư viện giao diện:** [React.js](https://reactjs.org/) (sử dụng Vite.js)
- **Quản lý State:** React Context API
- **Routing:** React Router DOM v6
- **Thư viện UI Component:** [Ant Design](https://ant.design/)
- **Gọi API:** Axios (với Interceptors để tự động đính kèm JWT)

## 🛠️ Hướng dẫn cài đặt và chạy dự án

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/parfum_shop_frontend.git
   ```

2. **Cài đặt dependencies:**
   ```bash
   cd parfum_shop_frontend
   npm install
   ```

3. **Cấu hình biến môi trường:**
   - Tạo một file `.env` ở thư mục gốc.
   - Thêm vào biến sau để kết nối đến backend:
     ```
     VITE_BACKEND_URL=http://localhost:8080
     ```

4. **Chạy dự án:**
   ```bash
   npm run dev
   ```
   Dự án sẽ chạy tại `http://localhost:5173`.