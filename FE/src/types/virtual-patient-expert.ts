export enum VPStatus {
    Active = "active",
    Draft = "draft",
    Archived = "archived",
    Published = "published",
}

export enum VPLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
}

export enum VPSortField {
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
    Name = "name",
    Level = "level",
}

export enum VPSortDir {
    Asc = "asc",
    Desc = "desc",
}

export enum VPGender {
    Male = "MALE",
    Female = "FEMALE",
}

export interface VPVitalSigns {
    readonly bp: string;
    readonly hr: number;
    readonly temp: number;
    readonly spo2: string;
    readonly rr: number;
}

export interface VPInstructions {
    readonly role: string;
    readonly task: string;
    readonly tone: string;
    readonly procedure: readonly string[];
}

export interface VPCaseRule {
    readonly rules: readonly string[];
    readonly totalTime: string;
    readonly timeBreakdown: readonly string[];
}

export interface VPPersona {
    readonly emotional_state?: string;
    [key: string]: string | undefined;
}

export interface VPExpert {
    readonly expertId: string;
    readonly name: string;
    readonly role: string;
    readonly avatarUrl: string | null;
    readonly bioQuote?: string;
    readonly educationDetail?: string;
    readonly expertiseSkill?: string;
    readonly phone?: string;
    readonly email?: string;
    readonly location?: string;
}

export interface ExpertSearchResult {
    readonly expertId: string;
    readonly name: string;
}

export interface VPStats {
    readonly totalAttempts: number;
    readonly avgScore: number;
    readonly completionRate: number;
}

export interface VirtualPatientSummary {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly level: VPLevel;
    readonly status: VPStatus;
    readonly avatarImage: string | null;
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly attemptCount: number;
    readonly avgScore: number;
    readonly expertCount: number;
}

export interface VirtualPatientDetail {
    readonly patientId: string;
    readonly ownerExpertId: string | null;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly pronouns: string;
    readonly ethnicity: string;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly medicalHistory: string;
    readonly symptom: string;
    readonly persona: VPPersona;
    readonly vitalSigns: VPVitalSigns;
    readonly instructions: VPInstructions;
    readonly behaviors: readonly string[];
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly learningObjectives: readonly string[];
    readonly level: VPLevel;
    readonly avatarImage: string | null;
    readonly caseRule: VPCaseRule;
    readonly status: VPStatus;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly experts: readonly VPExpert[];
    readonly stats: VPStats;
}

export interface VPFiltersAvailable {
    readonly availableStatuses: VPStatus[];
    readonly availableLevels: VPLevel[];
    readonly availableGenders: VPGender[];
    readonly availableCaseIds: string[];
}

export interface VPListParams {
    readonly page?: number;
    readonly pageSize?: number;
    readonly search?: string;
    readonly status?: VPStatus | "";
    readonly level?: VPLevel | "";
    readonly gender?: VPGender | "";
    readonly caseId?: string;
    readonly sortBy?: VPSortField;
    readonly sortDir?: VPSortDir;
}

export interface VPActiveFilters {
    search: string;
    status: VPStatus | "";
    level: VPLevel | "";
    gender: VPGender | "";
    caseId: string;
    sortBy: VPSortField;
    sortDir: VPSortDir;
}

export interface VPPaginatedResponse<T> {
    readonly items: T[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly filters?: VPFiltersAvailable;
}

export interface CreateVPRequest {
    readonly name: string;
    readonly caseId: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly pronouns: string;
    readonly ethnicity: string;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly medicalHistory?: string;
    readonly symptom?: string;
    readonly level: VPLevel;
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly status: VPStatus;
    readonly avatarImage?: string | null;
    readonly persona?: VPPersona;
    readonly vitalSigns?: VPVitalSigns;
    readonly instructions?: VPInstructions;
    readonly behaviors?: string[];
    readonly learningObjectives?: string[];
    readonly caseRule?: VPCaseRule;
    readonly expertIds?: string[];
}

export type UpdateVPRequest = Partial<CreateVPRequest>;

export interface UpdateVPExpertsRequest {
    readonly expertIds: string[];
}

export interface UpdateVPStatusRequest {
    readonly status: VPStatus;
}

export interface CreateVPResponse {
    readonly patientId: string;
    readonly ownerExpertId: string | null;
    readonly name: string;
    readonly status: VPStatus;
    readonly createdAt: string;
    readonly expertIds: string[];
}

export interface UpdateVPResponse {
    readonly patientId: string;
    readonly updatedAt: string;
}

export interface UpdateVPStatusResponse {
    readonly patientId: string;
    readonly status: VPStatus;
    readonly updatedAt: string;
}

export interface UpdateVPExpertsResponse {
    readonly patientId: string;
    readonly expertIds: string[];
    readonly updatedAt: string;
}

export interface DeleteVPResponse {
    readonly success: boolean;
    readonly patientId: string;
}

export interface DuplicateVPResponse {
    readonly patientId: string;
    readonly name: string;
    readonly status: VPStatus;
    readonly createdAt: string;
}

export interface ClinicalCaseSummary {
    readonly caseId: string;
    readonly title: string;
    readonly type: string;
    readonly status: string;
    readonly createdByName?: string;
}

export interface CreateVPFormState {
    name: string;
    caseId: string;
    age: number | "";
    gender: VPGender | "";
    pronouns: string;
    ethnicity: string;
    occupation: string;
    chiefConcern: string;
    medicalHistory: string;
    symptom: string;
    level: VPLevel | "";
    timeSetting: number | "";
    argumentTime: number | "";
    status: VPStatus;
}

export const DEFAULT_VP_FORM: CreateVPFormState = {
    name: "",
    caseId: "",
    age: "",
    gender: "",
    pronouns: "",
    ethnicity: "",
    occupation: "",
    chiefConcern: "",
    medicalHistory: "",
    symptom: "",
    level: "",
    timeSetting: 30,
    argumentTime: 15,
    status: VPStatus.Draft,
};

export const DEFAULT_VP_FILTERS: VPActiveFilters = {
    search: "",
    status: "",
    level: "",
    gender: "",
    caseId: "",
    sortBy: VPSortField.CreatedAt,
    sortDir: VPSortDir.Desc,
};