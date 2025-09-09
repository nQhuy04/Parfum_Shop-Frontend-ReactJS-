import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

const { Meta } = Card;

const ProductCard = (props) => {
    // Component này sẽ nhận dữ liệu của một sản phẩm qua props
    const { _id, name, price, image } = props;

    // Định dạng lại giá tiền cho đẹp
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        // Bọc Card trong Link để điều hướng đến trang chi tiết khi bấm vào
        <Link to={`/product/${_id}`}>
            <Card
                hoverable
                style={{ width: '100%' }} // Để 100% chiều rộng của Col chứa nó
                cover={<img 
                    alt={name} 
                    src={image} 
                    style={{ height: 240, objectFit: 'cover' }} // Giữ các ảnh cùng kích thước
                />}
            >
                <Meta 
                    title={name} 
                    description={formattedPrice} 
                />
            </Card>
        </Link>
    );
};

export default ProductCard;