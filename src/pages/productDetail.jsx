// src/pages/productDetail.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Spin, notification, InputNumber, Tag } from 'antd';
import { getProductByIdApi, addToCartApi } from '../ultil/api';

import { AuthContext } from '../components/context/auth.context';
import { CartContext } from '../components/context/cart.context';
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

        if(id) fetchProductDetail();
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
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <Row gutter={[48, 48]}>
                <Col xs={24} md={12}>
                     <Image
                        width="100%"
                        src={product.image}
                        preview={{ visible: false }}
                        style={{ borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Tag color="gold" style={{ marginBottom: '16px', textTransform: 'uppercase' }}>
                        {product.brand}
                    </Tag>
                    <Title level={1} style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
                        {product.name}
                    </Title>
                    <Title level={2} style={{ color: 'var(--color-primary)', marginBottom: '24px' }}>
                        {formattedPrice}
                    </Title>
                    <Paragraph style={{ lineHeight: 1.7 }}>
                        {product.description}
                    </Paragraph>
                    <div style={{ margin: '32px 0' }}>
                        <Text strong>Số lượng:</Text>
                        <InputNumber 
                            min={1} 
                            max={product.stock}
                            defaultValue={1} 
                            onChange={(value) => setQuantity(value)} 
                            style={{ marginLeft: '16px' }}
                        />
                    </div>
                    <Button 
                        type="primary" 
                        size="large" 
                        style={{ backgroundColor: 'var(--color-dark)', border: 'none' }}
                        onClick={handleAddToCart}
                        loading={isAddingToCart}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                    <Text style={{ marginLeft: '24px', fontStyle: 'italic' }}>
                        {`Còn lại: ${product.stock} sản phẩm`}
                    </Text>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetailPage; // Export tên component