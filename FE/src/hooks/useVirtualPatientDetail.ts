"use client";

import { useState, useEffect, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientDetail,
    UpdateVPRequest,
    VPStatus,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientDetailReturn {
    patient: VirtualPatientDetail | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    refetch: () => void;
    savePatient: (payload: UpdateVPRequest) => Promise<void>;
    updateStatus: (status: VPStatus) => Promise<void>;
    addExperts: (expertIds: string[]) => Promise<void>;
    removeExpert: (expertId: string) => Promise<void>;
}

export function useVirtualPatientDetail(id: string): UseVirtualPatientDetailReturn {
    const [patient, setPatient] = useState<VirtualPatientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await virtualPatientExpertService.getById(id);
            setPatient(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load virtual patient");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timer = setTimeout(() => { void fetchDetail(); }, 0);
        return () => clearTimeout(timer);
    }, [fetchDetail]);

    const refetch = useCallback(() => { void fetchDetail(); }, [fetchDetail]);

    const savePatient = useCallback(async (payload: UpdateVPRequest) => {
        setSaving(true);
        try {
            await virtualPatientExpertService.update(id, payload);
            await fetchDetail();
        } catch (err) {
            console.error("VP update error:", err);
        } finally {
            setSaving(false);
        }
    }, [id, fetchDetail]);

    const updateStatus = useCallback(async (status: VPStatus) => {
        setPatient((prev) => (prev ? { ...prev, status } : prev));
        try {
            await virtualPatientExpertService.updateStatus(id, status);
        } catch {
            await fetchDetail();
        }
    }, [id, fetchDetail]);

    const addExperts = useCallback(async (expertIds: string[]) => {
        setSaving(true);
        try {
            await virtualPatientExpertService.addExperts(id, expertIds);
            await fetchDetail();
        } catch (err) {
            console.error("VP addExperts error:", err);
            throw err;
        } finally {
            setSaving(false);
        }
    }, [id, fetchDetail]);

    const removeExpert = useCallback(async (expertId: string) => {
        setSaving(true);
        try {
            await virtualPatientExpertService.removeExpert(id, expertId);
            await fetchDetail();
        } catch (err) {
            console.error("VP removeExpert error:", err);
            throw err;
        } finally {
            setSaving(false);
        }
    }, [id, fetchDetail]);

    return { patient, loading, error, saving, refetch, savePatient, updateStatus, addExperts, removeExpert };
}