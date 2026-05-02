// src/utils/api-client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/src/config/env';

export const ApiClient = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:5000', 
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
    },
});


ApiClient.interceptors.request.use(
    (config) => {
        //  JWT Token trong cookie/localStorage:
        // const token = getCookie('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Có lỗi xảy ra từ Server';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);