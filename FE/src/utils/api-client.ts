import axios from 'axios';
import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';

const BASE_URL = API_BASE_URL || 'http://localhost:5000';

export const ApiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
    },
});

ApiClient.interceptors.request.use(
    (config) => {
        const token = getCookie('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

ApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Có lỗi xảy ra từ Server';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

async function coreFetch<T>(
    endpoint: string,
    token: string | undefined,
    options: RequestInit = {}
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData: unknown = await response.json().catch(() => ({}));
        const message =
            (errorData as { message?: string })?.message ||
            `Request failed: ${response.status} ${response.statusText}`;
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = getCookie('accessToken') ?? undefined;
        return coreFetch<T>(endpoint, token, options);
    },

    get: <T>(url: string) => apiClient.fetch<T>(url, { method: 'GET' }),

    post: <T, B = unknown>(url: string, body: B) =>
        apiClient.fetch<T>(url, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    patch: <T, B = unknown>(url: string, body: B) =>
        apiClient.fetch<T>(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: <T>(url: string) => apiClient.fetch<T>(url, { method: 'DELETE' }),
};

export async function serverApiGet<T>(endpoint: string): Promise<T> {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    return coreFetch<T>(endpoint, token, { method: 'GET' });
}