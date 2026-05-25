import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";

export function buildVPBasePayload(patient: VirtualPatientDetail): UpdateVPRequest {
    return {
        caseId:             patient.caseId,
        name:               patient.name,
        age:                patient.age,
        gender:             patient.gender,
        pronouns:           patient.pronouns,
        ethnicity:          patient.ethnicity,
        occupation:         patient.occupation,
        chiefConcern:       patient.chiefConcern,
        timeSetting:        patient.timeSetting,
        argumentTime:       patient.argumentTime,
        level:              patient.level,
        avatarImage:        patient.avatarImage?.startsWith("https://example.com")
                                ? undefined
                                : patient.avatarImage,
        persona:            patient.persona,
        vitalSigns:         patient.vitalSigns,
        instructions:       patient.instructions,
        behaviors:          patient.behaviors ? [...patient.behaviors] : [],
        medicalHistory:     patient.medicalHistory,
        symptom:            patient.symptom,
        learningObjectives: patient.learningObjectives ? [...patient.learningObjectives] : [],
    };
}