import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register"
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data);
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login"
    const data = {
        email, password
    }
    return axios.post(URL_API, data);
}

// API mới để lấy thông tin tài khoản của user đang đăng nhập
const getAccountApi = () => {
    const URL_API = "/v1/api/users/account" // URL đúng theo backend của bạn
    return axios.get(URL_API);
}

// Đổi tên từ getUserApi thành getUsersApi và cập nhật URL cho Admin
const getUsersApi = () => {
    const URL_API = "/v1/api/users" // URL đúng cho Admin lấy danh sách user
    return axios.get(URL_API);
}


const getProductsApi = () => {
    const URL_API = "/v1/api/products";
    return axios.get(URL_API);
}

const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    return axios.get(URL_API);
}



// Cập nhật lại dòng export
export {
    createUserApi, 
    loginApi, 
    getAccountApi, 
    getUsersApi,
    getProductsApi,     // export hàm mới
    getProductByIdApi   // export hàm mới
}