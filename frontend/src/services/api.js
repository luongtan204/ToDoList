// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Lấy đường dẫn API từ biến môi trường, nếu không có thì dùng mặc định
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
