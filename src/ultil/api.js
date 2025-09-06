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

const getUserApi = () => {
    const URL_API = "/v1/api/user"
    return axios.get(URL_API);
}

//không sử dụng default vì file này ta sẽ xuất ra nhiều function khác và nhiều api khác
export {
    createUserApi, loginApi, getUserApi
}