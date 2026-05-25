export interface Expert {
    readonly expertId?: string;
    readonly name: string;
    readonly role: string;
    readonly img: string;
    readonly bio?: string;
    readonly education?: string;
    readonly skills?: string[];
    readonly phone?: string;
    readonly email?: string;
    readonly location?: string;
}

export interface VitalSigns {
    readonly bp: string;
    readonly hr: number;
    readonly spo2?: string | number;
    readonly rr?: number;
    readonly temp?: string | number;
}

export interface PatientInstructions {
    readonly role: string;
    readonly task: string;
    readonly tone?: string;
    readonly procedure: readonly string[];
}

export interface CaseRules {
    readonly rules: readonly string[];
    readonly totalTime: string;
    readonly timeBreakdown: readonly string[];
}

export interface PatientData {
    readonly id: string;
    readonly caseId: string;
    readonly img: string;
    readonly name: string;
    readonly age: number;
    readonly gender: string;
    readonly pronouns?: string;
    readonly ethnicity?: string;
    readonly occupation?: string;
    readonly setting?: string;
    readonly level: string;
    readonly time: string;
    readonly date: string;
    readonly feedback: number;
    readonly timesPracticed: number;
    readonly description: string;
    readonly chiefConcern: string;
    readonly vitalSigns: VitalSigns;
    readonly instructions: PatientInstructions;
    readonly caseRules: CaseRules;
    readonly timeSetting?: number;
    readonly argumentTime?: number;
    readonly learningObjectives: readonly string[];
    readonly experts: readonly Expert[];
}

export interface AttemptCountData {
    readonly learnerId: string;
    readonly patientId: string;
    readonly attemptCount: number;
    readonly maxAttempts: number;
    readonly canAttempt: boolean;
}

export type PracticeStatus =
    | 'Practicing'
    | 'VpCompleted'
    | 'ReasoningStarted'
    | 'Submitted'
    | 'Completed'
    | 'Abandoned';

export interface PatientFilterState {
    readonly search: string;
    readonly level: string;
    readonly gender: string;
    readonly occupation: string;
    readonly sortBy: PatientSortBy;
    readonly page: number;
    readonly pageSize: number;
}

export type PatientSortBy =
    | 'newest'
    | 'oldest'
    | 'level_asc'
    | 'level_desc';

export const DEFAULT_PATIENT_FILTER: PatientFilterState = {
    search: '',
    level: '',
    gender: '',
    occupation: '',
    sortBy: 'newest',
    page: 1,
    pageSize: 9,
};