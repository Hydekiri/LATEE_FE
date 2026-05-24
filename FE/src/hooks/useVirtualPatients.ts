"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientSummary,
    VPListParams,
    VPFiltersAvailable,
} from "@/src/types/virtual-patient-expert";

interface VirtualPatientsState {
    items: VirtualPatientSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    availableFilters: VPFiltersAvailable | null;
    loading: boolean;
    error: string | null;
}

interface UseVirtualPatientsReturn extends VirtualPatientsState {
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

export function useVirtualPatients(params: VPListParams): UseVirtualPatientsReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        search,
        status,
        level,
        gender,
        caseId,
        sortBy,
        sortDir,
        pageSize: paramPageSize,
    } = params;

    const debouncedSearch = useDebounce(search ?? "", 350);
    const searchParamsRef = useRef(searchParams);
    useEffect(() => {
        searchParamsRef.current = searchParams;
    });

    const [state, setState] = useState<VirtualPatientsState>({
        items: [],
        total: 0,
        page: params.page ?? 1,
        pageSize: paramPageSize ?? 8,
        totalPages: 0,
        availableFilters: null,
        loading: true,
        error: null,
    });

    const abortRef = useRef<AbortController | null>(null);
    const fetchCountRef = useRef(0);
    const pageRef = useRef(params.page ?? 1);

    const prevFiltersRef = useRef({ debouncedSearch, status, level, gender, caseId });
    useEffect(() => {
        const prev = prevFiltersRef.current;
        if (
            prev.debouncedSearch !== debouncedSearch ||
            prev.status !== status ||
            prev.level !== level ||
            prev.gender !== gender ||
            prev.caseId !== caseId
        ) {
            pageRef.current = 1;
        }
        prevFiltersRef.current = { debouncedSearch, status, level, gender, caseId };
    }, [debouncedSearch, status, level, gender, caseId]);

    const fetchData = useCallback(async () => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const currentFetch = ++fetchCountRef.current;

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const result = await virtualPatientExpertService.list({
                search: debouncedSearch || undefined,
                status: status || undefined,
                level: level || undefined,
                gender: gender || undefined,
                caseId: caseId || undefined,
                sortBy,
                sortDir,
                page: pageRef.current,
                pageSize: paramPageSize ?? 15,
            });

            if (currentFetch !== fetchCountRef.current) return;

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
            const sp = new URLSearchParams(searchParamsRef.current.toString());

            if (debouncedSearch) sp.set("search", debouncedSearch); else sp.delete("search");
            if (status) sp.set("status", status); else sp.delete("status");
            if (level) sp.set("level", level); else sp.delete("level");
            if (gender) sp.set("gender", gender); else sp.delete("gender");
            sp.set("page", String(result.page));

            router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        } catch (err: unknown) {
            if (currentFetch !== fetchCountRef.current) return;
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : "Error",
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, status, level, gender, caseId, sortBy, sortDir, paramPageSize, router, pathname]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const setPage = useCallback((page: number) => {
        pageRef.current = page;
        void fetchData();
    }, [fetchData]);

    const setPageSize = useCallback((size: number) => {
        pageRef.current = 1;
        setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
    }, []);

    const refetch = useCallback(() => {
        void fetchData();
    }, [fetchData]);

    return { ...state, refetch, setPage, setPageSize };
}