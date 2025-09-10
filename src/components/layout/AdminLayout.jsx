// src/components/layout/AdminLayout.jsx
import React, { useContext } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/admin-layout.css';
import { AuthContext } from '../context/auth.context';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
    const { auth } = useContext(AuthContext);

    const menuItems = [
        { key: 'dashboard', icon: <AppstoreOutlined />, label: <Link to="/admin">Dashboard</Link> },
        { key: 'users', icon: <UserOutlined />, label: <Link to="/admin/users">Quản lý Người dùng</Link> },
        { key: 'products', icon: <AppstoreOutlined />, label: <Link to="/admin/products">Quản lý Sản phẩm</Link> },
        { key: 'orders', icon: <ShoppingCartOutlined />, label: <Link to="/admin/orders">Quản lý Đơn hàng</Link> },
    ];

    return (
        <Layout className="admin-layout" style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <div className="admin-logo">PARFUM</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
            </Sider>
            <Layout>
                <Header className="admin-header">
                    <div style={{ textAlign: 'right', color: '#333' }}>
                        <span>Xin chào, <strong>{auth.user.name}</strong></span>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
                        {/* Các trang con của Admin sẽ được render ở đây */}
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;