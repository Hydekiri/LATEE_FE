"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    VPStatus,
    VPLevel,
    VPGender,
    VPSortField,
    VPSortDir,
    DEFAULT_VP_FILTERS,
    type VPActiveFilters,
    type VPListParams,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientFiltersReturn {
    filters: VPActiveFilters;
    setSearch: (v: string) => void;
    setStatus: (v: VPStatus | "") => void;
    setLevel: (v: VPLevel | "") => void;
    setGender: (v: VPGender | "") => void;
    setCaseId: (v: string) => void;
    setSortBy: (v: VPSortField) => void;
    setSortDir: (v: VPSortDir) => void;
    resetFilters: () => void;
    toParams: () => VPListParams;
}

export function useVirtualPatientFilters(): UseVirtualPatientFiltersReturn {
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<VPActiveFilters>(() => ({
        search: searchParams.get("search") ?? DEFAULT_VP_FILTERS.search,
        status: (searchParams.get("status") as VPStatus | "") ?? DEFAULT_VP_FILTERS.status,
        level: (searchParams.get("level") as VPLevel | "") ?? DEFAULT_VP_FILTERS.level,
        gender: (searchParams.get("gender") as VPGender | "") ?? DEFAULT_VP_FILTERS.gender,
        caseId: searchParams.get("caseId") ?? DEFAULT_VP_FILTERS.caseId,
        sortBy: (searchParams.get("sortBy") as VPSortField) ?? DEFAULT_VP_FILTERS.sortBy,
        sortDir: (searchParams.get("sortDir") as VPSortDir) ?? DEFAULT_VP_FILTERS.sortDir,
    }));

    const setSearch = useCallback((v: string) => setFilters((f) => ({ ...f, search: v })), []);
    const setStatus = useCallback((v: VPStatus | "") => setFilters((f) => ({ ...f, status: v })), []);
    const setLevel = useCallback((v: VPLevel | "") => setFilters((f) => ({ ...f, level: v })), []);
    const setGender = useCallback((v: VPGender | "") => setFilters((f) => ({ ...f, gender: v })), []);
    const setCaseId = useCallback((v: string) => setFilters((f) => ({ ...f, caseId: v })), []);
    const setSortBy = useCallback((v: VPSortField) => setFilters((f) => ({ ...f, sortBy: v })), []);
    const setSortDir = useCallback((v: VPSortDir) => setFilters((f) => ({ ...f, sortDir: v })), []);
    const resetFilters = useCallback(() => setFilters(DEFAULT_VP_FILTERS), []);
    const toParams = useCallback(() => filtersToParams(filters), [filters]);
    return {
        filters,
        setSearch, setStatus, setLevel, setGender, setCaseId,
        setSortBy, setSortDir, resetFilters, toParams,
    };
}

export function filtersToParams(filters: VPActiveFilters): VPListParams {
    return {
        search: filters.search || undefined,
        status: filters.status || undefined,
        level: filters.level || undefined,
        gender: filters.gender || undefined,
        caseId: filters.caseId || undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
    };
}