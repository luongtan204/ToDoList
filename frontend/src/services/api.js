// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Đường dẫn gốc tới Backend Spring Boot của bạn
    baseURL: 'http://localhost:8080/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
