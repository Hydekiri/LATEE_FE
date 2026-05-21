'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { discoveryService } from '@/src/services/discovery-service';
import {
    DiscoveryFilterState,
    DiscoveryPatientItem,
    DiscoveryFilters,
    DEFAULT_DISCOVERY_FILTER,
    DiscoveryLoadState,
    DiscoverySortBy,
    LearnerLastDiscovery,
} from '@/src/types/discovery';
import { getLearnerId } from '@/src/utils/cookies';

export interface UsePracticeDiscoveryReturn {
    readonly loadState: DiscoveryLoadState;
    readonly patients: readonly DiscoveryPatientItem[];
    readonly availableFilters: DiscoveryFilters | null;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly currentPage: number;
    readonly filters: DiscoveryFilterState;
    readonly error: string | null;
    readonly hasDiscovery: boolean;
    readonly lastDiscovery: LearnerLastDiscovery | null;
    readonly setFilter: <K extends keyof DiscoveryFilterState>(key: K, value: DiscoveryFilterState[K]) => void;
    readonly applyFilters: () => Promise<void>;
    readonly resetFilters: () => Promise<void>;
    readonly goToPage: (page: number) => Promise<void>;
    readonly startDiscovery: (filters: DiscoveryFilterState) => Promise<void>;
    readonly retry: () => void;
}

function parseFilterJson(filterJson: string | null): DiscoveryFilterState {
    if (!filterJson) return DEFAULT_DISCOVERY_FILTER;
    try {
        const parsed = JSON.parse(filterJson) as Partial<DiscoveryFilterState>;
        return {
            level: parsed.level ?? '',
            gender: parsed.gender ?? '',
            sortBy: (parsed.sortBy as DiscoverySortBy) ?? 'newest',
            page: 1,
            pageSize: 9, 
            fetchCount: parsed.fetchCount && parsed.fetchCount >= 1 && parsed.fetchCount <= 20 
                ? parsed.fetchCount 
                : 5,
        };
    } catch {
        return DEFAULT_DISCOVERY_FILTER;
    }
}

export function usePracticeDiscovery(): UsePracticeDiscoveryReturn {
    const learnerId = getLearnerId();
    const isMounted = useRef(true);

    const [loadState, setLoadState] = useState<DiscoveryLoadState>('idle');
    const [patients, setPatients] = useState<readonly DiscoveryPatientItem[]>([]);
    const [availableFilters, setAvailableFilters] = useState<DiscoveryFilters | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFiltersState] = useState<DiscoveryFilterState>(DEFAULT_DISCOVERY_FILTER);
    const [error, setError] = useState<string | null>(null);
    const [hasDiscovery, setHasDiscovery] = useState(false);
    const [lastDiscovery, setLastDiscovery] = useState<LearnerLastDiscovery | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchDiscoveryList = useCallback(
        async (activeFilters: DiscoveryFilterState) => {
            if (!isMounted.current) return;
            setLoadState('loading');
            setError(null);
            try {
                const result = await discoveryService.getDiscoveryList(learnerId, activeFilters);
                if (!isMounted.current) return;
                setPatients(result.items);
                setTotalItems(result.total);
                setTotalPages(result.total === 0 ? 1 : Math.ceil(result.total / activeFilters.pageSize));
                setAvailableFilters(result.filters ?? null);
                setLoadState(result.items.length === 0 ? 'empty' : 'ready');
            } catch (err) {
                if (!isMounted.current) return;
                setError(err instanceof Error ? err.message : 'Failed to load practice cases.');
                setLoadState('error');
            }
        },
        [learnerId]
    );

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
            const restoredFilters = parseFilterJson(discovery.filterJson);
            setFiltersState(restoredFilters);
            await fetchDiscoveryList(restoredFilters);
        };

        void bootstrap();

        return () => {
            cancelled = true;
            isMounted.current = false;
        };
    }, [learnerId, retryCount, fetchDiscoveryList]);

    const setFilter = useCallback(
        <K extends keyof DiscoveryFilterState>(key: K, value: DiscoveryFilterState[K]) => {
            setFiltersState((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const applyFilters = useCallback(async () => {
        const next: DiscoveryFilterState = { ...filters, page: 1, pageSize: 9 };
        setFiltersState(next);
        await fetchDiscoveryList(next);
    }, [filters, fetchDiscoveryList]);

    const startDiscovery = useCallback(
        async (newFilters: DiscoveryFilterState) => {
            setLoadState('loading');
            setError(null);
            try {
                await discoveryService.fetchNewCasesFromDB({
                    learnerId,
                    level: newFilters.level || null,
                    gender: newFilters.gender || null,
                    fetchCount: newFilters.fetchCount
                });

                await discoveryService.saveLearnerLastDiscovery({
                    learnerId,
                    filterJson: JSON.stringify({
                        level: newFilters.level,
                        gender: newFilters.gender,
                        sortBy: newFilters.sortBy,
                        fetchCount: newFilters.fetchCount
                    }),
                    lastAccessed: new Date().toISOString(),
                });

                setHasDiscovery(true);
                const nextState = { ...newFilters, page: 1, pageSize: 9 };
                setFiltersState(nextState);

                await fetchDiscoveryList(nextState);
            } catch (err) {
                if (isMounted.current) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch new cases from system database.');
                    setLoadState('error');
                }
            }
        },
        [learnerId, fetchDiscoveryList]
    );

    const resetFilters = useCallback(async () => {
        const next = { ...DEFAULT_DISCOVERY_FILTER };
        setFiltersState(next);
        await fetchDiscoveryList(next);
    }, [fetchDiscoveryList]);

    const goToPage = useCallback(
        async (page: number) => {
            const next: DiscoveryFilterState = { ...filters, page };
            setFiltersState(next);
            await fetchDiscoveryList(next);
        },
        [filters, fetchDiscoveryList]
    );

    const retry = useCallback(() => {
        setRetryCount((n) => n + 1);
    }, []);

    return {
        loadState,
        patients,
        availableFilters,
        totalItems,
        totalPages,
        currentPage: filters.page,
        filters,
        error,
        hasDiscovery,
        lastDiscovery,
        setFilter,
        applyFilters,
        resetFilters,
        goToPage,
        startDiscovery,
        retry,
    };
}