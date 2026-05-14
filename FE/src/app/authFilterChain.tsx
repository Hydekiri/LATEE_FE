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
    avatarUrl: string;
}

export const checkIsLoggedIn = async (): Promise<boolean> => {
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

export const checkIsLoggedInAndRemembered = async (): Promise<boolean> => {
    const isLoggedIn = await checkIsLoggedIn();
    const cookieStore = await cookies();
    const isRemembered = cookieStore.get('isRemembered')?.value === 'true';

    return isLoggedIn && isRemembered;
};

export const checkIsLearnerLoggedIn = async (): Promise<boolean> => {
    try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.accessToken && currentUser.refreshToken && currentUser.role.toLowerCase() === 'learner') {
            const now = new Date();
            const accessTokenExpiresAt = new Date(currentUser.accessTokenExpiresAt);
            const refreshTokenExpiresAt = new Date(currentUser.refreshTokenExpiresAt);
            if (accessTokenExpiresAt > now && refreshTokenExpiresAt > now) {
                return true;
            }
        }
    }
    catch (error) {
        console.error('Error checking learner login status:', error);
    }
    return false;
};

export const checkIsExpertLoggedIn = async (): Promise<boolean> => {
    try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.accessToken && currentUser.refreshToken && currentUser.role.toLowerCase() === 'expert') {
            const now = new Date();
            const accessTokenExpiresAt = new Date(currentUser.accessTokenExpiresAt);
            const refreshTokenExpiresAt = new Date(currentUser.refreshTokenExpiresAt);
            if (accessTokenExpiresAt > now && refreshTokenExpiresAt > now) {
                return true;
            }
        }
    }
    catch (error) {
        console.error('Error checking expert login status:', error);
    }
    return false;
};

export const checkIsAdminLoggedIn = async (): Promise<boolean> => {
    try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.accessToken && currentUser.refreshToken && currentUser.role.toLowerCase() === 'admin') {
            const now = new Date();
            const accessTokenExpiresAt = new Date(currentUser.accessTokenExpiresAt);
            const refreshTokenExpiresAt = new Date(currentUser.refreshTokenExpiresAt);
            if (accessTokenExpiresAt > now && refreshTokenExpiresAt > now) {
                return true;
            }
        }
    }
    catch (error) {
        console.error('Error checking admin login status:', error);
    }
    return false;
}


export const getCurrentUser = async (): Promise<LoadServerSideCurrentUserResponse | null> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const accessTokenExpiresAt = cookieStore.get('accessTokenExpiresAt')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const refreshTokenExpiresAt = cookieStore.get('refreshTokenExpiresAt')?.value;
    const userId = cookieStore.get('userId')?.value;
    const username = cookieStore.get('username')?.value;
    const role = cookieStore.get('role')?.value;
    const rawAvatarUrl = cookieStore.get('avatarUrl')?.value;
    let avatarUrl = rawAvatarUrl;

    if (avatarUrl === 'undefined' || avatarUrl === 'null') {
        avatarUrl = '';
    }

    if (accessToken && refreshToken && userId && username && role && accessTokenExpiresAt && refreshTokenExpiresAt) {
        return {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
            userId,
            username,
            role,
            avatarUrl: avatarUrl || '',
        };
    }

    return null;
};
