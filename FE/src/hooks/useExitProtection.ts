'use client';

import { useEffect, useRef } from 'react';

interface UseExitProtectionOptions {
    readonly enabled: boolean;
    readonly onExitAttempt?: () => void;
    readonly onHardExit?: () => void;
}

export function useExitProtection({
    enabled,
    onExitAttempt,
    onHardExit,
}: UseExitProtectionOptions): void {
    const onExitAttemptRef = useRef(onExitAttempt);
    const onHardExitRef = useRef(onHardExit);
    const enabledRef = useRef(enabled);

    useEffect(() => {
        onExitAttemptRef.current = onExitAttempt;
        onHardExitRef.current = onHardExit;
        enabledRef.current = enabled;
    }, [onExitAttempt, onHardExit, enabled]);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            if (!enabledRef.current) return;

            window.history.pushState(null, '', window.location.href);

            onExitAttemptRef.current?.();
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (enabledRef.current) {
                onHardExitRef.current?.();
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handlePageHide = () => {
            if (enabledRef.current) {
                onHardExitRef.current?.();
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pagehide', handlePageHide);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, []);
}