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
                    <div className="order-card-header">
                        <div>
                            <Text strong>Đơn hàng: #{order._id.slice(-6).toUpperCase()}</Text><br />
                            <Text type="secondary">Ngày đặt: {formatDate(order.createdAt)}</Text>
                        </div>
                        <Tag color={order.status === 'pending' ? 'gold' : 'green'}>{order.status}</Tag>
                    </div>
                    <div className="order-card-body">
                        {order.items.map(item => (
                            <div className="product-item-in-order" key={item._id}>
                                <Image src={item.product?.image} width={80} preview={false} />
                                <div>
                                    <Text strong>{item.product?.name ?? "Sản phẩm không còn tồn tại"}</Text><br/>
                                    <Text type="secondary">{`Số lượng: ${item.quantity}`}</Text>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    {/* Backend của bạn lưu giá tại thời điểm mua trong `item.price` */}
                                    <Text strong>{formatPrice(item.price)}</Text>
                                </div>
                            </div>
                        ))}
                        <Divider />
                        
                        {/* === PHẦN MỚI: HIỂN THỊ ĐỊA CHỈ GIAO HÀNG === */}
                        <Title level={5}>Thông tin giao hàng</Title>
                        <Paragraph>
                            <strong>Tên người nhận:</strong> {order.shippingAddress?.name}<br />
                            <strong>Số điện thoại:</strong> {order.shippingAddress?.phone}<br />
                            <strong>Địa chỉ:</strong> {order.shippingAddress?.address}
                        </Paragraph>
                        
                        <Divider />

                        <div style={{ textAlign: 'right' }}>
                            {/* Backend của bạn lưu tổng tiền trong `order.totalAmount` */}
                            <Title level={4}>Tổng cộng: {formatPrice(order.totalAmount)}</Title>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistoryPage;