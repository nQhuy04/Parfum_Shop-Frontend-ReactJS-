// src/components/context/auth.context.jsx
import React, { createContext, useState, useCallback } from 'react';
import { getAccountApi } from '../../ultil/api';

const INITIAL_STATE = {
    isAuthenticated: false,
    user: { email: "", name: "", role: "" },
};

export const AuthContext = createContext({
    auth: INITIAL_STATE,
    setAuth: () => {},
    fetchAndUpdateUser: async () => {}, // Thêm hàm mới
});

export const AuthWrapper = ({ children }) => {
    const [auth, setAuth] = useState(INITIAL_STATE);

    // Hàm này sẽ là nơi duy nhất chịu trách nhiệm fetch và cập nhật thông tin user
    const fetchAndUpdateUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            const res = await getAccountApi();
            if (res && res.DT && res.DT.user) {
                setAuth({
                    isAuthenticated: true,
                    user: res.DT.user,
                });
            } else {
                // Token không hợp lệ -> logout
                localStorage.removeItem("access_token");
                setAuth(INITIAL_STATE);
            }
        } else {
            // Không có token -> đảm bảo đã logout
            setAuth(INITIAL_STATE);
        }
    }, []); // useCallback với mảng rỗng để hàm này không bị tạo lại

    return (
        <AuthContext.Provider value={{ auth, setAuth, fetchAndUpdateUser }}>
            {children}
        </AuthContext.Provider>
    );
};