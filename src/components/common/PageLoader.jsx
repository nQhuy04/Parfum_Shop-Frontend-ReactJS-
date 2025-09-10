import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingContext } from '../context/loading.context';

// Component này là một "wrapper", nó sẽ "bọc" các trang của bạn
// Nhiệm vụ của nó là tự động bật/tắt loading mỗi khi bạn chuyển trang.
const PageLoader = ({ children }) => {
    const { showLoading, hideLoading } = useContext(LoadingContext);
    
    // useLocation là một hook của React Router, nó cho chúng ta biết URL hiện tại.
    // Khi URL thay đổi (tức là khi bạn chuyển trang), useEffect sẽ được kích hoạt.
    const location = useLocation();

    useEffect(() => {
        // Khi component được mount (bắt đầu chuyển trang)
        showLoading();

        // Đặt một khoảng hẹn giờ nhỏ để tắt loading, tạo cảm giác mượt mà
        // Nếu không có hẹn giờ, loading sẽ tắt quá nhanh và bạn sẽ không thấy gì
        const timer = setTimeout(() => {
            hideLoading();
        }, 500); // 500ms (nửa giây) là một khoảng thời gian hợp lý

        // Đây là hàm "dọn dẹp". Nó sẽ được gọi khi bạn rời khỏi trang.
        // Điều này đảm bảo rằng nếu bạn click chuyển trang quá nhanh, hẹn giờ cũ sẽ bị hủy.
        return () => clearTimeout(timer);
        
    // Chúng ta muốn hiệu ứng này chạy lại MỖI KHI đường dẫn thay đổi.
    }, [location.pathname, showLoading, hideLoading]);

    // Cuối cùng, nó sẽ render ra component con mà nó bọc (ví dụ: <HomePage />)
    return children;
};

export default PageLoader;