import type { VirtualPatientDetail } from "@/src/types/virtual-patient-expert";

export type VPPermissionLevel = "owner" | "assigned" | "readonly";

export function getVPPermissionLevel(
    patient: VirtualPatientDetail | null,
    currentExpertId: string | null,
): VPPermissionLevel {
    if (!patient || !currentExpertId) return "readonly";

    if (patient.ownerExpertId === currentExpertId) return "owner";

    const isAssigned = patient.experts.some((e) => e.expertId === currentExpertId);
    if (isAssigned) return "assigned";

    return "readonly";
}

export function canEditVP(
    patient: VirtualPatientDetail | null,
    currentExpertId: string | null,
): boolean {
    const level = getVPPermissionLevel(patient, currentExpertId);
    return level === "owner" || level === "assigned";
}

export function canManageExperts(
    patient: VirtualPatientDetail | null,
    currentExpertId: string | null,
): boolean {
    return getVPPermissionLevel(patient, currentExpertId) === "owner";
}

export function canChangeStatus(
    patient: VirtualPatientDetail | null,
    currentExpertId: string | null,
): boolean {
    return getVPPermissionLevel(patient, currentExpertId) === "owner";
}

export function canDeleteVP(
    patient: VirtualPatientDetail | null,
    currentExpertId: string | null,
): boolean {
    return getVPPermissionLevel(patient, currentExpertId) === "owner";
}