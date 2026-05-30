"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    ClinicalCaseStatus,
    SortField,
    SortDirection,
    type ClinicalCaseListParams,
} from "@/src/types/clinical-case";


export interface ActiveFilters {
    search: string;
    status: ClinicalCaseStatus | "";
    type: string;
    eccid: string;
    sortBy: SortField;
    sortDir: SortDirection;
}

interface UseClinicalCaseFiltersReturn {
    filters: ActiveFilters;
    setSearch: (v: string) => void;
    setStatus: (v: ClinicalCaseStatus | "") => void;
    setType: (v: string) => void;
    setEccid: (v: string) => void;
    setSortBy: (v: SortField) => void;
    setSortDir: (v: SortDirection) => void;
    resetFilters: () => void;
    toParams: () => ClinicalCaseListParams;
}

const DEFAULT_FILTERS: ActiveFilters = {
    search: "",
    status: "",
    type: "",
    eccid: "",
    sortBy: SortField.CreatedAt,
    sortDir: SortDirection.Desc,
};


export function useClinicalCaseFilters(): UseClinicalCaseFiltersReturn {
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<ActiveFilters>(() => ({
        search: searchParams.get("search") ?? DEFAULT_FILTERS.search,
        status: (searchParams.get("status") as ClinicalCaseStatus | "") ?? DEFAULT_FILTERS.status,
        type: searchParams.get("type") ?? DEFAULT_FILTERS.type,
        eccid: searchParams.get("eccid") ?? DEFAULT_FILTERS.eccid,
        sortBy: (searchParams.get("sortBy") as SortField) ?? DEFAULT_FILTERS.sortBy,
        sortDir: (searchParams.get("sortDir") as SortDirection) ?? DEFAULT_FILTERS.sortDir,
    }));

    const setSearch = useCallback((v: string) => setFilters((f) => ({ ...f, search: v })), []);
    const setStatus = useCallback((v: ClinicalCaseStatus | "") => setFilters((f) => ({ ...f, status: v })), []);
    const setType = useCallback((v: string) => setFilters((f) => ({ ...f, type: v })), []);
    const setEccid = useCallback((v: string) => setFilters((f) => ({ ...f, eccid: v })), []);
    const setSortBy = useCallback((v: SortField) => setFilters((f) => ({ ...f, sortBy: v })), []);
    const setSortDir = useCallback((v: SortDirection) => setFilters((f) => ({ ...f, sortDir: v })), []);

    const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

    const toParams = useCallback((): ClinicalCaseListParams => ({
        search: filters.search || undefined,
        status: filters.status || undefined,
        caseType: filters.type || undefined,
        eccId: filters.eccid || undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
    }), [filters]);

    return {
        filters,
        setSearch,
        setStatus,
        setType,
        setEccid,
        setSortBy,
        setSortDir,
        resetFilters,
        toParams,
    };
}