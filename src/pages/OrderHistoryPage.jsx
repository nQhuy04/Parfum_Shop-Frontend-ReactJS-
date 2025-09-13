// src/pages/OrderHistoryPage.jsx

import React from 'react';
import { useEffect, useState } from 'react';
import { Spin, notification, Typography, Tag, Image, Divider } from 'antd'; // Thêm Divider
import { getMyOrdersApi } from '../ultil/api';
import '../styles/order-history.css';

const { Title, Text, Paragraph } = Typography; 


const statusMapping = {
    pending:   { text: 'Chờ xử lý', color: 'gold' },
    paid:      { text: 'Đã thanh toán', color: 'processing' },
    shipped:   { text: 'Đang giao hàng', color: 'purple' },
    completed: { text: 'Hoàn thành', color: 'success' },
    cancelled: { text: 'Đã hủy', color: 'error' },
};


const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrdersApi();
                if (res && res.EC === 0 && Array.isArray(res.DT)) {
                    setOrders(res.DT.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else {
                    notification.error({ message: res.EM || "Không thể tải lịch sử đơn hàng." });
                }
            } catch (error) {
                notification.error({ message: "Lỗi hệ thống." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Hàm format an toàn, nếu giá trị không phải số thì trả về chuỗi rỗng
    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            return 'N/A'; // Hoặc có thể là '0 đ'
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN');
    
    if (isLoading) return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
    if (orders.length === 0) return <div style={{ textAlign: 'center', padding: '100px 0' }}><Title level={3}>Bạn chưa có đơn hàng nào</Title></div>;

   return (
        <div className="order-history-container">
            <Title level={2} style={{ marginBottom: '30px' }}>Lịch sử Đơn hàng</Title>
            {orders.map(order => (
                <div className="order-card" key={order._id}>
                    {/* Phần header card không đổi */}
                    <div className="order-card-header">
                        <div>
                            <Text strong>Đơn hàng: #{order._id.slice(-6).toUpperCase()}</Text><br />
                            <Text type="secondary">Ngày đặt: {formatDate(order.createdAt)}</Text>
                        </div>
                    
                        <Tag color={statusMapping[order.status]?.color || 'default'}>
                            {(statusMapping[order.status]?.text || order.status).toUpperCase()}
                        </Tag>

                    </div>

                    <div className="order-card-body">
                        {order.items.map(item => (
                            <div className="product-item-in-order" key={item.product?._id || item._id}>
                                <Image src={item.product?.image} width={80} preview={false} />
                                <div>
                                    <Text strong>{item.product?.name ?? "Sản phẩm không còn tồn tại"}</Text><br/>
                                    <Text type="secondary">{`Số lượng: ${item.quantity}`}</Text>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    {/* SỬA 1: Đọc `item.price` đã được lưu */}
                                    <Text strong>{formatPrice(item.price)}</Text>
                                </div>
                            </div>
                        ))}
                        <Divider />
                        
                        {/* SỬA 2: Đọc thông tin từ `order.shippingAddress` */}
                        <Title level={5}>Thông tin giao hàng</Title>
                        <Paragraph>
                            <strong>Tên người nhận:</strong> {order.shippingAddress?.name}<br />
                            <strong>Số điện thoại:</strong> {order.shippingAddress?.phone}<br />
                            <strong>Địa chỉ:</strong> {order.shippingAddress?.address}
                        </Paragraph>
                        
                        <Divider />

                        <div style={{ textAlign: 'right' }}>
                             {/* SỬA 3: Đọc `order.totalAmount` */}
                            <Title level={4}>Tổng cộng: {formatPrice(order.totalAmount)}</Title>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistoryPage;