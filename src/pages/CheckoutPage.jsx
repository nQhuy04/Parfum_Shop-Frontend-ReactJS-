// src/pages/CheckoutPage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Input, Button, notification, Typography, Image, Divider } from 'antd';

import { AuthContext } from '../components/context/auth.context';
import { CartContext } from '../components/context/cart.context';
import { createOrderApi } from '../ultil/api';
import '../styles/checkout.css';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { cartItems, fetchCart } = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        // Nếu không có sản phẩm nào trong giỏ hàng (sau khi đã fetch), chuyển hướng
        // Kiểm tra sau một khoảng trễ nhỏ để đảm bảo cartItems đã kịp cập nhật
        setTimeout(() => {
            if (cartItems.length === 0) {
                notification.warning({
                    message: "Giỏ hàng rỗng",
                    description: "Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.",
                });
                navigate('/cart');
            }
        }, 100); // 100ms delay
    }, [cartItems, navigate]);

    // Xử lý khi nhấn nút Đặt hàng
    const onFinish = async (formValues) => {
        setIsSubmitting(true);
        try {
            // === LOGIC MỚI ===

            // 1. Tách `email` ra (không cần gửi email trong shippingAddress)
            const { name, phone, address } = formValues;
            
            // 2. Tạo object shippingAddress đúng chuẩn
            const shippingAddress = { name, phone, address };

            const orderItems = cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));
            
            // 3. Gửi đi shippingAddress và orderItems
            const res = await createOrderApi(shippingAddress, orderItems);

            if (res && res.EC === 0) {
                 // ... logic sau khi thành công giữ nguyên ...
                 navigate('/');
            } else {
                notification.error({ message: res.EM || "Đặt hàng thất bại, vui lòng thử lại." });
            }
        } catch (error) {
             notification.error({ message: "Đã có lỗi xảy ra." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const formattedTotalPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

    if (cartItems.length === 0) {
        // Return null để tránh render chớp nhoáng trước khi navigate
        return null;
    }

    return (
        <div className="checkout-page-container">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>Thanh Toán</Title>
            <Row gutter={[48, 48]}>
                {/* Cột trái: Form thông tin */}
                <Col xs={24} lg={14}>
                    <div className="checkout-form">
                        <Title level={4}>Thông tin giao hàng</Title>
                        <Form
                            form={form}
                            name="checkout"
                            onFinish={onFinish}
                            layout="vertical"
                            initialValues={{
                                name: auth.user.name,
                                email: auth.user.email
                            }}
                        >
                            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                <Input />
                            </Form.Item>
                             <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label="Địa chỉ giao hàng" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmitting} size="large" block>
                                    Hoàn tất đơn hàng
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                {/* Cột phải: Tóm tắt đơn hàng */}
                <Col xs={24} lg={10}>
                    <div className="checkout-summary">
                        <Title level={4}>Đơn hàng của bạn</Title>
                        <div className="summary-product-list">
                            {cartItems.map(item => (
                                <div className="summary-product-item" key={item._id}>
                                    <Image src={item.product.image} width={60} preview={false} />
                                    <div className="summary-product-details">
                                        <Text>{item.product.name}</Text> <br />
                                        <Text type="secondary">{`Số lượng: ${item.quantity}`}</Text>
                                    </div>
                                    <Text strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price * item.quantity)}</Text>
                                </div>
                            ))}
                        </div>
                        <Divider className="summary-divider" />
                        <div className="summary-row">
                            <Text>Tạm tính</Text>
                            <Text>{formattedTotalPrice}</Text>
                        </div>
                         <div className="summary-row">
                            <Text>Phí vận chuyển</Text>
                            <Text>Miễn phí</Text>
                        </div>
                        <Divider className="summary-divider" />
                        <div className="summary-row summary-total">
                            <Text>Tổng cộng</Text>
                            <Text>{formattedTotalPrice}</Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;