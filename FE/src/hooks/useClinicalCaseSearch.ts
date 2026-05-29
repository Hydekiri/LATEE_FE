"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type { ClinicalCaseSummary } from "@/src/types/virtual-patient-expert";

interface UseClinicalCaseSearchReturn {
    query: string;
    results: ClinicalCaseSummary[];
    searching: boolean;
    setQuery: (q: string) => void;
    clearSearch: () => void;
}

export function useClinicalCaseSearch(debounceMs = 350): UseClinicalCaseSearchReturn {
    const [query, setQueryState] = useState("");
    const [results, setResults] = useState<ClinicalCaseSummary[]>([]);
    const [searching, setSearching] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countRef = useRef(0);

    const setQuery = useCallback((q: string) => {
        setQueryState(q);
        if (!q.trim()) {
            setResults([]);
            setSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setQuery("");
    }, [setQuery]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!query.trim()) return;

        const current = ++countRef.current;

        timerRef.current = setTimeout(async () => {
            setSearching(true);

            try {
                const res = await virtualPatientExpertService.searchClinicalCases(query.trim(), 10);
                if (current !== countRef.current) return;
                setResults(res.items);
            } catch {
                if (current !== countRef.current) return;
                setResults([]);
            } finally {
                if (current === countRef.current) setSearching(false);
            }
        }, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query, debounceMs]);

    return { query, results, searching, setQuery, clearSearch };
}