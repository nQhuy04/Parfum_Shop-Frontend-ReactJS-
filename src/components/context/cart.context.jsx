
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCartApi } from '../../ultil/api';
import { AuthContext } from './auth.context';

// Tạo Context
export const CartContext = createContext({
    cartItems: [],
    fetchCart: () => {}
});

// Tạo Provider Wrapper
export const CartWrapper = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { auth } = useContext(AuthContext); // Lấy trạng thái đăng nhập

    // Hàm để gọi API và cập nhật state giỏ hàng
    const fetchCart = async () => {
        // Chỉ fetch khi người dùng đã đăng nhập
        if (!auth.isAuthenticated) {
            setCartItems([]); // Nếu không đăng nhập, giỏ hàng luôn rỗng
            return;
        }

        const res = await getCartApi();
        if (res && res.EC === 0 && res.DT.items) {
            setCartItems(res.DT.items);
        } else {
            setCartItems([]); // Nếu có lỗi hoặc giỏ hàng rỗng, trả về mảng rỗng
        }
    };

    // Tự động fetch giỏ hàng khi trạng thái đăng nhập thay đổi (VD: khi user login)
    useEffect(() => {
        fetchCart();
    }, [auth.isAuthenticated]); // Chạy lại effect này mỗi khi user đăng nhập hoặc đăng xuất

    return (
        <CartContext.Provider value={{ cartItems, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};