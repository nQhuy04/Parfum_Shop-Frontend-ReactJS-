// src/pages/login.jsx

import React, { useContext } from 'react';
import { Button, Form, Input, notification, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../ultil/api';
import { AuthContext } from '../components/context/auth.context';

import '../styles/auth.css';

const { Title, Text } = Typography; 

const LoginPage = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        
        try {
            const res = await loginApi(email, password);
            if (res && res.DT && res.DT.access_token) {
                localStorage.setItem("access_token", res.DT.access_token);
                
                const user = res.DT.user;
                
                notification.success({
                    message: "Đăng nhập thành công",
                    description: `Chào mừng ${user.name}!`
                });

                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: user.email,
                        name: user.name,
                        role: user.role // Đảm bảo role được lưu
                    }
                });
                
                // === LOGIC CHUYỂN HƯỚNG THÔNG MINH ===
                if (user.role === 'admin') {
                    // Nếu là admin, chuyển đến trang Admin Dashboard
                    navigate('/admin'); 
                } else {
                    // Nếu là user thường, chuyển về trang chủ
                    navigate('/'); 
                }

            } else {
                notification.error({
                    message: "Đăng nhập thất bại",
                    description: res?.EM ?? "Thông tin đăng nhập không chính xác."
                });
            }
        } catch (error) {
             notification.error({
                    message: "Đăng nhập thất bại",
                    description: "Có lỗi xảy ra, vui lòng thử lại."
                });
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <Title className="auth-title">Đăng nhập</Title>
                <Form
                    name="login-form"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, {type: 'email', message: 'Email không hợp lệ!'}]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button">Đăng nhập</Button>
                    </Form.Item>
                </Form>
                <div className="auth-switch-link">
                    <Text>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></Text>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;