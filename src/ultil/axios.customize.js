import axios from "axios";




// Set config defaults when creating the instance
//Đây là nơi chúng ta sẽ truy cập để chúng ta sửa, chứ ta không cần phải vào từng api
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

// Alter defaults after instance has been created

//interceptors

// Add a request interceptor
//Đây là nơi khi React request cho NodeJS thì nó sẽ chạy vào đây trước, sau khi gọi API thành công rồi, trước khi ta nhận lại được kết quả từ bên phía React, tức là nơi ta gọi, thì nó sẽ chạy về phía phản hồi bên dưới
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;//Gán API vào phần Header, chỉ cần sửa ở đây, không cần sửa tất cả các api khác

    
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


//Đây là phần phản hồi về
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response && response.data) return response.data;//Mấu chốt là để ta lấy đúng giữ liệu data mà thôi, các giữ liệu khác không sử dụng đến thì không cần
    return response; //Ta trả về response trong trường hợp nó không trả ra data
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(">>> check error: ", error)
    if(error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
  });



//xuất ra 1 instance và đã có baseURL
export default instance;