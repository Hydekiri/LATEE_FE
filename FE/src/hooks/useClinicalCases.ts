"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clinicalCaseService } from "@/src/services/clinical-case-service";
import type {
    ClinicalCaseSummary,
    ClinicalCaseListParams,
    PaginatedResponse,
    ClinicalCaseFiltersAvailable,
    ClinicalCaseStatus,
    SortField,
    SortDirection,
} from "@/src/types/clinical-case";

interface ClinicalCasesState {
    items: ClinicalCaseSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    availableFilters: ClinicalCaseFiltersAvailable | null;
    loading: boolean;
    error: string | null;
}

interface UseClinicalCasesReturn extends ClinicalCasesState {
    refetch: () => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

export function useClinicalCases(params: ClinicalCaseListParams): UseClinicalCasesReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const debouncedSearch = useDebounce(params.search ?? "", 350);

    const [state, setState] = useState<ClinicalCasesState>({
        items: [],
        total: 0,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 12,
        totalPages: 0,
        availableFilters: null,
        loading: true,
        error: null,
    });

    const abortRef = useRef<AbortController | null>(null);
    const fetchCount = useRef(0);

    const fetchData = useCallback(
        async (overridePage?: number) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            const currentFetch = ++fetchCount.current;

            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const result: PaginatedResponse<ClinicalCaseSummary> =
                    await clinicalCaseService.list({
                        ...params,
                        search: debouncedSearch,
                        page: overridePage ?? state.page,
                    });

                if (currentFetch !== fetchCount.current) return;

                setState({
                    items: result.items,
                    total: result.total,
                    page: result.page,
                    pageSize: result.pageSize,
                    totalPages: result.totalPages,
                    availableFilters: result.filters ?? null,
                    loading: false,
                    error: null,
                });

                // Sync URL
                const sp = new URLSearchParams(searchParams.toString());
                if (debouncedSearch) sp.set("search", debouncedSearch); else sp.delete("search");
                if (params.status) sp.set("status", params.status); else sp.delete("status");
                if (params.type) sp.set("type", params.type); else sp.delete("type");
                sp.set("page", String(result.page));
                router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
            } catch (err: unknown) {
                if (currentFetch !== fetchCount.current) return;
                const message = err instanceof Error ? err.message : "Failed to load cases";
                setState((prev) => ({ ...prev, loading: false, error: message }));
            }
        },
        [debouncedSearch, params.status, params.type, params.eccid, params.sortBy, params.sortDir]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchData(1);
        }, 0);
        return () => clearTimeout(timer);
    }, [debouncedSearch, params.status, params.type, params.eccid, params.sortBy, params.sortDir]);
    
    const setPage = useCallback((page: number) => {
        setState((prev) => ({ ...prev, page }));
        void fetchData(page);
    }, [fetchData]);

    const setPageSize = useCallback((size: number) => {
        setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
    }, []);

    const refetch = useCallback(() => {
        void fetchData();
    }, [fetchData]);

    return { ...state, refetch, setPage, setPageSize };
}