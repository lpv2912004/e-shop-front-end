import axios from 'axios';

// Tạo một instance của axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Xử lý lỗi toàn cục
axiosInstance.interceptors.response.use(
    response => response, // Trả về response nếu thành công
    error => {
        // Không in lỗi ra console ở đây
        return Promise.reject(error); // Chỉ trả về lỗi mà không log
    }
);

export default axiosInstance;
