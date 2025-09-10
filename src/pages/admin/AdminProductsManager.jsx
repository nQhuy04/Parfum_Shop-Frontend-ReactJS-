// src/pages/admin/AdminProductsManager.jsx

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Popconfirm, notification, Image, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../../ultil/api';

const { Option } = Select;

const AdminProductsManager = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await getProductsApi();
            if (res && res.EC === 0 && Array.isArray(res.DT)) {
                // Sắp xếp sản phẩm mới nhất lên đầu
                const sortedProducts = res.DT.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setProducts(sortedProducts);
            }
        } catch (error) {
            notification.error({ message: "Không thể tải danh sách sản phẩm" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    // --- XỬ LÝ CÁC HÀNH ĐỘNG MỞ MODAL ---
    const handleAdd = () => {
        setEditingProduct(null); // Không có sản phẩm nào đang được sửa
        form.resetFields();      // Reset form
        setIsModalVisible(true);
    };
    const handleEdit = (record) => {
        setEditingProduct(record);
        form.setFieldsValue(record); // Điền thông tin sản phẩm vào form
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // --- XỬ LÝ CÁC HÀNH ĐỘNG SUBMIT FORM VÀ XÓA ---
    const onFinish = async (values) => {
        const apiCall = editingProduct
            ? updateProductApi(editingProduct._id, values) // Gọi API cập nhật
            : createProductApi(values);                     // Gọi API tạo mới
        try {
            const res = await apiCall;
            if (res && res.EC === 0) {
                notification.success({ message: `${editingProduct ? 'Cập nhật' : 'Thêm'} sản phẩm thành công!` });
                setIsModalVisible(false);
                fetchProducts(); // Tải lại danh sách
            } else {
                notification.error({ message: res.EM || "Thao tác thất bại" });
            }
        } catch (error) {
             notification.error({ message: "Lỗi hệ thống" });
        }
    };

    const handleDelete = async (productId) => {
        try {
            const res = await deleteProductApi(productId);
            if (res && res.EC === 0) {
                notification.success({ message: "Xóa sản phẩm thành công!" });
                fetchProducts(); // Tải lại danh sách
            } else {
                notification.error({ message: res.EM || "Xóa thất bại" });
            }
        } catch (error) {
             notification.error({ message: "Lỗi hệ thống" });
        }
    };

    // --- CẤU HÌNH CHO BẢNG ---
    const columns = [
        { title: 'Ảnh', dataIndex: 'image', render: (url) => <Image src={url} width={50} /> },
        { title: 'Tên sản phẩm', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Thương hiệu', dataIndex: 'brand', sorter: (a, b) => a.brand.localeCompare(b.brand) },
        { title: 'Giá', dataIndex: 'price', render: (price) => `${price.toLocaleString('vi-VN')} đ`, sorter: (a, b) => a.price - b.price, width: 150 },
        { title: 'Tồn kho', dataIndex: 'stock', sorter: (a, b) => a.stock - b.stock, width: 120 },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
                    <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)} okText="Xóa" cancelText="Hủy">
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </span>
            ),
            width: 200,
        },
    ];

    return (
        <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
                Thêm sản phẩm mới
            </Button>
            <Table 
                columns={columns} 
                dataSource={products} 
                rowKey="_id" 
                loading={isLoading} 
                bordered
                scroll={{ x: true }} // Thêm thanh cuộn ngang nếu không đủ chỗ
            />
            
            {/* Modal để thêm/sửa */}
            <Modal
                title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null} // Ẩn footer mặc định
            >
                <Form form={form} layout="vertical" name="product_form" onFinish={onFinish}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: 'Vui lòng nhập thương hiệu!' }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                       <Col span={12}><Form.Item name="price" label="Giá" rules={[{ required: true, type: 'number', message: 'Vui lòng nhập giá!' }]}><InputNumber style={{ width: '100%' }} min={0} addonAfter="đ" /></Form.Item></Col>
                       <Col span={12}><Form.Item name="stock" label="Tồn kho" rules={[{ required: true, type: 'number', message: 'Vui lòng nhập số lượng!' }]}><InputNumber style={{ width: '100%' }} min={0} /></Form.Item></Col>
                    </Row>
                     <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                        <Select placeholder="Chọn giới tính">
                            <Option value="men">Nam</Option>
                            <Option value="women">Nữ</Option>
                            <Option value="unisex">Unisex</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="image" label="Link hình ảnh" rules={[{ required: true, type: 'url', message: 'Vui lòng nhập link ảnh hợp lệ!' }]}>
                        <Input />
                    </Form.Item>
                     <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                     <Form.Item style={{ textAlign: 'right' }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductsManager;