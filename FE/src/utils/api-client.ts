// src/utils/api-client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/src/config/env';
import { env } from "@/src/config/env";
import { getCookie } from "@/src/utils/cookies";

export const ApiClient2 = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
    },
});


ApiClient2.interceptors.request.use(
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

ApiClient2.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Có lỗi xảy ra từ Server';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);



const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL || "http://localhost:5000";

const COMMON_HEADERS = {
    "Content-Type": "application/json",
    accept: "*/*",
};

export const AUTH_ENV = {
    CLIENT: "client",
    SERVER: "server",
} as const;

export type AuthEnv = (typeof AUTH_ENV)[keyof typeof AUTH_ENV];

const getAccessToken = async (authEnv: AuthEnv): Promise<string | null> => {
    try {
        if (authEnv === AUTH_ENV.SERVER) {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            return cookieStore.get("accessToken")?.value || null;
        }
        return getCookie("accessToken"); 
    } catch (error) {
        console.error("[TOKEN ERROR]", error);
        return null;
    }
};

const coreFetch = async <T>(
    endpoint: string,
    options: RequestInit = {},
    authEnv: AuthEnv = AUTH_ENV.CLIENT
): Promise<T> => {
    const token = await getAccessToken(authEnv);

    const headers: HeadersInit = {
        ...COMMON_HEADERS,
        "x-auth-env": authEnv,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
            cache: "no-store",
        });

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData?.message || errorData?.title || errorMessage;
            } catch { }

            console.error(`[API ERROR] ${options.method || "GET"} ${endpoint}`, {
                status: response.status,
                authEnv,
                errorMessage,
            });

            throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return {} as T;
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error("[FETCH ERROR]", error);
        throw error;
    }
};

export const apiClient = {
    fetch: coreFetch,

    get: <T>(url: string, authEnv: AuthEnv = AUTH_ENV.CLIENT) =>
        coreFetch<T>(url, { method: "GET" }, authEnv),

    post: <T, B = unknown>(url: string, body: B, authEnv: AuthEnv = AUTH_ENV.CLIENT) =>
        coreFetch<T>(url, { method: "POST", body: JSON.stringify(body) }, authEnv),

    put: <T, B = unknown>(url: string, body: B, authEnv: AuthEnv = AUTH_ENV.CLIENT) =>
        coreFetch<T>(url, { method: "PUT", body: JSON.stringify(body) }, authEnv),

    patch: <T, B = unknown>(url: string, body: B, authEnv: AuthEnv = AUTH_ENV.CLIENT) =>
        coreFetch<T>(url, { method: "PATCH", body: JSON.stringify(body) }, authEnv),

    delete: <T>(url: string, authEnv: AuthEnv = AUTH_ENV.CLIENT) =>
        coreFetch<T>(url, { method: "DELETE" }, authEnv),
};

export const ApiClient = apiClient;

export const clientApi = {
    fetch: <T>(endpoint: string, options?: RequestInit) => apiClient.fetch<T>(endpoint, options, AUTH_ENV.CLIENT),
    get: <T>(url: string) => apiClient.get<T>(url, AUTH_ENV.CLIENT),
    post: <T, B = unknown>(url: string, body: B) => apiClient.post<T, B>(url, body, AUTH_ENV.CLIENT),
    put: <T, B = unknown>(url: string, body: B) => apiClient.put<T, B>(url, body, AUTH_ENV.CLIENT),
    patch: <T, B = unknown>(url: string, body: B) => apiClient.patch<T, B>(url, body, AUTH_ENV.CLIENT),
    delete: <T>(url: string) => apiClient.delete<T>(url, AUTH_ENV.CLIENT),
};

export const serverApi = {
    fetch: <T>(endpoint: string, options?: RequestInit) => apiClient.fetch<T>(endpoint, options, AUTH_ENV.SERVER),
    get: <T>(url: string) => apiClient.get<T>(url, AUTH_ENV.SERVER),
    post: <T, B = unknown>(url: string, body: B) => apiClient.post<T, B>(url, body, AUTH_ENV.SERVER),
    put: <T, B = unknown>(url: string, body: B) => apiClient.put<T, B>(url, body, AUTH_ENV.SERVER),
    patch: <T, B = unknown>(url: string, body: B) => apiClient.patch<T, B>(url, body, AUTH_ENV.SERVER),
    delete: <T>(url: string) => apiClient.delete<T>(url, AUTH_ENV.SERVER),
};