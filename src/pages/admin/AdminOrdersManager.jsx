// src/pages/admin/AdminOrdersManager.jsx

import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Select, notification, Typography, Popover, Divider } from 'antd';
import { getAllOrdersApi, updateOrderStatusApi } from '../../ultil/api';

const { Title, Text } = Typography;
const { Option } = Select;

// === TẠO "TỪ ĐIỂN" ĐỂ DỊCH VÀ ĐỊNH NGHĨA MÀU SẮC ===
const statusMapping = {
    pending:   { text: 'Chờ xử lý', color: 'gold' },
    paid:      { text: 'Đã thanh toán', color: 'processing' },
    shipped:   { text: 'Đang giao hàng', color: 'purple' },
    completed: { text: 'Hoàn thành', color: 'success' },
    cancelled: { text: 'Đã hủy', color: 'error' },
};

// Tự động tạo mảng tùy chọn cho bộ lọc và Select từ "từ điển" trên
const statusOptions = Object.keys(statusMapping).map(key => ({
    value: key,
    label: statusMapping[key].text
}));

const filterOptions = Object.keys(statusMapping).map(key => ({
    text: statusMapping[key].text,
    value: key,
}));

const AdminOrdersManager = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // --- Fetch dữ liệu ---
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await getAllOrdersApi();
            if (res && res.EC === 0 && Array.isArray(res.DT)) {
                setOrders(res.DT);
            } else {
                notification.error({ message: "Không thể tải danh sách đơn hàng." });
            }
        } catch (error) {
            notification.error({ message: "Lỗi hệ thống." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // --- Xử lý sự kiện ---
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };
    
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await updateOrderStatusApi(orderId, newStatus);
            if (res && res.EC === 0) {
                notification.success({ message: "Cập nhật trạng thái thành công!" });
                fetchOrders(); // Tải lại danh sách
            } else {
                 notification.error({ message: res.EM || "Cập nhật thất bại." });
            }
        } catch(error) {
             notification.error({ message: "Lỗi hệ thống." });
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN');

    // --- Cấu hình cho bảng ---
    const columns = [
        { title: 'Mã ĐH', dataIndex: '_id', render: id => `...${id.slice(-6).toUpperCase()}` },
        { title: 'Khách hàng', dataIndex: 'user', render: user => user?.name ?? 'N/A' },
        { title: 'Ngày đặt', dataIndex: 'createdAt', render: date => formatDate(date), sorter: (a,b) => new Date(a.createdAt) - new Date(b.createdAt) },
        { title: 'Tổng tiền', dataIndex: 'totalAmount', render: amount => formatPrice(amount), sorter: (a,b) => a.totalAmount - b.totalAmount },
        { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            render: (status, record) => (
                <Select 
                    value={status} // Dùng value thay cho defaultValue để control component
                    style={{ width: 150 }} 
                    onChange={(value) => handleStatusChange(record._id, value)}
                >
                    {statusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                           <Tag color={statusMapping[option.value].color} style={{ margin: 0 }}>
                                {option.label.toUpperCase()}
                           </Tag>
                        </Option>
                    ))}
                </Select>
            ),
             filters: filterOptions, // Sử dụng bộ lọc đã được Việt hóa
             onFilter: (value, record) => record.status.indexOf(value) === 0,
        },
        {
            title: 'Hành động',
            render: (_, record) => <Button onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
        },
    ];
    
    return (
        <div>
            <Title level={3} style={{ marginBottom: 20 }}>Quản lý Đơn hàng</Title>
            <Table 
                columns={columns} 
                dataSource={orders} 
                rowKey="_id" 
                loading={isLoading} 
                bordered
                scroll={{ x: true }}
            />
            
            {/* Modal để xem chi tiết đơn hàng */}
            <Modal
                title={`Chi tiết Đơn hàng #${selectedOrder?._id.slice(-6).toUpperCase()}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>]}
                width={700}
            >
                {selectedOrder && (
                    <div>
                        <p><strong>Khách hàng:</strong> {selectedOrder.user?.name}</p>
                        <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                        <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}</p>
                        <Divider />
                        <Title level={5}>Thông tin giao hàng</Title>
                        <p><strong>Người nhận:</strong> {selectedOrder.shippingAddress.name}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.shippingAddress.phone}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress.address}</p>
                        <Divider />
                         <Title level={5}>Danh sách sản phẩm</Title>
                        {selectedOrder.items.map(item => (
                           <div key={item.product?._id} style={{display: 'flex', marginBottom: 10}}>
                               <span>{item.quantity} x {item.product?.name ?? "Sản phẩm đã xóa"}</span>
                               <span style={{marginLeft: 'auto'}}>{formatPrice(item.price * item.quantity)}</span>
                           </div>
                        ))}
                         <Divider />
                         <Title level={4} style={{textAlign: 'right'}}>Tổng cộng: {formatPrice(selectedOrder.totalAmount)}</Title>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminOrdersManager;