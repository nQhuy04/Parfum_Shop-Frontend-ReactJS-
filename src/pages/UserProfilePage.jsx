// src/pages/UserProfilePage.jsx

import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, notification, Typography, Divider } from 'antd';
import { AuthContext } from '../components/context/auth.context';
import { updateProfileApi } from '../ultil/api';
import '../styles/user-profile.css';

const { Title } = Typography;

const UserProfilePage = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    // Đồng bộ form với dữ liệu từ context khi component tải
    useEffect(() => {
        form.setFieldsValue({
            name: auth.user.name,
            email: auth.user.email
        });
    }, [auth.user, form]);

    const onFinish = async (values) => {
        try {
            // Chỉ gửi đi `name` vì email không cho sửa
            const res = await updateProfileApi({ name: values.name });

            if (res && res.EC === 0) {
                // Cập nhật lại thông tin user trong context để header thay đổi theo
                setAuth(prevAuth => ({
                    ...prevAuth,
                    user: { ...prevAuth.user, name: res.DT.name }
                }));
                notification.success({ message: "Cập nhật thông tin thành công!" });
                setIsEditing(false); // Tắt chế độ chỉnh sửa
            } else {
                notification.error({ message: res.EM || "Có lỗi xảy ra." });
            }
        } catch (error) {
             notification.error({ message: "Lỗi hệ thống." });
        }
    };

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <Title level={2}>Thông tin Tài khoản</Title>
                {!isEditing && <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>}
            </div>
            <Divider />
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                    <Input disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input disabled />
                </Form.Item>
                {isEditing && (
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                            Lưu thay đổi
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default UserProfilePage;