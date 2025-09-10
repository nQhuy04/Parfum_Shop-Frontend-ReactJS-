// src/components/layout/AdminLayout.jsx

import React, { useContext, useState } from 'react'; // Thêm useState
import { Layout, Menu } from 'antd';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import '../../styles/admin-layout.css';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
    const { auth } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false); // State để quản lý sidebar

    const menuItems = [
        { key: 'users', icon: <UserOutlined />, label: <Link to="/admin/users">Quản lý Người dùng</Link> },
        { key: 'products', icon: <AppstoreOutlined />, label: <Link to="/admin/products">Quản lý Sản phẩm</Link> },
        { key: 'orders', icon: <ShoppingCartOutlined />, label: <Link to="/admin/orders">Quản lý Đơn hàng</Link> },
    ];

    return (
        // Layout ngoài cùng là container chính
        <Layout style={{ minHeight: '100vh' }}>
            
            <Sider 
                className="admin-layout-sider"
                collapsible 
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="admin-logo">P</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['users']} items={menuItems} />
            </Sider>

            <Layout className={`admin-layout-right ${collapsed ? 'sider-collapsed' : ''}`}>
                <Header className="admin-header">
                    <span className="admin-welcome-text">Xin chào, <strong>{auth.user.name}</strong></span>
                </Header>
                <Content className="admin-content">
                    {/* Thẻ div này sẽ là box trắng bên trong */}
                    <div className="admin-content-box">
                        <Outlet />
                    </div>
                </Content>
            </Layout>

        </Layout>
    );
};

export default AdminLayout;