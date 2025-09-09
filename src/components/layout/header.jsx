// src/components/layout/header.jsx

// import React, 'react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';

// Import Context
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';

// Import CSS mới cho Header
import '../../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        // Xóa token và reset trạng thái auth
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "" }
        });
        navigate("/"); // Điều hướng về trang chủ
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* === Phần bên trái: Các link điều hướng chính === */}
                <nav className="header-nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/products">Sản phẩm</Link> {/* Link đến trang tất cả sản phẩm */}
                    <Link to="/about">Giới thiệu</Link>
                </nav>

                {/* === Phần giữa: Logo === */}
                <div className="header-logo">
                    <Link to="/">PARFUM</Link> {/* Thay "PARFUM" bằng tên shop của bạn */}
                </div>

                {/* === Phần bên phải: Actions === */}
                <div className="header-actions">
                    {/* Icon Giỏ hàng */}
                    <Link to="/cart" className="action-item">
                        <Badge count={totalItemsInCart} size="small">
                            <ShoppingCartOutlined className="action-icon" />
                        </Badge>
                    </Link>

                    {/* Điều kiện hiển thị: Đăng nhập hay chưa? */}
                    {auth.isAuthenticated ? (
                        // Nếu ĐÃ đăng nhập
                        <div className="user-info">
                            <Link to="/user" className="action-item">
                                <UserOutlined className="action-icon" style={{marginRight: '8px'}}/> 
                                {auth.user.name}
                            </Link>
                            <LogoutOutlined 
                                className="action-item action-icon" 
                                onClick={handleLogout}
                                title="Đăng xuất"
                            />
                        </div>
                    ) : (
                        // Nếu CHƯA đăng nhập
                        <>
                            <Link to="/login" className="action-item">Đăng nhập</Link>
                            <span className="separator">/</span>
                            <Link to="/register" className="action-item">Đăng ký</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;