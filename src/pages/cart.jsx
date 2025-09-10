// src/pages/CartPage.jsx

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Typography, Button, InputNumber, notification, Popconfirm } from 'antd'; // Bỏ Image
import { DeleteOutlined } from '@ant-design/icons';
import { CartContext } from '../components/context/cart.context';
import { updateCartApi, removeItemFromCartApi } from '../ultil/api';
import '../styles/cart.css'; 

const { Title, Text } = Typography;

const CartPage = () => {
    // --- PHẦN LOGIC NÀY ĐÃ RẤT TỐT, GIỮ NGUYÊN ---
    const { cartItems, fetchCart } = useContext(CartContext);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const handleUpdateQuantity = async (productId, newQuantity) => { /* ... */ };
    const handleRemoveItem = async (productId) => { /* ... */ };
    const totalPrice = cartItems.reduce((total, item) => { /* ... */ }, 0);
    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    
    // --- PHẦN GIAO DIỆN (JSX) SẼ ĐƯỢC LÀM MỚI ---

    // Giao diện khi giỏ hàng rỗng
    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Title level={2}>Giỏ hàng của bạn đang trống</Title>
                <Link to="/products"><Button type="primary" size="large">Tiếp tục mua sắm</Button></Link>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <Title level={1} style={{ marginBottom: '40px' }}>Giỏ hàng</Title>
            <Row gutter={[48, 48]}>
                {/* Cột trái: Bảng sản phẩm */}
                <Col xs={24} lg={16}>
                    <div className="cart-table-header">
                        <div className="cart-col-product">Sản phẩm</div>
                        <div className="cart-col-price">Giá</div>
                        <div className="cart-col-quantity">Số lượng</div>
                        <div className="cart-col-subtotal">Tạm tính</div>
                        <div className="cart-col-remove"></div>
                    </div>
                    {cartItems.map(item => (
                        <div className="cart-table-row" key={item._id}>
                            <div className="cart-col-product">
                                <img src={item.product.image} alt={item.product.name} className="cart-product-image"/>
                                <div className="cart-product-info">
                                    <Text className="product-name">{item.product.name}</Text>
                                </div>
                            </div>
                            <div className="cart-col-price">
                                <Text>{formatPrice(item.product.price)}</Text>
                            </div>
                            <div className="cart-col-quantity">
                                <InputNumber
                                    min={1} max={item.product.stock} value={item.quantity}
                                    onChange={(value) => handleUpdateQuantity(item.product._id, value)}
                                    disabled={updatingItemId === item.product._id}
                                />
                            </div>
                            <div className="cart-col-subtotal">
                                <Text strong>{formatPrice(item.product.price * item.quantity)}</Text>
                            </div>
                            <div className="cart-col-remove">
                                <Popconfirm
                                    title="Bạn chắc chắn muốn xóa?"
                                    onConfirm={() => handleRemoveItem(item.product._id)}
                                    okText="Xóa" cancelText="Hủy"
                                >
                                    <DeleteOutlined className="remove-button"/>
                                </Popconfirm>
                            </div>
                        </div>
                    ))}
                </Col>

                {/* Cột phải: Tóm tắt đơn hàng (Giữ nguyên) */}
                <Col xs={24} lg={8}>
                    <div className="cart-summary">
                        <Title level={3}>Cộng giỏ hàng</Title>
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
                        <Link to="/checkout">
                            <Button type="primary" size="large" block style={{ marginTop: '20px' }}>
                                Tiến hành thanh toán
                            </Button>
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;