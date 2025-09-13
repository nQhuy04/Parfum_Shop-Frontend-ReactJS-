// src/pages/home.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, notification, Button, Carousel, Radio } from 'antd'; // Thêm Radio
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { getProductsApi } from '../ultil/api';
import ProductCard from '../components/ProductCard';
import { LoadingContext } from '../components/context/loading.context';
import '../styles/home.css';
import { Link } from 'react-router-dom';

// === Dữ liệu tĩnh (có thể đưa ra ngoài nếu muốn) ===
const bannerImages = [
    "https://images.unsplash.com/photo-1595535373192-fc8935bacd89?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1602070945737-067cfd04174c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1676139412671-00742a9920a8?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// --- COMPONENT CON CHO GIAO DIỆN ---

const HeroBanner = () => (
    <div className="hero-carousel">
        <Carousel autoplay autoplaySpeed={3000} effect="fade" arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
            {bannerImages.map((imgUrl, index) => (
                <div key={index}><img src={imgUrl} alt={`Banner ${index + 1}`} className="carousel-image" /></div>
            ))}
        </Carousel>
        <div className="hero-content-overlay">
            <div className="container">
                <h1 className="hero-title">Khám Phá Thế Giới Mùi Hương</h1>
                <p className="hero-subtitle">Tìm kiếm mùi hương thể hiện cá tính riêng của bạn từ bộ sưu tập nước hoa cao cấp của chúng tôi.</p>
                {/* Bọc Button bằng Link */}
                <Link to="/products">
                    <Button type="primary" size="large" className="hero-button">Mua Sắm Ngay</Button>
                </Link>
            </div>
        </div>
    </div>
);

const CollectionsSection = () => (
    <section className="container section">
        <div className="collections-section">
            <div className="collection-card">
                <img src="https://xxivstore.com/wp-content/themes/yootheme/cache/ea/Clive-no-1-1-eac88ece.webp" alt="Nước hoa nam" />
                <div className="collection-content">
                    <h3 className="collection-title">Nước Hoa Nam</h3>
                    {/* Link đến trang sản phẩm với filter giới tính nam */}
                    <Link to="/products?gender=men">
                        <Button>Khám phá</Button>
                    </Link>
                </div>
            </div>
            <div className="collection-card">
                 <img src="https://xxivstore.com/wp-content/themes/yootheme/cache/98/byredo-985e7bf6.webp" alt="Nước hoa nữ" />
                 <div className="collection-content">
                    <h3 className="collection-title">Nước Hoa Nữ</h3>
                     {/* Link đến trang sản phẩm với filter giới tính nữ */}
                    <Link to="/products?gender=women">
                        <Button>Khám phá</Button>
                    </Link>
                </div>
            </div>
            <div className="collection-card">
                 <img src="https://xxivstore.com/wp-content/themes/yootheme/cache/61/dama-6166d964.webp" alt="Nước hoa unisex" />
                 <div className="collection-content">
                    <h3 className="collection-title">Nước Hoa Unisex</h3>
                    {/* Link đến trang sản phẩm với filter giới tính unisex */}
                    <Link to="/products?gender=unisex">
                        <Button>Khám phá</Button>
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

const FeaturedProductsSection = ({ products }) => {
    const [filter, setFilter] = useState('men');
    const filteredProducts = products.filter(p => p.gender === filter);

    // Xử lý khi không có sản phẩm nào khớp bộ lọc
    if (filteredProducts.length === 0) return null;

    return (
        <section className="container section">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)} className="featured-tabs">
                <Radio.Button value="men">Nước hoa nam</Radio.Button>
                <Radio.Button value="women">Nước hoa nữ</Radio.Button>
                <Radio.Button value="unisex">Unisex</Radio.Button>
            </Radio.Group>
            <Carousel
                className="featured-products-carousel"
                slidesToShow={4}
                dots={false}
                arrows
                prevArrow={<LeftOutlined />}
                nextArrow={<RightOutlined />}
            >
                {filteredProducts.map(product => (
                    <div key={product._id}><ProductCard {...product} /></div>
                ))}
            </Carousel>
        </section>
    );
};


const BrandsSection = () => {
    const brands = [
        'https://xxivstore.com/wp-content/uploads/2023/11/Nuoc-hoa-Clive-Christian.png',
        'https://xxivstore.com/wp-content/uploads/2023/11/Nuoc-hoa-Xerjoff.png',
        'https://xxivstore.com/wp-content/uploads/2024/11/Penhaligons.png',
        'https://xxivstore.com/wp-content/uploads/2021/07/Nasomatto.png',
        'https://xxivstore.com/wp-content/uploads/2024/01/logo-roja-parfum-1.png',
        'https://xxivstore.com/wp-content/uploads/2022/04/Ormonde-Jayne.png',
        'https://xxivstore.com/wp-content/uploads/2023/11/Nuoc-hoa-Ex-Nihilo.png',
        'https://xxivstore.com/wp-content/uploads/2022/07/159133030_1044233219399119_4321418372070751780_n.png',
        'https://xxivstore.com/wp-content/uploads/2021/03/nuoc-hoa-le-labo.png',
        'https://xxivstore.com/wp-content/uploads/2021/03/nuoc-hoa-mfk.png',
        'https://xxivstore.com/wp-content/uploads/2021/03/nuoc-hoa-by-kilian.png',
        'https://xxivstore.com/wp-content/uploads/2025/03/Loewe-logo.png',
    ];
    return (
        <section className="section brands-section-wrapper">
            <div className="container">
                <h2 className="section-title">Thương Hiệu Nổi Tiếng</h2>
                <div className="brands-grid">
                    {brands.map((logo, index) => (
                        <div className="brand-item" key={index}>
                            <img src={logo} alt={`Brand ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- COMPONENT CHÍNH CỦA TRANG ---
const HomePage = () => {
    const [productList, setProductList] = useState([]);

    const { showLoading, hideLoading } = useContext(LoadingContext);

    useEffect(() => {
        const fetchProducts = async () => {
            showLoading(); // Bật loading toàn cục
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
                hideLoading(); // Tắt loading toàn cục
            }
        };
        fetchProducts();
    }, []);


    const newProducts = [...productList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);


    return (
        <div>
            <HeroBanner />
            <main>
                <CollectionsSection />
                <FeaturedProductsSection products={productList} />
                <BrandsSection />
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
            </main>
        </div>
    );
};

export default HomePage;