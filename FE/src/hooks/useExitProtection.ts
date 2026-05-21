'use client';

import { useEffect, useRef } from 'react';

export interface UseExitProtectionOptions {
    readonly enabled: boolean;
    readonly message?: string;
    readonly onBeforeExit?: () => Promise<void> | void;
}

export function useExitProtection({
    enabled,
    message = 'Are you sure you want to stop this clinical practice session?',
    onBeforeExit,
}: UseExitProtectionOptions): void {
    const onBeforeExitRef = useRef(onBeforeExit);

    useEffect(() => {
        onBeforeExitRef.current = onBeforeExit;
    }, [onBeforeExit]);

    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent): string => {
            e.preventDefault();
            return message;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [enabled, message]);

    useEffect(() => {
        if (!enabled) return;

        const handlePopState = (): void => {
            window.history.pushState(null, '', window.location.href);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [enabled]);
}