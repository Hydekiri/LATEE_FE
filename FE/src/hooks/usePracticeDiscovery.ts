'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { discoveryService } from '@/src/services/discovery-service';
import {
    DiscoveryPatientItem,
    DiscoveryUIFilter,
    DiscoverySortBy,
    DEFAULT_DISCOVERY_UI_FILTER,
    DiscoveryLoadState,
    LearnerLastDiscovery,
    FetchCasesFormState,
} from '@/src/types/discovery';
import { getLearnerId } from '@/src/utils/cookies';

const PAGE_SIZE = 9;
const LOAD_ALL_PAGE_SIZE = 200;


function applyClientSort(
    items: DiscoveryPatientItem[],
    sortBy: DiscoverySortBy
): DiscoveryPatientItem[] {
    const sorted = [...items];
    switch (sortBy) {
        case 'newest':
            return sorted.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        case 'oldest':
            return sorted.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
        case 'level_asc':
            return sorted.sort((a, b) => a.level.localeCompare(b.level));
        case 'level_desc':
            return sorted.sort((a, b) => b.level.localeCompare(a.level));
        case 'expert_asc':
            return sorted.sort((a, b) =>
                (a.experts[0]?.name ?? '').localeCompare(b.experts[0]?.name ?? '')
            );
        case 'expert_desc':
            return sorted.sort((a, b) =>
                (b.experts[0]?.name ?? '').localeCompare(a.experts[0]?.name ?? '')
            );
        default:
            return sorted;
    }
}

function applyClientFilters(
    items: readonly DiscoveryPatientItem[],
    filter: DiscoveryUIFilter
): readonly DiscoveryPatientItem[] {
    let result = [...items];

    const q = filter.search.trim().toLowerCase();
    if (q) {
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.chiefConcern.toLowerCase().includes(q) ||
                (p.symptom ?? '').toLowerCase().includes(q) ||
                (p.occupation ?? '').toLowerCase().includes(q) ||
                p.patientId.toLowerCase().includes(q)
        );
    }

    if (filter.level) {
        result = result.filter(
            (p) => p.level.toLowerCase() === filter.level.toLowerCase()
        );
    }

    if (filter.occupation) {
        result = result.filter(
            (p) =>
                p.occupation != null &&
                p.occupation.toLowerCase().includes(filter.occupation.toLowerCase())
        );
    }

    return applyClientSort(result, filter.sortBy);
}

export interface UsePracticeDiscoveryReturn {
    readonly loadState: DiscoveryLoadState;
    readonly fetchState: 'idle' | 'fetching' | 'error';
    readonly allPatients: readonly DiscoveryPatientItem[];
    readonly patients: readonly DiscoveryPatientItem[];
    readonly availableOccupations: readonly string[];
    readonly availableLevels: readonly string[];
    readonly totalFiltered: number;
    readonly totalPages: number;
    readonly currentPage: number;
    readonly uiFilter: DiscoveryUIFilter;
    readonly error: string | null;
    readonly fetchError: string | null;
    readonly hasDiscovery: boolean;
    readonly lastDiscovery: LearnerLastDiscovery | null;
    readonly setUIFilter: <K extends keyof DiscoveryUIFilter>(
        key: K,
        value: DiscoveryUIFilter[K]
    ) => void;
    readonly setPage: (page: number) => void;
    readonly resetFilters: () => void;
    readonly fetchNewCases: (form: FetchCasesFormState) => Promise<void>;
    readonly retry: () => void;
}


