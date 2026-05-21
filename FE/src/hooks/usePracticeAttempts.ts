'use client';

import { useState, useEffect, useCallback } from 'react';
import { evaluationService } from '@/src/services/evaluation-service';
import {
    PracticeHistoryResponse,
    PracticeHistoryItem,
} from '@/src/types/evaluation';
import { getLearnerId } from '@/src/utils/cookies';

export interface UsePracticeAttemptsReturn {
    readonly history: PracticeHistoryResponse | null;
    readonly selectedAttempt: PracticeHistoryItem | null;
    readonly selectedIndex: number;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly selectAttempt: (index: number) => void;
    readonly reload: () => void;
}

export function usePracticeAttempts(patientId: string): UsePracticeAttemptsReturn {
    const learnerId = getLearnerId();
    const [history, setHistory] = useState<PracticeHistoryResponse | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);

    useEffect(() => {
        if (!patientId || !learnerId) return;
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await evaluationService.getPracticeHistory(learnerId, patientId);
                if (!cancelled) {
                    setHistory(result);
                    if (result.items.length > 0) {
                        setSelectedIndex(result.items.length - 1);
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : 'Failed to load practice history.'
                    );
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [patientId, learnerId, reloadTrigger]);

    const selectAttempt = useCallback(
        (index: number) => {
            if (history && index >= 0 && index < history.items.length) {
                setSelectedIndex(index);
            }
        },
        [history]
    );

    const reload = useCallback(() => {
        setReloadTrigger((n) => n + 1);
    }, []);

    const selectedAttempt = history?.items[selectedIndex] ?? null;

    return {
        history,
        selectedAttempt,
        selectedIndex,
        isLoading,
        error,
        selectAttempt,
        reload,
    };
}