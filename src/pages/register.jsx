// src/pages/register.jsx

import React from 'react';
import { Button, Form, Input, notification, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { createUserApi } from '../ultil/api';

// Import file CSS dùng chung
import '../styles/auth.css';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const navigate = useNavigate();

    // === GIỮ NGUYÊN LOGIC XỬ LÝ FORM ===
    const onFinish = async (values) => {
        const { name, email, password } = values;
        const res = await createUserApi(name, email, password);

        // API của bạn trả về data khi thành công, nên cần check `res.DT`
        if (res && res.DT) {
            notification.success({
                message: "Tạo tài khoản thành công!",
                description: "Vui lòng đăng nhập để tiếp tục."
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Tạo tài khoản thất bại",
                description: res.EM || "Có lỗi xảy ra, email có thể đã tồn tại."
            });
        }
    };

    // === THAY THẾ GIAO DIỆN MỚI ===
    return (
        <div className="auth-page-wrapper">
            <div className="auth-container">
                <Title className="auth-title">Tạo tài khoản</Title>
                <Form
                    name="register-form"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input />
                    </Form.Item>

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
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
                <div className="auth-switch-link">
                    <Text>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></Text>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;