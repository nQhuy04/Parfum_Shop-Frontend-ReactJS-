// src/components/layout/AdminLayout.jsx

import React, { useContext, useState } from 'react';
import { Layout, Menu, Button, Popconfirm } from 'antd'; 
import { 
    DashboardOutlined, 
    UserOutlined, 
    AppstoreOutlined, 
    ShoppingCartOutlined,
    LogoutOutlined 
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/auth.context';
import '../../styles/admin-layout.css';

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate(); 

    
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "" }
        });
        navigate("/login"); 
    };

    
    const menuItems = [
        { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
        { key: 'users', icon: <UserOutlined />, label: <Link to="/admin/users">Quản lý Người dùng</Link> },
        { key: 'products', icon: <AppstoreOutlined />, label: <Link to="/admin/products">Quản lý Sản phẩm</Link> },
        { key: 'orders', icon: <ShoppingCartOutlined />, label: <Link to="/admin/orders">Quản lý Đơn hàng</Link> },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            
            <Sider 
                className="admin-layout-sider"
                collapsible 
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="admin-logo">{collapsed ? 'P' : 'PARFUM'}</div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
            </Sider>

            <Layout className={`admin-layout-right ${collapsed ? 'sider-collapsed' : ''}`}>
                <Header className="admin-header">
                    <span className="admin-welcome-text">Xin chào, <strong>{auth.user.name}</strong></span>

                    <Popconfirm
                        title="Bạn chắc chắn muốn đăng xuất?"
                        onConfirm={handleLogout}
                        okText="Đăng xuất"
                        cancelText="Hủy"
                    >
                        <Button type="text" icon={<LogoutOutlined />} style={{ marginLeft: 'auto' }}>
                            Đăng xuất
                        </Button>
                    </Popconfirm>
                </Header>

                <Content className="admin-content">
                    <div className="admin-content-box">
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;