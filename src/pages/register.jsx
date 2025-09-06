import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { createUserApi } from '../ultil/api';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {

    const navigate = useNavigate();
    const onFinish = async(values) => {
        //lấy các dữ liệu người dùng đã nhập:
        const {name, email, password} = values;

        //phản hồi về
        const res = await createUserApi(name, email, password);

        if(res) {
            //notification đã có sẵn của antd, đã import ở trên
            notification.success({
                message: "CREATE USER",
                description: "Success"
            })
            navigate("/login");//Chuyển hướng đến trang login khi đăng ký thành công
        }else{
            otification.error({
                message: "CREATE USER",
                description: "Error"
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
                layout = 'vertical'//để theo chiều dọc
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

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>

    )
}

export default RegisterPage