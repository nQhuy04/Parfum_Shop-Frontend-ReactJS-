// src/pages/ProductDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Image, Typography, Button, Spin, notification, InputNumber, Tag } from 'antd';
import { getProductByIdApi } from '../ultil/api';

// Import CSS từ trang home để tái sử dụng một số style
import '../styles/home.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
    // 1. Lấy `id` từ thanh địa chỉ URL (ví dụ: /product/abc-123 -> id = "abc-123")
    const { id } = useParams();

    // 2. Khởi tạo các state
    const [product, setProduct] = useState(null); // Lưu thông tin sản phẩm chi tiết
    const [isLoading, setIsLoading] = useState(true); // Quản lý trạng thái loading
    const [quantity, setQuantity] = useState(1); // Quản lý số lượng sản phẩm muốn mua

    // 3. Sử dụng useEffect để gọi API khi component được mount hoặc khi `id` thay đổi
    useEffect(() => {
        const fetchProductDetail = async () => {
            setIsLoading(true);
            try {
                const res = await getProductByIdApi(id);
                if (res && res.EC === 0) {
                    setProduct(res.DT); // Lưu dữ liệu sản phẩm vào state
                } else {
                    // Xử lý trường hợp không tìm thấy sản phẩm
                    notification.error({
                        message: "Lỗi",
                        description: "Không tìm thấy sản phẩm này.",
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi hệ thống",
                    description: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
                });
            } finally {
                setIsLoading(false); // Luôn tắt loading sau khi API hoàn tất
            }
        };

        fetchProductDetail();
    }, [id]); // Dependency là `id` -> Nếu id thay đổi, gọi lại API

    // Hiển thị loading spinner trong khi chờ dữ liệu
    if (isLoading) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>;
    }

    // Hiển thị thông báo nếu không có sản phẩm
    if (!product) {
        return <div style={{ textAlign: 'center', padding: '100px 0' }}>Không tìm thấy thông tin sản phẩm.</div>;
    }

    // Định dạng giá tiền
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

    // 4. Render giao diện
    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <Row gutter={[48, 48]}>
                {/* Cột bên trái: Hình ảnh sản phẩm */}
                <Col xs={24} md={12}>
                    <Image
                        width="100%"
                        src={product.image}
                        preview={{ visible: false }}
                        style={{ borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}
                    />
                </Col>

                {/* Cột bên phải: Thông tin chi tiết */}
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
                            max={product.stock} // Số lượng tối đa là số lượng trong kho
                            defaultValue={1} 
                            onChange={(value) => setQuantity(value)} 
                            style={{ marginLeft: '16px' }}
                        />
                    </div>

                    <Button type="primary" size="large" style={{ backgroundColor: 'var(--color-dark)', border: 'none' }}>
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

export default ProductDetail;