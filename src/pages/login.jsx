import React, { useContext } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginApi } from '../ultil/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';


const LoginPage = () => {

    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        //lấy các dữ liệu người dùng đã nhập:
        const { email, password } = values;

        //phản hồi về
        const res = await loginApi(email, password);

        if (res && res.EC === 0) {
            //notification đã có sẵn của antd, đã import ở trên
            localStorage.setItem("access_token", res.access_token)
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.name ?? "",
                }
            })
            navigate("/");//Chuyển hướng đến trang home khi đăng nhập thành công
        } else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
            })
        }

        console.log('Success:', res);
    };


    return (
        <div style={{ margin: 50 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}

                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'//để theo chiều dọc
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>

    )
}

export default LoginPage