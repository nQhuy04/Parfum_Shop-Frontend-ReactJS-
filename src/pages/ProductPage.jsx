// src/pages/ProductsPage.jsx

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, notification, Typography, Divider, Radio, Slider, Select, Pagination, Empty } from 'antd'; 
import { getProductsApi } from '../ultil/api';
import ProductCard from '../components/ProductCard';
import { LoadingContext } from '../components/context/loading.context';
import debounce from 'lodash.debounce';
import '../styles/products-page.css';

const { Title, Text } = Typography;

// --- COMPONENT CON CHO SIDEBAR (ĐÃ NÂNG CẤP) ---
const FiltersSidebar = ({ onFilterChange, availableBrands, searchParams }) => {

    const handleRadioChange = (key, value) => {
        const currentValue = searchParams.get(key);
        // Nếu click lại nút đã chọn -> bỏ chọn
        onFilterChange(key, currentValue === value ? null : value);
    };
    
    // Đọc giá trị từ URL để set cho Slider
    const minPrice = Number(searchParams.get('minPrice')) || 0;
    const maxPrice = Number(searchParams.get('maxPrice')) || 20000000;

    return (
        <aside className="filters-sidebar">
            <div className="filter-group">
                <Title level={5} className="filter-title">Thương hiệu</Title>
                <Radio.Group className="filter-radio-group" value={searchParams.get('brand')}>
                    {availableBrands.map(brand => (
                        <Radio.Button key={brand} value={brand} onClick={() => handleRadioChange('brand', brand)}>
                            {brand}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            </div>
            <Divider />
            <div className="filter-group">
                <Title level={5} className="filter-title">Giới tính</Title>
                <Radio.Group className="filter-radio-group" value={searchParams.get('gender')}>
                    <Radio.Button value="men" onClick={() => handleRadioChange('gender', 'men')}>Nam</Radio.Button>
                    <Radio.Button value="women" onClick={() => handleRadioChange('gender', 'women')}>Nữ</Radio.Button>
                    <Radio.Button value="unisex" onClick={() => handleRadioChange('gender', 'unisex')}>Unisex</Radio.Button>
                </Radio.Group>
            </div>
            <Divider />
            <div className="filter-group">
                <Title level={5} className="filter-title">Giá cả</Title>
                <Slider
                    range
                    key={`${minPrice}-${maxPrice}`} // Thêm key để Slider tự reset
                    defaultValue={[minPrice, maxPrice]}
                    max={20000000} step={500000}
                    onAfterChange={(values) => onFilterChange('price', values)}
                    tooltip={{ formatter: (value) => `${(value / 1000000).toFixed(1)} triệu` }}
                />
            </div>
        </aside>
    );
};

// --- COMPONENT CON CHO LƯỚI SẢN PHẨM VÀ PHÂN TRANG ---
const ProductsGrid = ({ productsToDisplay, onFilterChange }) => { // Thêm prop `onFilterChange`
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const indexOfLastProduct = currentPage * pageSize;
    const indexOfFirstProduct = indexOfLastProduct - pageSize;
    const currentProducts = productsToDisplay.slice(indexOfFirstProduct, indexOfLastProduct);

    useEffect(() => {
        setCurrentPage(1);
    }, [productsToDisplay]);

    if (productsToDisplay.length === 0) {
        return <Empty description="Không tìm thấy sản phẩm nào phù hợp." />
    }

    return (
        <div className="products-grid-container">
            <div className="products-header">
                <p>Hiển thị {productsToDisplay.length} kết quả</p>
                {/* Select giờ sẽ gọi hàm từ component cha */}
                <Select 
                    onChange={(value) => onFilterChange('sort', value)} 
                    defaultValue="latest" 
                    style={{ width: 200 }}
                >
                    <Select.Option value="latest">Mới nhất</Select.Option>
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
                    total={productsToDisplay.length} // total phải dựa trên productsToDisplay
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

// --- COMPONENT CHÍNH ---
const ProductsPage = () => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    // Chuyển sang useCallback để ổn định
    const handleFilterChange = useCallback((key, value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (key === 'price') {
            newSearchParams.set('minPrice', value[0]);
            newSearchParams.set('maxPrice', value[1]);
        } else if (!value) {
            newSearchParams.delete(key);
        } else {
            newSearchParams.set(key, value);
        }
        setSearchParams(newSearchParams);
    }, [searchParams, setSearchParams]);


    const debouncedFetch = useCallback(debounce((params) => {
        showLoading();
        const queryString = new URLSearchParams(params).toString();
        getProductsApi(queryString ? `?${queryString}` : '')
            .then(res => {
                if (res && res.EC === 0) {
                    setFilteredProducts(res.DT);
                    // Lấy tất cả brand từ DB để hiển thị (ổn định hơn)
                    if (uniqueBrands.length === 0) {
                        getProductsApi().then(allRes => {
                            if (allRes && allRes.EC === 0) {
                                setUniqueBrands([...new Set(allRes.DT.map(p => p.brand))].sort());
                            }
                        })
                    }
                }
            })
            .catch(() => notification.error({ message: "Lỗi khi lọc sản phẩm." }))
            .finally(() => hideLoading());
    }, 400), [uniqueBrands]); // uniqueBrands giúp hàm chỉ tạo lại một lần


    useEffect(() => {
        const currentParams = Object.fromEntries(searchParams.entries());
        debouncedFetch(currentParams);
    }, [searchParams, debouncedFetch]);

    return (
        <div className="products-page-layout">
            <Row gutter={[48, 48]}>
                <Col xs={24} lg={6}>
                    <FiltersSidebar onFilterChange={handleFilterChange} availableBrands={uniqueBrands} searchParams={searchParams} />
                </Col>
                <Col xs={24} lg={18}>
                    <ProductsGrid productsToDisplay={filteredProducts} onFilterChange={handleFilterChange} searchParams={searchParams} />
                </Col>
            </Row>
        </div>
    );
};

export default ProductsPage;