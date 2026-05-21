'use client';

import { useEffect, useRef } from 'react';

interface UseExitProtectionOptions {
    readonly enabled: boolean;
    readonly onExitAttempt?: () => void;
}

export function useExitProtection({
    enabled,
    onExitAttempt,
}: UseExitProtectionOptions): void {
    const onExitAttemptRef = useRef(onExitAttempt);
    const enabledRef = useRef(enabled);

    useEffect(() => {
        onExitAttemptRef.current = onExitAttempt;
        enabledRef.current = enabled;
    }, [onExitAttempt, enabled]);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            if (!enabledRef.current) return;

            window.history.pushState(null, '', window.location.href);

            onExitAttemptRef.current?.();
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (enabledRef.current) {
                e.preventDefault();
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); 
}