// src/pages/admin/user.jsx

import { notification, Table, Tag, Popconfirm, Button, Typography } from "antd";
import { useEffect, useState, useContext } from "react";
import { getUsersApi, deleteUserApi } from "../../ultil/api"; // Bổ sung API xóa user
import { AuthContext } from "../../components/context/auth.context";


const { Title } = Typography; 

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useContext(AuthContext);
    
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await getUsersApi();
            if (res && res.EC === 0 && Array.isArray(res.DT)) {
                setDataSource(res.DT);
            } else {
                notification.error({ message: "Không thể tải danh sách người dùng." });
            }
        } catch (error) {
             notification.error({ message: "Lỗi hệ thống." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    // Hàm xóa user (Sẽ thêm vào nút bấm sau)
    const handleDelete = async (userId) => {
         try {
            const res = await deleteUserApi(userId);
             if (res && res.EC === 0) {
                notification.success({ message: "Xóa người dùng thành công!" });
                fetchUsers(); // Tải lại danh sách
            } else {
                notification.error({ message: res.EM || "Xóa thất bại" });
            }
        } catch (error) {
             notification.error({ message: "Lỗi hệ thống" });
        }
    };

    const columns = [
        { title: 'ID', dataIndex: '_id', render: (id) => `...${id.slice(-6)}` },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Tên', dataIndex: 'name' },
        { 
            title: 'Vai trò', 
            dataIndex: 'role',
            render: (role) => <Tag color={role === 'admin' ? 'volcano' : 'geekblue'}>{role?.toUpperCase()}</Tag>
        },
         {
            title: 'Hành động',
            render: (_, record) => (
                // Không cho phép admin tự xóa chính mình
                record._id !== auth.user._id &&
                <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
                    <Button danger>Xóa</Button>
                </Popconfirm>
            )
        }
    ];
    
    return (
        <div>
            <Title level={3} style={{ marginBottom: 20 }}>Quản lý Người dùng</Title>
            <Table 
                dataSource={dataSource} 
                columns={columns}
                rowKey={"_id"}
                bordered
                loading={isLoading}
                scroll={{ x: true }}
            />
        </div>
    )
}

export default UserPage;