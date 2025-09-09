// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h4 className="footer-title">Về PARFUM</h4>
                    <p>Chúng tôi mang đến thế giới mùi hương đẳng cấp, nơi mỗi chai nước hoa là một câu chuyện độc đáo, thể hiện cá tính và phong cách của bạn.</p>
                </div>
                <div className="footer-column">
                    <h4 className="footer-title">Liên kết nhanh</h4>
                    <Link to="/products" className="footer-link">Sản phẩm</Link>
                    <Link to="/about" className="footer-link">Giới thiệu</Link>
                    <Link to="/contact" className="footer-link">Liên hệ</Link>
                    <Link to="/faq" className="footer-link">Câu hỏi thường gặp</Link>
                </div>
                <div className="footer-column">
                    <h4 className="footer-title">Hỗ trợ khách hàng</h4>
                    <Link to="/policy" className="footer-link">Chính sách đổi trả</Link>
                    <Link to="/shipping" className="footer-link">Chính sách vận chuyển</Link>
                    <Link to="/privacy" className="footer-link">Chính sách bảo mật</Link>
                </div>
            </div>
            <div className="footer-bottom">
                © {new Date().getFullYear()} PARFUM. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;