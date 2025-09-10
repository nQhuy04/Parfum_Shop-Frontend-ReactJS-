// src/pages/OrderHistoryPage.jsx

import React from 'react';
import { useEffect, useState } from 'react';
import { Spin, notification, Typography, Tag, Image, Divider } from 'antd'; // Thêm Divider
import { getMyOrdersApi } from '../ultil/api';
import '../styles/order-history.css';

const { Title, Text, Paragraph } = Typography; // Thêm Paragraph

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrdersApi();
                console.log(">>> KIỂM TRA DỮ LIỆU ĐƠN HÀNG THÔ:", res);
                if (res && res.EC === 0 && Array.isArray(res.DT)) {
                    // Sắp xếp đơn hàng mới nhất lên đầu
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
    
    // ... Phần loading và không có đơn hàng giữ nguyên ...
    if (isLoading) { /* ... */ }
    if (orders.length === 0) { /* ... */ }

   return (
        <div className="order-history-container">
            <Title level={2} style={{ marginBottom: '30px' }}>Lịch sử Đơn hàng</Title>
            {orders.map(order => (
                <div className="order-card" key={order._id}>
                    {/* Phần header card không đổi */}
                    <div className="order-card-header">
                        {/* ... */}
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