
import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, notification, Button } from 'antd';
import { getProductsApi } from '../ultil/api';
import ProductCard from '../components/ProductCard';

// === THAY ĐỔI DUY NHẤT Ở ĐÂY ===
// Đường dẫn đã được sửa lại để trỏ vào thư mục 'styles'
import '../styles/home.css';

// Tách Hero Banner ra component riêng cho sạch sẽ
const HeroBanner = () => (
    <div className="hero-banner">
        <div className="container">
            <h1 className="hero-title">
                Khám Phá Thế Giới Mùi Hương
            </h1>
            <p className="hero-subtitle">
                Tìm kiếm mùi hương thể hiện cá tính riêng của bạn từ bộ sưu tập nước hoa cao cấp của chúng tôi.
            </p>
            <Button type="primary" size="large" ghost>
                Mua Sắm Ngay
            </Button>
        </div>
    </div>
);


const HomePage = () => {
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
    
    // Sắp xếp sản phẩm theo ngày tạo mới nhất (giả định `createdAt` tồn tại)
    // slice(0, 4) sẽ lấy 4 sản phẩm đầu tiên trong danh sách đã sắp xếp.
    const newProducts = [...productList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

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