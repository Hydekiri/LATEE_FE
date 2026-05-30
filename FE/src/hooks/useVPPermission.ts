"use client";

import { useMemo } from "react";
import { getCurrentExpertId } from "@/src/utils/cookies";
import {
    getVPPermissionLevel,
    canEditVP,
    canManageExperts,
    canChangeStatus,
    canDeleteVP,
    type VPPermissionLevel,
} from "@/src/utils/vp-permission";
import type { VirtualPatientDetail } from "@/src/types/virtual-patient-expert";

interface UseVPPermissionReturn {
    currentExpertId: string | null;
    permissionLevel: VPPermissionLevel;
    canEdit: boolean;
    canManageExperts: boolean;
    canChangeStatus: boolean;
    canDelete: boolean;
    isOwner: boolean;
    isReadonly: boolean;
}

export function useVPPermission(patient: VirtualPatientDetail | null): UseVPPermissionReturn {
    const currentExpertId = getCurrentExpertId();

    const result = useMemo((): UseVPPermissionReturn => {
        const permissionLevel = getVPPermissionLevel(patient, currentExpertId);
        return {
            currentExpertId,
            permissionLevel,
            canEdit: canEditVP(patient, currentExpertId),
            canManageExperts: canManageExperts(patient, currentExpertId),
            canChangeStatus: canChangeStatus(patient, currentExpertId),
            canDelete: canDeleteVP(patient, currentExpertId),
            isOwner: permissionLevel === "owner",
            isReadonly: permissionLevel === "readonly",
        };
    }, [patient, currentExpertId]);

    return result;
}