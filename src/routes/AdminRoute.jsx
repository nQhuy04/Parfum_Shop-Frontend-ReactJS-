// src/routes/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';

const AdminRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    
    // Nếu đã đăng nhập VÀ có vai trò là 'admin' -> cho phép truy cập
    if (auth.isAuthenticated && auth.user.role === 'admin') {
        return children;
    }

    // Ngược lại, "đá" về trang chủ
    return <Navigate to="/" />;
};
export default AdminRoute;