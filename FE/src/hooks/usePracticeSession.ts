'use client';
import { useState, useEffect, useCallback } from 'react';
import {
    practiceSessionStore,
    PracticeSessionState,
    PracticePhase,
} from '@/src/stores/practiceSessionStore';
import { getCookie } from '@/src/utils/cookies';

export function usePracticeSession(patientId: string) {
    const [state, setState] = useState<PracticeSessionState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const loadSession = async () => {
            await Promise.resolve();
            if (!isMounted) return;

            const stored = practiceSessionStore.load();
            if (
                stored &&
                stored.patientId === patientId &&
                stored.phase !== 'submitted' &&
                stored.phase !== 'evaluated'
            ) {
                setState(stored);
            }
            setLoading(false);
        };

        void loadSession();

        return () => {
            isMounted = false;
        };
    }, [patientId]);

    const updatePhase = useCallback(
        (phase: PracticePhase, extra?: Partial<PracticeSessionState>) => {
            setState((prev) => {
                if (!prev) return prev;
                const next: PracticeSessionState = { ...prev, phase, ...extra };
                practiceSessionStore.save(next);
                return next;
            });
        },
        []
    );

    const initSession = useCallback(
        (sessionId: string, moduleId: string): PracticeSessionState => {
            const learnerId = getCookie('userId') || 'USR001';
            const next: PracticeSessionState = {
                sessionId,
                patientId,
                learnerId,
                moduleId,
                phase: 'vp_chat',
                vpStartedAt: Date.now(),
                vpEndedAt: null,
                reasoningStartedAt: null,
                reasoningEndedAt: null,
                evaluationId: null,
            };
            practiceSessionStore.save(next);
            setState(next);
            return next;
        },
        [patientId]
    );

    const clearSession = useCallback(() => {
        practiceSessionStore.clear();
        setState(null);
    }, []);

    return { state, loading, initSession, updatePhase, clearSession };
}