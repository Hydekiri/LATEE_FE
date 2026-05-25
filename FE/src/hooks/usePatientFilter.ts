'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { patientService } from '@/src/services/patient-servvice';
import { PatientData, PatientFilterState, DEFAULT_PATIENT_FILTER } from '@/src/types/practice';
import { PaginatedResponse } from '@/src/types/api';

export interface UsePatientFilterReturn {
    readonly patients: readonly PatientData[];
    readonly totalItems: number;
    readonly totalPages: number;
    readonly currentPage: number;
    readonly filters: PatientFilterState;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly setFilter: <K extends keyof PatientFilterState>(
        key: K,
        value: PatientFilterState[K]
    ) => void;
    readonly applyFilters: () => void;
    readonly resetFilters: () => void;
    readonly goToPage: (page: number) => void;
}

function parseSearchParams(searchParams: URLSearchParams): PatientFilterState {
    return {
        search: searchParams.get('search') ?? '',
        level: searchParams.get('level') ?? '',
        gender: searchParams.get('gender') ?? '',
        occupation: searchParams.get('occupation') ?? '',
        sortBy:
            (searchParams.get('sortBy') as PatientFilterState['sortBy']) ?? 'newest',
        page: parseInt(searchParams.get('page') ?? '1', 10),
        pageSize: parseInt(searchParams.get('pageSize') ?? '9', 10),
    };
}

function syncToUrl(
    router: ReturnType<typeof useRouter>,
    pathname: string,
    filters: PatientFilterState
): void {
    const params = new URLSearchParams();
    params.set('page', String(filters.page));
    if (filters.search) params.set('search', filters.search);
    if (filters.level) params.set('level', filters.level);
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.occupation) params.set('occupation', filters.occupation);
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
}

export function usePatientFilter(): UsePatientFilterReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isMounted = useRef(true);

    const [patients, setPatients] = useState<readonly PatientData[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<PatientFilterState>(() =>
        parseSearchParams(searchParams)
    );

    const fetchPatients = useCallback(async (activeFilters: PatientFilterState) => {
        setIsLoading(true);
        setError(null);
        try {
            const result: PaginatedResponse<PatientData> =
                await patientService.getVirtualPatients(
                    activeFilters.page,
                    activeFilters.pageSize,
                    {
                        search: activeFilters.search || undefined,
                        level: activeFilters.level || undefined,
                        gender: activeFilters.gender || undefined,
                        occupation: activeFilters.occupation || undefined,
                        sortBy: activeFilters.sortBy,
                    }
                );
            if (isMounted.current) {
                setPatients(result.items);
                setTotalItems(result.total);
                setTotalPages(result.totalPages);
            }
        } catch (err) {
            if (isMounted.current) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load patients.'
                );
            }
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        const parsed = parseSearchParams(searchParams);
        const init = async () => {
            if (!active) return;
            void fetchPatients(parsed);
        };
        void init();
        return () => { 
            active = false;
            isMounted.current = false; 
        };
    }, [searchParams, fetchPatients]);

    const setFilter = useCallback(
        <K extends keyof PatientFilterState>(key: K, value: PatientFilterState[K]) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const applyFilters = useCallback(() => {
        const next = { ...filters, page: 1 };
        setFilters(next);
        syncToUrl(router, pathname, next);
        void fetchPatients(next);
    }, [filters, router, pathname, fetchPatients]);

    const resetFilters = useCallback(() => {
        setFilters(DEFAULT_PATIENT_FILTER);
        syncToUrl(router, pathname, DEFAULT_PATIENT_FILTER);
        void fetchPatients(DEFAULT_PATIENT_FILTER);
    }, [router, pathname, fetchPatients]);

    const goToPage = useCallback(
        (page: number) => {
            const next = { ...filters, page };
            setFilters(next);
            syncToUrl(router, pathname, next);
            void fetchPatients(next);
        },
        [filters, router, pathname, fetchPatients]
    );

    const currentPage = filters.page;

    return {
        patients,
        totalItems,
        totalPages,
        currentPage,
        filters,
        isLoading,
        error,
        setFilter,
        applyFilters,
        resetFilters,
        goToPage,
    };
}