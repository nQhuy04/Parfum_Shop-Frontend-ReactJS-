// components/layout/DefaultLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
// import Footer from './footer'; // Sẽ tạo sau

const DefaultLayout = () => {
    return (
        <div className="default-layout">
            <Header />
            <div className="content">
                <Outlet /> {/* Nơi các trang con sẽ được render */}
            </div>
            {/* <Footer /> */} {/* Sẽ thêm Footer sau */}
        </div>
    );
};

export default DefaultLayout;