export function usePracticeDiscovery(): UsePracticeDiscoveryReturn {
    const learnerId = getLearnerId();
    const isMounted = useRef(true);

    const [loadState, setLoadState] = useState<DiscoveryLoadState>('idle');
    const [fetchState, setFetchState] = useState<'idle' | 'fetching' | 'error'>('idle');
    const [allPatients, setAllPatients] = useState<readonly DiscoveryPatientItem[]>([]);
    const [uiFilter, setUIFilterState] = useState<DiscoveryUIFilter>(DEFAULT_DISCOVERY_UI_FILTER);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [hasDiscovery, setHasDiscovery] = useState(false);
    const [lastDiscovery, setLastDiscovery] = useState<LearnerLastDiscovery | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const loadPool = useCallback(async () => {
        if (!isMounted.current) return;
        setLoadState('loading');
        setError(null);
        try {
            const items = await discoveryService.getDiscoveryPool(learnerId, 'newest');
            if (!isMounted.current) return;
            setAllPatients(items);
            setLoadState(items.length === 0 ? 'empty' : 'ready');
        } catch (err) {
            if (!isMounted.current) return;
            setError(err instanceof Error ? err.message : 'Failed to load practice cases.');
            setLoadState('error');
        }
    }, [learnerId]);

    useEffect(() => {
        isMounted.current = true;
        let cancelled = false;

        const bootstrap = async () => {
            if (cancelled) return;
            setLoadState('checking');

            const discovery = await discoveryService.getLearnerLastDiscovery(learnerId);
            if (cancelled || !isMounted.current) return;

            if (!discovery?.filterJson) {
                setHasDiscovery(false);
                setLastDiscovery(null);
                setLoadState('empty');
                return;
            }

            setHasDiscovery(true);
            setLastDiscovery(discovery);
            await loadPool();
        };

        void bootstrap();
        return () => {
            cancelled = true;
            isMounted.current = false;
        };
    }, [learnerId, retryCount, loadPool]);

    const filtered = useMemo(
        () => applyClientFilters(allPatients, uiFilter),
        [allPatients, uiFilter]
    );

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

    const patients = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, currentPage]);

    const availableOccupations = useMemo(() => {
        const set = new Set<string>();
        for (const p of allPatients) {
            if (p.occupation) set.add(p.occupation);
        }
        return Array.from(set).sort();
    }, [allPatients]);

    const availableLevels = useMemo(() => {
        const set = new Set<string>();
        for (const p of allPatients) {
            if (p.level) set.add(p.level);
        }
        return Array.from(set).sort();
    }, [allPatients]);

    const setUIFilter = useCallback(
        <K extends keyof DiscoveryUIFilter>(key: K, value: DiscoveryUIFilter[K]) => {
            setUIFilterState((prev) => ({ ...prev, [key]: value }));
            setCurrentPage(1);
        },
        []
    );

    const setPage = useCallback((page: number) => setCurrentPage(page), []);

    const resetFilters = useCallback(() => {
        setUIFilterState(DEFAULT_DISCOVERY_UI_FILTER);
        setCurrentPage(1);
    }, []);

    const fetchNewCases = useCallback(
        async (form: FetchCasesFormState) => {
            if (!isMounted.current) return;
            setFetchState('fetching');
            setFetchError(null);
            try {
                await discoveryService.fetchNewCasesFromDB({
                    learnerId,
                    level: form.level || null,
                    gender: form.gender || null,
                    fetchCount: form.fetchCount,
                });

                await discoveryService.saveLearnerLastDiscovery({
                    learnerId,
                    filterJson: JSON.stringify({
                        level: form.level,
                        gender: form.gender,
                        fetchCount: form.fetchCount,
                    }),
                    lastAccessed: new Date().toISOString(),
                });

                if (!isMounted.current) return;
                setHasDiscovery(true);
                setFetchState('idle');

                await loadPool();
            } catch (err) {
                if (!isMounted.current) return;
                setFetchError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch new cases. Please try again.'
                );
                setFetchState('error');
            }
        },
        [learnerId, loadPool]
    );

    const retry = useCallback(() => setRetryCount((n) => n + 1), []);

    return {
        loadState,
        fetchState,
        allPatients,
        patients,
        availableOccupations,
        availableLevels,
        totalFiltered,
        totalPages,
        currentPage,
        uiFilter,
        error,
        fetchError,
        hasDiscovery,
        lastDiscovery,
        setUIFilter,
        setPage,
        resetFilters,
        fetchNewCases,
        retry,
    };
}