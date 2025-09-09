// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// Import CSS của header để tái sử dụng style cho logo
import '../../styles/header.css'; 

const AuthHeader = () => (
    <header className="main-header">
        <div className="header-container" style={{ justifyContent: 'center' }}>
            {/* Header này chỉ có duy nhất logo ở giữa */}
            <div className="header-logo">
                <Link to="/">PARFUM</Link>
            </div>
        </div>
    </header>
);

const AuthLayout = () => {
    return (
        <div>
            <AuthHeader />
            {/* Outlet sẽ là nơi render component con (LoginPage hoặc RegisterPage) */}
            <Outlet />
        </div>
    );
};

export default AuthLayout;