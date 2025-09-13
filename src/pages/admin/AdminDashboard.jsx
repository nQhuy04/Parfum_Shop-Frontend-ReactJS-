// src/pages/admin/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, notification } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, DropboxOutlined } from '@ant-design/icons';
import { getDashboardStatsApi } from '../../ultil/api';

const { Title } = Typography;

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStatsApi();
                if (res && res.EC === 0) {
                    setStats(res.DT);
                } else {
                    notification.error({ message: "Không thể tải dữ liệu thống kê." });
                }
            } catch (error) {
                 notification.error({ message: "Lỗi hệ thống." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (!stats) {
        return <div>Không có dữ liệu.</div>;
    }
    
    return (
        <div>
            <Title level={2} style={{ marginBottom: '30px' }}>Tổng quan</Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng Doanh thu"
                            value={stats.totalRevenue ? formatPrice(stats.totalRevenue) : '0 đ'}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                         <Statistic
                            title="Tổng Đơn hàng"
                            value={stats.totalOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                 <Col xs={24} sm={12} lg={6}>
                    <Card>
                         <Statistic
                            title="Tổng Sản phẩm"
                            value={stats.totalProducts}
                            prefix={<DropboxOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                         <Statistic
                            title="Tổng Người dùng"
                            value={stats.totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#d4380d' }}
                        />
                    </Card>
                </Col>
            </Row>
            
            {/* Có thể thêm Biểu đồ hoặc Bảng Sản phẩm bán chạy ở đây sau */}
        </div>
    );
};

export default AdminDashboard;