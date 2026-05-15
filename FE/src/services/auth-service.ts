import { API_BASE_URL } from '@/src/config/env';
import { deleteCookie, getCookie, setCookie } from '@/src/utils/cookies';

export interface LoginResponse {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    tokenType: string;
    userId: string;
    username: string;
    role: string;
    avatarUrl: string;
}

export const loginApi = async (email: string, password: string, accessDays: number, refreshDays: number) => {
    try {
        const data = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!data.ok) {
            //throw new Error('Login failed');
            console.error('[WARN] Login failed with status:', data.status);
        }

        const loginResponse = await data.json() as LoginResponse;

        setCookie('isLoggedIn', 'true', { days: refreshDays });

        // Debug: log server-provided expiry and parsed ISO
        try {
            const parsed = new Date(loginResponse.accessTokenExpiresAt);
            console.log('[AUTH] server accessTokenExpiresAt:', loginResponse.accessTokenExpiresAt, 'parsed:', parsed.toISOString());

            const msLeft = parsed.getTime() - Date.now();
            if (msLeft > 0) {
                // prefer max-age to avoid client/server parsing ambiguity
                setCookie('accessToken', loginResponse.accessToken, { maxAge: Math.floor(msLeft / 1000) });
                setCookie('accessTokenExpiresAt', loginResponse.accessTokenExpiresAt, { maxAge: Math.floor(msLeft / 1000) });
            } else {
                // fallback: set by explicit expires date
                setCookie('accessToken', loginResponse.accessToken, { expires: new Date(loginResponse.accessTokenExpiresAt) });
                setCookie('accessTokenExpiresAt', loginResponse.accessTokenExpiresAt, { expires: new Date(loginResponse.accessTokenExpiresAt) });
            }
        } catch (err) {
            console.warn('[AUTH] Failed to parse accessTokenExpiresAt, setting cookie with days fallback', err);
            setCookie('accessToken', loginResponse.accessToken, { days: refreshDays });
            setCookie('accessTokenExpiresAt', loginResponse.accessTokenExpiresAt, { days: refreshDays });
        }
        setCookie('refreshToken', loginResponse.refreshToken, { days: refreshDays });
        setCookie('refreshTokenExpiresAt', loginResponse.refreshTokenExpiresAt, { days: refreshDays });
        setCookie('userEmail', email, { days: refreshDays });
        setCookie('userId', loginResponse.userId, { days: refreshDays });
        setCookie('username', loginResponse.username, { days: refreshDays });
        setCookie('role', loginResponse.role, { days: refreshDays });
        setCookie('avatarUrl', loginResponse.avatarUrl, { days: refreshDays });

        return loginResponse;
    } catch (error) {
        console.error('[WARN]Login failed:', error);
        throw error;
    }
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


        console.log("[LOGOUT] Logging out...");
        deleteCookie("isLoggedIn");
        deleteCookie("userEmail");
        deleteCookie('accessToken');
        deleteCookie('accessTokenExpiresAt');
        deleteCookie('refreshToken');
        deleteCookie('refreshTokenExpiresAt');
        deleteCookie('userId');
        deleteCookie('username');
        deleteCookie('role');
        deleteCookie('avatarUrl');
        deleteCookie('isRemembered');
    } catch (error) {
        console.error('[WARN]: Logout failed', error);
    }
};