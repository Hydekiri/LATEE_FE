import { getCookie } from "@/src/utils/cookies";
import { env } from "@/src/config/env";
import { API_BASE_URL } from "@/src/config/env";
import axios from "axios";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL || "http://localhost:5000";
const TIMEOUT_MS = 15_000; // 15 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 800; // ms

const COMMON_HEADERS: Record<string, string> = {
    "Content-Type": "application/json",
    accept: "*/*",
};

export const AUTH_ENV = {
    CLIENT: "client",
    SERVER: "server",
} as const;

export type AuthEnv = (typeof AUTH_ENV)[keyof typeof AUTH_ENV];

export class ApiError extends Error {
    readonly statusCode: number;
    readonly errorCode: string | undefined;

    constructor(message: string, statusCode: number, errorCode?: string) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

export interface RequestOptions extends Omit<RequestInit, "signal"> {
    timeout?: number;
    retries?: number;
    signal?: AbortSignal;
    authEnv?: AuthEnv;
}

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export function buildQueryString(params: QueryParams): string {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== null && v !== undefined && v !== ""
    );
    if (entries.length === 0) return "";
    return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&");
}

async function resolveAccessToken(authEnv: AuthEnv): Promise<string | null> {
    try {
        if (authEnv === AUTH_ENV.SERVER) {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            return cookieStore.get("accessToken")?.value ?? null;
        }
        return getCookie("accessToken");
    } catch {
        return null;
    }
}

async function safeJsonParse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return {} as T;
    }
    const text = await response.text();
    try {
        return JSON.parse(text) as T;
    } catch {
        return {} as T;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function coreFetch<T>(
    endpoint: string,
    options: RequestOptions = {},
): Promise<T> {
    const {
        timeout = TIMEOUT_MS,
        retries = MAX_RETRIES,
        authEnv = AUTH_ENV.CLIENT,
        signal: externalSignal,
        ...restOptions
    } = options;

    const token = await resolveAccessToken(authEnv);

    const headers: HeadersInit = {
        ...COMMON_HEADERS,
        "x-auth-env": authEnv,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(restOptions.headers as Record<string, string> | undefined ?? {}),
    };

    let lastError: ApiError = new ApiError("Unknown error", 500);

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();

        const timeoutId = setTimeout(() => controller.abort(), timeout);
        if (externalSignal) {
            externalSignal.addEventListener("abort", () => controller.abort());
        }

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...restOptions,
                headers,
                signal: controller.signal,
                cache: "no-store",
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let message = `HTTP ${response.status}`;
                let errorCode: string | undefined;
                try {
                    const errorBody = await response.json() as { message?: string; errorCode?: string };
                    message = errorBody?.message ?? message;
                    errorCode = errorBody?.errorCode ?? undefined;
                } catch { /* error */ }

                if (response.status >= 400 && response.status < 500) {
                    throw new ApiError(message, response.status, errorCode);
                }

                lastError = new ApiError(message, response.status, errorCode);
                if (attempt < retries) {
                    await sleep(RETRY_DELAY * (attempt + 1));
                    continue;
                }
                throw lastError;
            }

            return await safeJsonParse<T>(response);
        } catch (err: unknown) {
            clearTimeout(timeoutId);

            if (err instanceof ApiError) {
                throw err;
            }

            if (err instanceof DOMException && err.name === "AbortError") {
                throw new ApiError("Request timed out", 408);
            }

            lastError = new ApiError(
                err instanceof Error ? err.message : "Network error",
                0
            );

            if (attempt < retries) {
                await sleep(RETRY_DELAY * (attempt + 1));
                continue;
            }
            throw lastError;
        }
    }

    throw lastError;
}

export const apiClient = {
    fetch<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return coreFetch<T>(endpoint, options);
    },

    get<T>(url: string, params?: QueryParams, options?: RequestOptions): Promise<T> {
        const qs = params ? buildQueryString(params) : "";
        return coreFetch<T>(`${url}${qs}`, { method: "GET", ...options });
    },

    post<T, B = unknown>(url: string, body: B, options?: RequestOptions): Promise<T> {
        return coreFetch<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
            ...options,
        });
    },

    put<T, B = unknown>(url: string, body: B, options?: RequestOptions): Promise<T> {
        return coreFetch<T>(url, {
            method: "PUT",
            body: JSON.stringify(body),
            ...options,
        });
    },

    patch<T, B = unknown>(url: string, body: B, options?: RequestOptions): Promise<T> {
        return coreFetch<T>(url, {
            method: "PATCH",
            body: JSON.stringify(body),
            ...options,
        });
    },

    delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return coreFetch<T>(url, { method: "DELETE", ...options });
    },
};


export const clientApi = {
    get: <T>(url: string, params?: QueryParams) => apiClient.get<T>(url, params, { authEnv: AUTH_ENV.CLIENT }),
    post: <T, B = unknown>(url: string, body: B) => apiClient.post<T, B>(url, body, { authEnv: AUTH_ENV.CLIENT }),
    put: <T, B = unknown>(url: string, body: B) => apiClient.put<T, B>(url, body, { authEnv: AUTH_ENV.CLIENT }),
    patch: <T, B = unknown>(url: string, body: B) => apiClient.patch<T, B>(url, body, { authEnv: AUTH_ENV.CLIENT }),
    delete: <T>(url: string) => apiClient.delete<T>(url, { authEnv: AUTH_ENV.CLIENT }),
};

export const serverApi = {
    get: <T>(url: string, params?: QueryParams) => apiClient.get<T>(url, params, { authEnv: AUTH_ENV.SERVER }),
    post: <T, B = unknown>(url: string, body: B) => apiClient.post<T, B>(url, body, { authEnv: AUTH_ENV.SERVER }),
    put: <T, B = unknown>(url: string, body: B) => apiClient.put<T, B>(url, body, { authEnv: AUTH_ENV.SERVER }),
    patch: <T, B = unknown>(url: string, body: B) => apiClient.patch<T, B>(url, body, { authEnv: AUTH_ENV.SERVER }),
    delete: <T>(url: string) => apiClient.delete<T>(url, { authEnv: AUTH_ENV.SERVER }),
};


export const ApiClient2 = axios.create({
    baseURL: API_BASE_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
        accept: "*/*",
    },
});

ApiClient2.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

ApiClient2.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = (error.response?.data as { message?: string })?.message ?? "Server error";
        console.error("API Error:", message);
        return Promise.reject(error);
    }
);

export { ApiClient2 as ApiClient };

export default apiClient;