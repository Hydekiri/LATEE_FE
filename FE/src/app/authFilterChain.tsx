import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface LoadServerSideCurrentUserResponse {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
    userId: string;
    username: string;
    role: string;
}

export const checkIsLoggedIn = async (): Promise<Boolean> => {
    try {
        const currentUser = await getCurrentUser();

        if (currentUser && currentUser.accessToken && currentUser.refreshToken) {
            const now = new Date();
            const accessTokenExpiresAt = new Date(currentUser.accessTokenExpiresAt);
            const refreshTokenExpiresAt = new Date(currentUser.refreshTokenExpiresAt);
            if (accessTokenExpiresAt > now && refreshTokenExpiresAt > now) {
                return true;
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
    return false;
};

export const checkIsLoggedInAndRedirectToLogin = async (): Promise<void> => {
    const isLoggedIn = await checkIsLoggedIn();
    if (!isLoggedIn) {
        console.warn('[WARN]: User not logged in, redirecting to login page');
        redirect('/login');
    }
}

export const checkIsLoggedInAndRemembered = async (): Promise<Boolean> => {
    const isLoggedIn = await checkIsLoggedIn();
    const cookieStore = await cookies();
    const isRemembered = cookieStore.get('isRemembered')?.value === 'true';

    return isLoggedIn && isRemembered;
};


export const getCurrentUser = async (): Promise<LoadServerSideCurrentUserResponse | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const accessTokenExpiresAt = cookieStore.get('accessTokenExpiresAt')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const refreshTokenExpiresAt = cookieStore.get('refreshTokenExpiresAt')?.value;
    const userId = cookieStore.get('userId')?.value;
    const username = cookieStore.get('username')?.value;
    const role = cookieStore.get('role')?.value;

    if (accessToken && refreshToken && userId && username && role && accessTokenExpiresAt && refreshTokenExpiresAt) {
        return {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            userId,
            username,
            role
        };
    }

    return null;
};
