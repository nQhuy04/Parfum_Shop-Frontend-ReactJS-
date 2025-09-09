// src/pages/login.jsx

import React, { useContext } from 'react';
import { Button, Form, Input, notification, Typography } from 'antd'; // Typography đã được import
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../ultil/api';
import { AuthContext } from '../components/context/auth.context';

import '../styles/auth.css';

// === LỖI NẰM Ở ĐÂY: Quên khai báo `Text` ===
// Sửa lại thành:
const { Title, Text } = Typography; 

const LoginPage = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        
        // Đoạn code cũ của bạn có access_token nằm trong res, còn của tôi đang dự đoán là res.DT
        // Để an toàn, chúng ta sẽ kiểm tra cả 2 trường hợp.
        // Tôi sẽ sửa logic này để nó linh hoạt và chính xác hơn với cấu trúc backend của bạn.
        try {
            const res = await loginApi(email, password);
            if (res && res.DT && res.DT.access_token) { // Ưu tiên kiểm tra cấu trúc mới
                localStorage.setItem("access_token", res.DT.access_token);
                notification.success({
                    message: "Đăng nhập thành công",
                    description: `Chào mừng ${res.DT.user.name}!`
                });
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.DT.user.email,
                        name: res.DT.user.name,
                        role: res.DT.user.role
                    }
                });
                navigate("/");
            } else if (res && res.access_token) { // Dự phòng cho cấu trúc cũ bạn từng gửi
                 localStorage.setItem("access_token", res.access_token);
                notification.success({
                    message: "Đăng nhập thành công",
                    description: `Chào mừng ${res.user.name}!`
                });
                setAuth({
                    isAuthenticated: true,
                    user: {
                        email: res.user.email,
                        name: res.user.name,
                        role: res.user.role
                    }
                });
                navigate("/");
            }
            
            else { // Nếu cả 2 trường hợp trên đều không đúng
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
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, {type: 'email', message: 'Email không hợp lệ!'}]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="auth-button">
                            Đăng nhập
                        </Button>
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