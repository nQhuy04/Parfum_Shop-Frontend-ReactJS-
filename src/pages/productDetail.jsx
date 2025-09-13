// src/pages/productDetail.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Spin, notification, InputNumber, Divider, Card } from 'antd';
import { getProductByIdApi, addToCartApi } from '../ultil/api';

import { AuthContext } from '../components/context/auth.context';
import { CartContext } from '../components/context/cart.context';
import '../styles/product-detail.css';
import '../styles/home.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage = () => { // Tên component là ProductDetailPage
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { fetchCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetail = async () => {
            setIsLoading(true);
            try {
                const res = await getProductByIdApi(id);
                if (res && res.EC === 0) {
                    setProduct(res.DT);
                } else {
                    setProduct(null);
                    notification.error({
                        message: "Lỗi",
                        description: "Không tìm thấy sản phẩm này.",
                    });
                }
            } catch (error) {
                setProduct(null);
                notification.error({
                    message: "Lỗi hệ thống",
                    description: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProductDetail();
    }, [id]);

    const handleAddToCart = async () => {
        if (!auth.isAuthenticated) {
            notification.warning({
                message: "Bạn chưa đăng nhập",
                description: "Vui lòng đăng nhập để thực hiện chức năng này."
            });
            navigate('/login');
            return;
        }
        setIsAddingToCart(true);
        try {
            const res = await addToCartApi(id, quantity);
            if (res && res.EC === 0) {
                notification.success({
                    message: "Thành công",
                    description: `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng.`,
                });
                await fetchCart();
            } else {
                notification.error({
                    message: "Thất bại",
                    description: res.EM || "Có lỗi xảy ra, vui lòng thử lại.",
                });
            }
        } catch (error) {
            notification.error({ message: "Lỗi hệ thống" });
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (isLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
    }
    if (!product) {
        return <div style={{ textAlign: 'center', padding: '100px 0' }}>Không tìm thấy thông tin sản phẩm.</div>;
    }

    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

    return (
        <div className="container product-detail-container">
            <Row gutter={[48, 48]}>
                {/* --- Cột bên trái: Hình ảnh sản phẩm --- */}
                <Col xs={24} lg={12}>
                    <Image
                        width="100%"
                        src={product.image}
                        className="product-image-wrapper" // Dùng class để style
                    />
                </Col>

                {/* --- Cột bên phải: Thông tin chi tiết --- */}
                <Col xs={24} lg={12}>
                    {/* Bỏ Tag, thay bằng text */}
                    <p className="product-info-brand">{product.brand}</p>

                    <Title level={1} className="product-info-name">{product.name}</Title>
                    <Title level={2} className="product-info-price">{formattedPrice}</Title>

                    <Paragraph style={{ lineHeight: 1.7, marginBottom: '24px' }}>
                        {product.description}
                    </Paragraph>

                    {/* Nhóm thông tin meta lại */}
                    <div className="product-info-meta">
                        <Text><strong>Giới tính:</strong> <span style={{ textTransform: 'capitalize' }}>{product.gender}</span></Text>
                        <Divider type="vertical" />
                        <Text><strong>Tồn kho:</strong> {product.stock} sản phẩm</Text>
                    </div>

                    {/* Khối hành động mua hàng */}
                    <Card className="action-card">
                        <div className="quantity-selector">
                            <Text strong style={{ fontSize: '1rem' }}>Số lượng:</Text>
                            <InputNumber
                                min={1}
                                max={product.stock}
                                defaultValue={1}
                                onChange={(value) => setQuantity(value)}
                                size="large"
                            />
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            block // Nút full-width trong card
                            style={{ backgroundColor: 'var(--color-dark)', border: 'none', height: '50px', fontSize: '1rem' }}
                            onClick={handleAddToCart}
                            loading={isAddingToCart}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage;