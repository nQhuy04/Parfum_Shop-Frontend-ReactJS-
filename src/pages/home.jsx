// src/pages/home.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, notification, Button, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getProductsApi } from '../ultil/api';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

// === MẢNG CHỨA CÁC ĐƯỜNG LINK ẢNH BANNER ===
const bannerImages = [
    "https://images.unsplash.com/photo-1595535373192-fc8935bacd89?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1602070945737-067cfd04174c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1676139412671-00742a9920a8?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1593688512867-5e4e9623bc88?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1659415455925-8b8eef9f93d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

// === COMPONENT HERO BANNER MỚI SỬ DỤNG CAROUSEL ===
const HeroBanner = () => (
    <div className="hero-carousel">
        <Carousel
            autoplay
            autoplaySpeed={3000}
            effect="fade"
            arrows={true}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
        >
            {bannerImages.map((imgUrl, index) => (
                <div key={index}>
                    <img src={imgUrl} alt={`Banner image ${index + 1}`} className="carousel-image" />
                </div>
            ))}
        </Carousel>

        <div className="hero-content-overlay">
            <div className="container">
                <h1 className="hero-title">Khám Phá Thế Giới Mùi Hương</h1>
                <p className="hero-subtitle">
                    Tìm kiếm mùi hương thể hiện cá tính riêng của bạn từ bộ sưu tập nước hoa cao cấp của chúng tôi.
                </p>
                <Button type="primary" size="large" className="hero-button">
                    Mua Sắm Ngay
                </Button>
            </div>
        </div>
    </div>
);


const HomePage = () => {
    // Phần logic này đã rất tốt, giữ nguyên 100%
    const [productList, setProductList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProductsApi();
                if (res && res.EC === 0 && Array.isArray(res.DT)) {
                    setProductList(res.DT);
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi hệ thống",
                    description: "Không thể tải danh sách sản phẩm.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const newProducts = [...productList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

    // Phần return JSX giữ nguyên cấu trúc
    return (
        <div>
            <HeroBanner />
            <main>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" /></div>
                ) : (
                    <>
                        {/* Section Sản Phẩm Mới */}
                        <section className="container section">
                            <h2 className="section-title">Sản Phẩm Mới Nhất</h2>
                            <Row gutter={[24, 24]}>
                                {newProducts.map(product => (
                                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                                        <ProductCard {...product} />
                                    </Col>
                                ))}
                            </Row>
                        </section>

                        {/* Section Tất Cả Sản Phẩm */}
                        <section className="container section">
                            <h2 className="section-title">Tất Cả Sản Phẩm</h2>
                            <Row gutter={[24, 24]}>
                                {productList.map(product => (
                                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                                        <ProductCard {...product} />
                                    </Col>
                                ))}
                            </Row>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;