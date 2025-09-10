// src/components/layout/header.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Dropdown, Menu } from 'antd'; 
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';
import '../../styles/header.css';

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Logic Đăng xuất không thay đổi
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "" }
        });
        navigate("/");
    };

    // === CHUYỂN SANG SỬ DỤNG CÚ PHÁP `items` ĐỂ FIX LỖI ===
    const menuItems = [
        {
            key: 'profile',
            label: (
                <Link to="/user/profile">Thông tin tài khoản</Link>
            ),
            icon: <UserOutlined />,
        },
        {
            key: 'order_history',
            label: (
                <Link to="/user/orders">Lịch sử đơn hàng</Link>
            ),
            icon: <HistoryOutlined />,
        },
        {
            type: 'divider', // Đây là cách tạo đường kẻ phân cách
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout, // Gắn hàm onClick trực tiếp vào item object
        },
    ];


    return (
        <header className="main-header">
            <div className="header-container">
                <nav className="header-nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/products">Sản phẩm</Link>
                </nav>

                <div className="header-logo">
                    <Link to="/">PARFUM</Link>
                </div>

                <div className="header-actions">
                    <Link to="/cart" className="action-item">
                        <Badge count={totalItemsInCart} size="small">
                            <ShoppingCartOutlined className="action-icon" />
                        </Badge>
                    </Link>
                    
                    {auth.isAuthenticated ? (
                        // Component <Dropdown> giờ đây nhận vào <Menu /> với prop là `items`
                        <Dropdown overlay={<Menu items={menuItems} />} placement="bottomRight" arrow>
                            <div className="user-info action-item" style={{cursor: 'pointer'}}>
                                <UserOutlined className="action-icon" style={{marginRight: '8px'}}/> 
                                {auth.user.name}
                            </div>
                        </Dropdown>
                    ) : (
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