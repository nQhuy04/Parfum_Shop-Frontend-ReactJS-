// src/pages/ProductsPage.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, notification, Typography, Input, Divider, Checkbox, Slider, Select, Pagination } from 'antd';
import { getProductsApi } from '../ultil/api';
import ProductCard from '../components/ProductCard';

// Import CSS riêng cho trang này
import '../styles/products-page.css';

const { Title } = Typography;

// --- COMPONENT CON CHO SIDEBAR LỌC (TẠM THỜI CHỈ LÀ GIAO DIỆN) ---
const FiltersSidebar = () => {
    // Sau này, chúng ta sẽ thêm logic vào đây
    const brands = ['Dior', 'Chanel', 'Versace', 'Gucci', 'Tom Ford']; // Dữ liệu giả
    const genders = [
        { label: 'Nam', value: 'men' },
        { label: 'Nữ', value: 'women' },
        { label: 'Unisex', value: 'unisex' }
    ];

    return (
        <aside className="filters-sidebar">
            <div className="filter-group">
                <Title level={5} className="filter-title">Thương hiệu</Title>
                <Input.Search placeholder="Tìm thương hiệu..." style={{ marginBottom: 15 }} />
                <Checkbox.Group options={brands} className="brand-list" />
            </div>
            <Divider />
            <div className="filter-group">
                <Title level={5} className="filter-title">Giới tính</Title>
                <Checkbox.Group options={genders} className="gender-list" />
            </div>
            <Divider />
            <div className="filter-group">
                <Title level={5} className="filter-title">Giá cả</Title>
                <Slider range defaultValue={[0, 5000000]} max={10000000} step={100000} />
            </div>
        </aside>
    );
};

// --- COMPONENT CON CHO LƯỚI SẢN PHẨM VÀ PHÂN TRANG ---
const ProductsGrid = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Hiển thị 8 sản phẩm mỗi trang

    // Logic phân trang phía client
    const indexOfLastProduct = currentPage * pageSize;
    const indexOfFirstProduct = indexOfLastProduct - pageSize;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className="products-grid-container">
            <div className="products-header">
                <p>Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} của {products.length} kết quả</p>
                <Select defaultValue="default" style={{ width: 200 }}>
                    <Select.Option value="default">Sắp xếp mặc định</Select.Option>
                    <Select.Option value="price-asc">Giá: Thấp đến Cao</Select.Option>
                    <Select.Option value="price-desc">Giá: Cao đến Thấp</Select.Option>
                </Select>
            </div>

            <Row gutter={[24, 24]}>
                {currentProducts.map(product => (
                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard {...product} />
                    </Col>
                ))}
            </Row>

            <div className="pagination-container">
                <Pagination 
                    current={currentPage}
                    pageSize={pageSize}
                    total={products.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false} // Tạm thời ẩn chức năng đổi số lượng sản phẩm/trang
                />
            </div>
        </div>
    );
};

// --- COMPONENT CHÍNH CỦA TRANG ---
const ProductsPage = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await getProductsApi();
                if (res && res.EC === 0 && Array.isArray(res.DT)) {
                    setAllProducts(res.DT);
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
        fetchAllProducts();
    }, []);

    return (
        <div className="products-page-layout">
            {isLoading ? (
                <div style={{ textAlign: 'center' }}><Spin size="large" /></div>
            ) : (
                <Row gutter={[32, 32]}>
                    <Col xs={24} lg={6}>
                        <FiltersSidebar />
                    </Col>
                    <Col xs={24} lg={18}>
                        <ProductsGrid products={allProducts} />
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default ProductsPage;