// Helper functions để làm việc với cookies
export function setCookie(
    name: string,
    value: string,
    options?: {
        days?: number;
        expires?: Date;
        maxAge?: number; // seconds
        path?: string;
    }
) {
    const path = options?.path ?? '/';

    const isProd =
        process.env.NODE_ENV === 'production';

    let expiresOrMaxAge = '';

    if (typeof options?.maxAge === 'number') {
        // prefer max-age when explicitly provided (seconds)
        expiresOrMaxAge = `max-age=${Math.floor(options!.maxAge)}`;
    } else if (options?.expires) {
        expiresOrMaxAge = `expires=${options.expires.toUTCString()}`;
    } else {
        const days = options?.days ?? 1;

        const date = new Date();

        date.setTime(
            date.getTime() +
            days * 24 * 60 * 60 * 1000
        );

        expiresOrMaxAge = `expires=${date.toUTCString()}`;
    }

    const cookie = [
        `${name}=${encodeURIComponent(value)}`,
        `path=${path}`,
        expiresOrMaxAge,
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