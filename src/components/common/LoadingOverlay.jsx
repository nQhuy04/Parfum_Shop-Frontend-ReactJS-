// src/components/common/LoadingOverlay.jsx

import React from 'react';
import { Spin } from 'antd';
import '../../styles/loading.css';

// Component này nhận vào một prop `isLoading`
const LoadingOverlay = ({ isLoading }) => {
    // Thêm/bỏ class 'visible' dựa trên prop `isLoading`
    const overlayClass = `loading-overlay ${isLoading ? 'visible' : ''}`;

    return (
        <div className={overlayClass}>
            <div className="loading-spinner-container">
                <div className="loading-logo">PARFUM</div>
                <Spin size="large" />
            </div>
        </div>
    );
};

export default LoadingOverlay;