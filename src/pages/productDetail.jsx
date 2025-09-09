// src/pages/ProductDetail.jsx

import React, { useEffect, useState, useContext } from 'react'; // 1. Thêm useContext
import { useParams, useNavigate } from 'react-router-dom'; // 2. Thêm useNavigate
import { Row, Col, Image, Typography, Button, Spin, notification, InputNumber, Tag } from 'antd';
import { getProductByIdApi, addToCartApi } from '../ultil/api'; // 3. Thêm addToCartApi

// 4. Import các Context cần thiết
import { AuthContext } from '../components/context/auth.context';
import { CartContext } from '../components/context/cart.context';

import '../styles/home.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Dùng để chuyển hướng

    // 5. Lấy state và function từ các Context
    const { auth } = useContext(AuthContext);
    const { fetchCart } = useContext(CartContext); // Lấy hàm fetchCart để refresh giỏ hàng

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false); // State loading cho nút bấm

    useEffect(() => {
        // ... hàm fetchProductDetail giữ nguyên không đổi ...
        const fetchProductDetail = async () => { /* ... */ };
        fetchProductDetail();
    }, [id]);

    // === 6. TẠO HÀM XỬ LÝ KHI BẤM NÚT "THÊM VÀO GIỎ" ===
    const handleAddToCart = async () => {
        // Kiểm tra xem user đã đăng nhập chưa
        if (!auth.isAuthenticated) {
            notification.warning({
                message: "Bạn chưa đăng nhập",
                description: "Vui lòng đăng nhập để thực hiện chức năng này."
            });
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
            return;
        }

        setIsAddingToCart(true); // Bật loading
        try {
            const res = await addToCartApi(id, quantity);
            if (res && res.EC === 0) {
                notification.success({
                    message: "Thành công",
                    description: `Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng.`,
                });
                // Sau khi thêm thành công, gọi lại fetchCart để cập nhật state toàn cục
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
            setIsAddingToCart(false); // Tắt loading
        }
    };

    // ... phần loading và return giao diện ...

    if (isLoading) { /* ... */ }
    if (!product) { /* ... */ }
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
    
    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <Row gutter={[48, 48]}>
                {/* ... Cột hình ảnh giữ nguyên ... */}
                <Col xs={24} md={12}>{/* ... */}</Col>

                {/* Cột thông tin chi tiết */}
                <Col xs={24} md={12}>
                    {/* ... các thông tin khác giữ nguyên ... */}
                    {/* ... Tag, Title, Price, Paragraph, InputNumber ... */}

                    {/* === 7. CẬP NHẬT LẠI NÚT BẤM === */}
                    <Button 
                        type="primary" 
                        size="large" 
                        style={{ backgroundColor: 'var(--color-dark)', border: 'none' }}
                        onClick={handleAddToCart} // Gắn hàm xử lý
                        loading={isAddingToCart}   // Thêm trạng thái loading
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

export default ProductDetail;