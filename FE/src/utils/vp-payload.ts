import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";

export function buildVPBasePayload(patient: VirtualPatientDetail): UpdateVPRequest {
    return {
        caseId: patient.caseId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        pronouns: patient.pronouns,
        ethnicity: patient.ethnicity ?? "",
        occupation: patient.occupation,
        chiefConcern: patient.chiefConcern,
        timeSetting: patient.timeSetting,
        argumentTime: patient.argumentTime,
        level: patient.level,
        avatarImage: patient.avatarImage?.startsWith("https://example.com")
            ? undefined
            : patient.avatarImage ?? undefined,
        persona: patient.persona ?? undefined,
        vitalSigns: patient.vitalSigns ?? undefined,
        instructions: patient.instructions ?? undefined,
        behaviors: patient.behaviors ? [...patient.behaviors] : undefined,
        medicalHistory: patient.medicalHistory,
        symptom: patient.symptom,
        learningObjectives: patient.learningObjectives ? [...patient.learningObjectives] : undefined,
        caseRule: patient.caseRule ?? undefined,
    };
}

export function normalizeLearningObjectives(raw: unknown): readonly string[] | null {
    if (raw === null || raw === undefined) return null;
    if (Array.isArray(raw)) return raw as string[];
    if (typeof raw === "object") {
        return Object.values(raw as Record<string, string>).filter(
            (v): v is string => typeof v === "string",
        );
    }
    return null;
}