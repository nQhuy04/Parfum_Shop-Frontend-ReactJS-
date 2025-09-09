
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Typography, Button, Image, InputNumber, notification, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { CartContext } from '../components/context/cart.context';
import { updateCartApi, removeItemFromCartApi } from '../ultil/api';
import '../styles/cart.css'; // Import CSS cho trang này

const { Title, Text } = Typography;

const CartPage = () => {
    // 1. Lấy dữ liệu và hàm từ CartContext
    const { cartItems, fetchCart } = useContext(CartContext);
    
    // State để quản lý trạng thái loading khi cập nhật/xóa
    const [updatingItemId, setUpdatingItemId] = useState(null);

    // 2. Hàm xử lý cập nhật số lượng
    const handleUpdateQuantity = async (productId, newQuantity) => {
        setUpdatingItemId(productId); // Bật loading cho item cụ thể này
        try {
            const res = await updateCartApi(productId, newQuantity);
            if (res && res.EC === 0) {
                await fetchCart(); // Cập nhật lại giỏ hàng
                notification.success({ message: "Cập nhật giỏ hàng thành công!" });
            } else {
                notification.error({ message: res.EM || "Có lỗi xảy ra" });
            }
        } finally {
            setUpdatingItemId(null); // Tắt loading
        }
    };

    // 3. Hàm xử lý xóa sản phẩm
    const handleRemoveItem = async (productId) => {
        setUpdatingItemId(productId);
        try {
            const res = await removeItemFromCartApi(productId);
            if (res && res.EC === 0) {
                await fetchCart();
                notification.success({ message: "Đã xóa sản phẩm khỏi giỏ hàng." });
            } else {
                notification.error({ message: res.EM || "Có lỗi xảy ra" });
            }
        } finally {
            setUpdatingItemId(null);
        }
    };
    
    // 4. Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
    
    // Định dạng tiền tệ
    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    
    // 5. Render giao diện
    // Xử lý trường hợp giỏ hàng rỗng
    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Title level={2}>Giỏ hàng của bạn đang trống</Title>
                <Link to="/products">
                    <Button type="primary" size="large">Tiếp tục mua sắm</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="cart-page-container">
            <Title level={1} style={{ marginBottom: '40px' }}>Giỏ hàng của bạn</Title>
            <Row gutter={[48, 48]}>
                {/* Cột trái: Danh sách sản phẩm */}
                <Col xs={24} lg={16}>
                    {cartItems.map(item => (
                        <div className="cart-item" key={item._id}>
                            <div className="cart-item-image">
                                <Image src={item.product.image} />
                            </div>
                            <div className="cart-item-details">
                                <Text strong>{item.product.name}</Text> <br />
                                <Text type="secondary">{formatPrice(item.product.price)}</Text>
                            </div>
                            <div className="cart-item-actions">
                                <InputNumber
                                    min={1}
                                    max={item.product.stock}
                                    value={item.quantity}
                                    onChange={(value) => handleUpdateQuantity(item.product._id, value)}
                                    disabled={updatingItemId === item.product._id}
                                />
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa?"
                                    onConfirm={() => handleRemoveItem(item.product._id)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                >
                                    <DeleteOutlined className="remove-button"/>
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </Col>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <Col xs={24} lg={8}>
                    <div className="cart-summary">
                        <Title level={3}>Tóm tắt đơn hàng</Title>
                        <div className="summary-row">
                            <Text>Tạm tính</Text>
                            <Text>{formattedTotalPrice}</Text>
                        </div>
                        <div className="summary-row">
                            <Text>Phí vận chuyển</Text>
                            <Text>Miễn phí</Text>
                        </div>
                        <div className="summary-row summary-total">
                            <Text>Tổng cộng</Text>
                            <Text>{formattedTotalPrice}</Text>
                        </div>
                        <Button type="primary" size="large" block style={{ marginTop: '20px' }}>
                            Tiến hành thanh toán
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;