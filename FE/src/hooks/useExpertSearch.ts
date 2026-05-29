"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type { ExpertSearchResult } from "@/src/types/virtual-patient-expert";

interface UseExpertSearchReturn {
    query: string;
    results: ExpertSearchResult[];
    searching: boolean;
    setQuery: (q: string) => void;
    clearSearch: () => void;
}

export function useExpertSearch(debounceMs: number = 300): UseExpertSearchReturn {
    const [query, setQueryState] = useState("");
    const [results, setResults] = useState<ExpertSearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const fetchCountRef = useRef(0);

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            const id = setTimeout(() => {
                setResults([]);
                setSearching(false);
            }, 0);
            return () => clearTimeout(id);
        }

        const currentFetch = ++fetchCountRef.current;
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const timer = setTimeout(async () => {
            setSearching(true);

            try {
                const data = await virtualPatientExpertService.searchExperts(trimmed);

                if (currentFetch !== fetchCountRef.current) return;
                setResults(Array.isArray(data) ? data : []);
            } catch {
                if (currentFetch !== fetchCountRef.current) return;
                setResults([]);
            } finally {
                if (currentFetch === fetchCountRef.current) {
                    setSearching(false);
                }
            }
        }, debounceMs);

        return () => {
            clearTimeout(timer);
        };
    }, [query, debounceMs]);

    const setQuery = useCallback((q: string) => {
        setQueryState(q);
    }, []);

    const clearSearch = useCallback(() => {
        setQueryState("");
        setResults([]);
        setSearching(false);
        fetchCountRef.current++;
    }, []);

    return { query, results, searching, setQuery, clearSearch };
}