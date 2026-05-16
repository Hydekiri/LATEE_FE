// Helper functions để làm việc với cookies
export function setCookie(
    name: string,
    value: string,
    options?: {
        days?: number;
        path?: string;
    }
) {
    const days = options?.days ?? 1;
    const path = options?.path ?? '/';

    const maxAge = days * 24 * 60 * 60;
    const isProd = process.env.NODE_ENV === 'production';

    const cookie = [
        `${name}=${encodeURIComponent(value)}`,
        `path=${path}`,
        `max-age=${maxAge}`,
        isProd ? 'Secure' : '',
        'SameSite=Lax'
    ]
        .filter(Boolean)
        .join('; ');

    document.cookie = cookie;
}

export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    return null;
}

export function deleteCookie(name: string) {
    const isProd = process.env.NODE_ENV === 'production';

    document.cookie = [
        `${name}=`,
        'path=/',
        'max-age=0',
        isProd ? 'Secure' : '',
        'SameSite=Lax'
    ]
        .filter(Boolean)
        .join('; ');
}

export function getLearnerId(): string {
    const userId = getCookie('userId');
    return userId || "USR001";
}