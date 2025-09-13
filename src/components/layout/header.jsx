// src/components/layout/header.jsx

import React, { useContext, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Dropdown, Menu, Input } from 'antd'; // Chỉ cần Input, bỏ AutoComplete
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';
import { CartContext } from '../context/cart.context';
import { getProductsApi } from '../../ultil/api';
import debounce from 'lodash.debounce';
import '../../styles/header.css';

const { Search } = Input;

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);

    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState(""); // State để control giá trị input
    const triggerRef = useRef(null); // Ref để Dropdown lấy chiều rộng

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({ isAuthenticated: false, user: { email: "", name: "", role: "" } });
        navigate("/");
    };
    const menuItems = [
        { key: 'profile', label: <Link to="/user/profile">Thông tin tài khoản</Link>, icon: <UserOutlined /> },
        { key: 'order_history', label: <Link to="/user/orders">Lịch sử đơn hàng</Link>, icon: <HistoryOutlined /> },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout },
    ];
    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleSearch = async (value) => {
        if (!value.trim()) {
            setOptions([]);
            return;
        }
        try {
            const res = await getProductsApi(`?search=${value}&limit=5`);
            if (res && res.EC === 0 && Array.isArray(res.DT)) {
                const searchResults = res.DT.map(product => ({
                    key: product._id, // key là ID
                    label: ( // label là JSX
                        <div
                            className="search-dropdown-item"
                            onClick={() => {
                                navigate(`/product/${product._id}`);
                                setOptions([]); // Đóng dropdown
                                setSearchValue(''); // Xóa chữ
                            }}
                        >
                            <img src={product.image} alt={product.name} />
                            <div className="search-dropdown-details">
                                <span className="name">{product.name}</span>
                                <span className="price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                            </div>
                        </div>
                    )
                }));
                setOptions(searchResults);
            } else {
                setOptions([]);
            }
        } catch (error) {
            setOptions([]);
        }
    };
    const debouncedSearch = useCallback(debounce(handleSearch, 400), []);

    const onSearchSubmit = (value) => {
        if (value.trim()) {
            navigate(`/products?search=${value.trim()}`);
        } else {
            navigate('/products');
        }
        setOptions([]); // Đóng dropdown sau khi submit
        setSearchValue(''); // Xóa chữ sau khi submit
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <div className="header-left">
                    <div className="header-logo"><Link to="/">PARFUM</Link></div>
                    <nav className="header-nav">
                        <Link to="/">Trang chủ</Link>
                        <Link to="/products">Sản phẩm</Link>
                    </nav>
                </div>

                <div className="header-search" ref={triggerRef}>
                    <Dropdown
                        overlay={<Menu items={options} />}
                        open={options.length > 0}
                        dropdownStyle={{ 
                            width: triggerRef.current?.offsetWidth, // Lấy chiều rộng từ thẻ div cha
                            marginTop: '10px'
                        }}
                    >
                        <Search
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                            onSearch={onSearchSubmit}
                            size="large"
                            enterButton
                        />
                    </Dropdown>
                </div>

                <div className="header-actions">
                    <Link to="/cart" className="action-item">
                        <Badge count={totalItemsInCart} size="small" offset={[0, -2]}>
                            <ShoppingCartOutlined className="action-icon" />
                        </Badge>
                    </Link>
                    {auth.isAuthenticated ? (
                        <Dropdown overlay={<Menu items={menuItems} />} placement="bottomRight" arrow>
                            <div className="action-item" style={{ cursor: 'pointer' }}>
                                <UserOutlined className="action-icon" />
                                <span>{auth.user.name}</span>
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