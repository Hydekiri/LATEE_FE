// src/utils/api-client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/src/config/env';
import { env } from "@/src/config/env";
import { getCookie } from "@/src/utils/cookies";

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

export const apiClient = {
    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = getCookie('accessToken');

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData: unknown = await response.json().catch(() => ({}));
            const message = (errorData as { message?: string })?.message || "Internal Server Error";
            throw new Error(message);
        }

        return response.json() as Promise<T>;
    },

    get: <T>(url: string) => apiClient.fetch<T>(url, { method: 'GET' }),

    post: <T, B = unknown>(url: string, body: B) =>
        apiClient.fetch<T>(url, {
            method: 'POST',
            body: JSON.stringify(body)
        }),
};