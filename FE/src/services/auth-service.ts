import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';

export interface LoginResponse {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    tokenType: string;
    userId: string;
    username: string;
    role: string;
}

export const loginApi = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!res.ok) {
        throw new Error('Login failed');
    }

    return res.json() as Promise<LoginResponse>;
};

export const logoutApi = async () => {
    try {
        const accessToken = getCookie('accessToken');
        const refreshToken = getCookie('refreshToken');

        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
            },
            body: JSON.stringify({ refreshToken })
        });
    } catch (error) {
        console.error('[WARN]: Logout failed', error);
    }
};