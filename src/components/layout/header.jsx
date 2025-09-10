// src/components/layout/header.jsx

import React from 'react';
import { useContext } from 'react';
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

    const handleLogout = () => {
        // ... logic logout giữ nguyên ...
    };

    // 2. TẠO RA NỘI DUNG CHO DROPDOWN MENU
    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/user/profile">
                    <UserOutlined style={{ marginRight: '8px' }} />
                    Thông tin tài khoản
                </Link>
            </Menu.Item>
            <Menu.Item key="order_history">
                <Link to="/user/orders">
                    <HistoryOutlined style={{ marginRight: '8px' }} />
                    Lịch sử đơn hàng
                </Link>
            </Menu.Item>
            <Menu.Divider /> {/* Đường kẻ phân cách */}
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined style={{ marginRight: '8px' }} />
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="main-header">
            <div className="header-container">
                <nav className="header-nav">
                    <Link to="/">Trang chủ</Link>
                    <Link to="/products">Sản phẩm</Link>
                    {/* <Link to="/about">Giới thiệu</Link> */}
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
                        // 3. THAY THẾ LINK BẰNG DROPDOWN
                        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
                            <div className="user-info action-item">
                                <UserOutlined className="action-icon" style={{marginRight: '8px'}}/> 
                                {auth.user.name}
                            </div>
                        </Dropdown>
                    ) : (
                        // Phần chưa đăng nhập giữ nguyên
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