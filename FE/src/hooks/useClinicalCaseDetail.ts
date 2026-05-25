"use client";

import { useState, useEffect, useCallback } from "react";
import { clinicalCaseService } from "@/src/services/clinical-case-service";
import type {
    ClinicalCaseDetail,
    UpdateClinicalCaseRequest,
} from "@/src/types/clinical-case";

interface UseClinicalCaseDetailReturn {
    caseData: ClinicalCaseDetail | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    refetch: () => void;
    saveCase: (payload: UpdateClinicalCaseRequest) => Promise<void>;
    updateLab: (labId: number, value: string) => Promise<void>;
    updateRad: (radId: number, text: string) => Promise<void>;
}

export function useClinicalCaseDetail(id: string): UseClinicalCaseDetailReturn {
    const [caseData, setCaseData] = useState<ClinicalCaseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await clinicalCaseService.getById(id);
            console.log("[CLINICAL CASE DETAIL] Fetched case detail:", data);
            setCaseData(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load case");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchDetail();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchDetail]);

    const saveCase = useCallback(async (payload: UpdateClinicalCaseRequest) => {
        setSaving(true);
        try {
            await clinicalCaseService.update(id, payload);
            await fetchDetail();
        } finally {
            setSaving(false);
        }
    }, [id, fetchDetail]);

    const updateLab = useCallback(async (labId: number, value: string) => {
        if (!caseData) return;
        setCaseData((prev) =>
            prev ? { ...prev, labs: prev.labs.map((l) => l.id === labId ? { ...l, value } : l) } : prev
        );
        try {
            await clinicalCaseService.updateLab(id, labId, value);
        } catch {
            await fetchDetail();
        }
    }, [id, caseData, fetchDetail]);

    const updateRad = useCallback(async (radId: number, text: string) => {
        if (!caseData) return;
        setCaseData((prev) =>
            prev ? { ...prev, radiology: prev.radiology.map((r) => r.id === radId ? { ...r, text } : r) } : prev
        );
        try {
            await clinicalCaseService.updateRadiology(id, radId, text);
        } catch {
            await fetchDetail();
        }
    }, [id, caseData, fetchDetail]);

    return { caseData, loading, error, saving, refetch: fetchDetail, saveCase, updateLab, updateRad };
}