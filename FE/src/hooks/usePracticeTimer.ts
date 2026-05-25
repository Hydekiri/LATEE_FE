'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePracticeTimerOptions {
    initialSeconds?: number;
    autoStart?: boolean;
    storageKey?: string;
}

export function usePracticeTimer({
    initialSeconds = 0,
    autoStart = true,
    storageKey,
}: UsePracticeTimerOptions = {}) {
    const getInitial = (): number => {
        if (storageKey && typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(storageKey);
            if (stored) return parseInt(stored, 10);
        }
        return initialSeconds;
    };

    const [elapsed, setElapsed] = useState<number>(getInitial);
    const [running, setRunning] = useState<boolean>(autoStart);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setElapsed((prev) => {
                const next = prev + 1;
                if (storageKey) sessionStorage.setItem(storageKey, String(next));
                return next;
            });
        }, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, storageKey]);

    const pause = useCallback(() => setRunning(false), []);
    const resume = useCallback(() => setRunning(true), []);

    const reset = useCallback(() => {
        setElapsed(0);
        if (storageKey && typeof window !== 'undefined') {
            sessionStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    const stop = useCallback((): number => {
        setRunning(false);
        return elapsed;
    }, [elapsed]);

    const formatted: string = (() => {
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    })();

    return { elapsed, formatted, running, pause, resume, reset, stop };
}