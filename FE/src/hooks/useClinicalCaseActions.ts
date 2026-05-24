"use client";

import { useState, useCallback } from "react";
import { clinicalCaseService } from "@/src/services/clinical-case-service";
import type {
    ClinicalCaseSummary,
    ClinicalCaseStatus,
    CreateClinicalCaseRequest,
    CreateClinicalCaseResponse,
} from "@/src/types/clinical-case";

interface UseClinicalCaseActionsReturn {
    actionLoading: boolean;
    actionError: string | null;
    createCase: (payload: CreateClinicalCaseRequest) => Promise<CreateClinicalCaseResponse | null>;
    deleteCase: (id: string, onSuccess?: () => void) => Promise<void>;
    updateStatus: (id: string, status: ClinicalCaseStatus, mutateItem?: (fn: (item: ClinicalCaseSummary) => ClinicalCaseSummary) => void) => Promise<void>;
    duplicateCase: (id: string, onSuccess?: () => void) => Promise<void>;
    clearError: () => void;
}

export function useClinicalCaseActions(): UseClinicalCaseActionsReturn {
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const clearError = useCallback(() => setActionError(null), []);

    const createCase = useCallback(async (
        payload: CreateClinicalCaseRequest
    ): Promise<CreateClinicalCaseResponse | null> => {
        setActionLoading(true);
        setActionError(null);
        try {
            const result = await clinicalCaseService.create(payload);
            return result;
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to create case");
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const deleteCase = useCallback(async (
        id: string,
        onSuccess?: () => void
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await clinicalCaseService.delete(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to delete case");
        } finally {
            setActionLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (
        id: string,
        status: ClinicalCaseStatus,
        mutateItem?: (fn: (item: ClinicalCaseSummary) => ClinicalCaseSummary) => void
    ): Promise<void> => {
        mutateItem?.((item) => ({ ...item, status }));
        setActionError(null);
        try {
            await clinicalCaseService.updateStatus(id, status);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to update status");
            throw err; 
        }
    }, []);

    const duplicateCase = useCallback(async (
        id: string,
        onSuccess?: () => void
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await clinicalCaseService.duplicate(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to duplicate case");
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        actionLoading,
        actionError,
        createCase,
        deleteCase,
        updateStatus,
        duplicateCase,
        clearError,
    };
}