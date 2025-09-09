// src/components/context/loading.context.jsx

import React, { createContext, useState, useCallback } from 'react';

export const LoadingContext = createContext({
    isLoading: false,
    showLoading: () => {},
    hideLoading: () => {},
});

export const LoadingWrapper = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Sử dụng useCallback để các hàm không bị tạo lại mỗi lần re-render
    const showLoading = useCallback(() => setIsLoading(true), []);
    const hideLoading = useCallback(() => setIsLoading(false), []);

    const value = { isLoading, showLoading, hideLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};