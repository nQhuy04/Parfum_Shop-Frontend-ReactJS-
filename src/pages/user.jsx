import { notification, Table } from "antd";
import { useEffect, useState, useContext } from "react"; // Import useContext
import { getUsersApi } from "../ultil/api"; // Sửa thành getUsersApi
import { AuthContext } from "../components/context/auth.context"; // Import AuthContext
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const { auth } = useContext(AuthContext); // Lấy thông tin auth từ context
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            // Chỉ fetch nếu user hiện tại là admin
            if (auth.isAuthenticated && auth.user.role === "ADMIN") { // Kiểm tra quyền ADMIN
                const res = await getUsersApi(); // Sử dụng getUsersApi
                console.log(">>> check res: ", res);
                if (res && res.EC === 0) { // Giả định response có cấu trúc { EC: 0, users: [...] }
                    setDataSource(res.users); // Giả định response có cấu trúc { EC: 0, users: [...] }
                } else {
                    notification.error({
                        message: "Lỗi",
                        description: res?.EM || "Không thể lấy danh sách người dùng."
                    });
                    // Nếu có lỗi hoặc không có quyền, có thể chuyển hướng
                    navigate("/");
                }
            } else {
                // Nếu không phải admin, hiển thị thông báo và chuyển hướng
                notification.warning({
                    message: "Truy cập bị từ chối",
                    description: "Bạn không có quyền xem trang này."
                });
                navigate("/"); // Chuyển hướng về trang chủ
            }
        }
        // Gọi fetchUsers chỉ khi auth đã được tải xong (appLoading là false)
        // và khi auth.isAuthenticated hoặc auth.user.role thay đổi
        if (!auth.appLoading) { // Đảm bảo appLoading đã hoàn tất
             fetchUsers();
        }
    }, [auth, navigate]); // Thêm auth và navigate vào dependency array

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];

    return (
        <div style={{ padding: 30 }}>
            {auth.isAuthenticated && auth.user.role === "ADMIN" ? (
                <Table dataSource={dataSource} columns={columns}
                    rowKey={"_id"}
                />
            ) : (
                <p>Bạn không có quyền truy cập trang này.</p>
            )}
        </div>
    )
}

export default UserPage;