"use client";

import { useState, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";

interface UseVPExpertActionsReturn {
    expertActionLoading: boolean;
    expertActionError: string | null;
    addExperts: (vpId: string, expertIds: string[]) => Promise<boolean>;
    removeExpert: (vpId: string, expertId: string) => Promise<boolean>;
    clearExpertError: () => void;
}

export function useVPExpertActions(): UseVPExpertActionsReturn {
    const [expertActionLoading, setExpertActionLoading] = useState(false);
    const [expertActionError, setExpertActionError] = useState<string | null>(null);

    const clearExpertError = useCallback(() => setExpertActionError(null), []);

    const addExperts = useCallback(async (
        vpId: string,
        expertIds: string[],
    ): Promise<boolean> => {
        if (expertIds.length === 0) return false;
        setExpertActionLoading(true);
        setExpertActionError(null);
        try {
            await virtualPatientExpertService.addExperts(vpId, expertIds);
            return true;
        } catch (err: unknown) {
            setExpertActionError(
                err instanceof Error ? err.message : "Failed to add experts"
            );
            return false;
        } finally {
            setExpertActionLoading(false);
        }
    }, []);

    const removeExpert = useCallback(async (
        vpId: string,
        expertId: string,
    ): Promise<boolean> => {
        setExpertActionLoading(true);
        setExpertActionError(null);
        try {
            await virtualPatientExpertService.removeExpert(vpId, expertId);
            return true;
        } catch (err: unknown) {
            setExpertActionError(
                err instanceof Error ? err.message : "Failed to remove expert"
            );
            return false;
        } finally {
            setExpertActionLoading(false);
        }
    }, []);

    return {
        expertActionLoading,
        expertActionError,
        addExperts,
        removeExpert,
        clearExpertError,
    };
}