"use client";

import { useState, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientSummary,
    CreateVPRequest,
    CreateVPResponse,
    VPStatus,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientActionsReturn {
    actionLoading: boolean;
    actionError: string | null;
    createPatient: (payload: CreateVPRequest) => Promise<CreateVPResponse | null>;
    deletePatient: (id: string, onSuccess?: () => void) => Promise<void>;
    duplicatePatient: (id: string, onSuccess?: () => void) => Promise<void>;
    updateStatus: (
        id: string,
        status: VPStatus,
        mutateItem?: (fn: (item: VirtualPatientSummary) => VirtualPatientSummary) => void,
        onSettled?: () => void,
    ) => Promise<void>;
    publishPatient: (id: string, onSuccess?: () => void) => Promise<void>;
    clearError: () => void;
}

export function useVirtualPatientActions(): UseVirtualPatientActionsReturn {
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const clearError = useCallback(() => setActionError(null), []);

    const createPatient = useCallback(async (
        payload: CreateVPRequest,
    ): Promise<CreateVPResponse | null> => {
        setActionLoading(true);
        setActionError(null);
        try {
            return await virtualPatientExpertService.create(payload);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to create virtual patient");
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const deletePatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.delete(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to delete virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    const duplicatePatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.duplicate(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to duplicate virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (
        id: string,
        status: VPStatus,
        mutateItem?: (fn: (item: VirtualPatientSummary) => VirtualPatientSummary) => void,
        onSettled?: () => void,
    ): Promise<void> => {
        mutateItem?.((item) => ({ ...item, status }));
        setActionError(null);
        try {
            await virtualPatientExpertService.updateStatus(id, status);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to update status");
            throw err;
        } finally {
            onSettled?.();
        }
    }, []);

    const publishPatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.publish(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to publish virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        actionLoading, actionError,
        createPatient, deletePatient, duplicatePatient,
        updateStatus, publishPatient, clearError,
    };
}