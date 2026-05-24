export enum ClinicalCaseStatus {
    Active = "active",
    Draft = "draft",
    Archived = "archived",
    Published = "published",
}

export enum SortDirection {
    Asc = "asc",
    Desc = "desc",
}

export enum SortField {
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
    Title = "title",
}

export enum LabCategory {
    BloodGas = "Blood Gas",
    Chemistry = "Chemistry",
    Hematology = "Hematology",
}

export enum RadiologyModality {
    CT = "CT",
    Ultrasound = "Ultrasound",
    Radiograph = "Radiograph",
    Drainage = "Drainage",
    MRI = "MRI",
    MRCP = "MRCP",
    ERCP = "ERCP",
}

export interface LabTestItemJoined {
    id: number;
    itemId: number;
    label: string;
    fluid: string;
    category: LabCategory;
    value: string;
    rangeLower: string;
    rangeUpper: string;
}

export interface RadiologyReportEntity {
    id: number;
    noteId: string;
    modality: RadiologyModality;
    region: string;
    examName: string;
    text: string;
}

export interface VirtualPatientSummary {
    patientId: string;
    name: string;
    age: number;
    gender: string;
    level: string;
    status: string;
}

export interface CaseStats {
    totalAttempts: number;
    avgScore: number;
    completionRate: number;
}

export interface ClinicalCaseSummary {
    caseId: string;
    title: string;
    description: string;
    caseType: string;
    status: ClinicalCaseStatus;
    eccId: string;
    createdBy: string;
    createdByName: string;
    createdAt: string;
    updatedAt: string;
    virtualPatientCount: number;
    attemptCount: number;
    avgScore: number;
}

export interface ClinicalCaseDetail {
    caseId: string;
    title: string;
    description: string;
    caseType: string;
    status: ClinicalCaseStatus;
    pe: string;
    symptom: string;
    medicalHistory: string;
    createdBy: string;
    createdByName: string;
    eccId: string;
    createdAt: string;
    updatedAt: string;
    virtualPatientCount: number;
    attemptCount: number;
    avgScore: number;
    labs: LabTestItemJoined[];
    radiology: RadiologyReportEntity[];
    virtualPatients: VirtualPatientSummary[];
    stats: CaseStats;
}

export interface FragmentedPhysicalExam {
    temp: string;
    hr: string;
    resp: string;
    o2sat: string;
    general: string;
    cardiac: string;
    pulmonary: string;
    abdomen: string;
    extremities: string;
}

export interface ClinicalCaseFiltersAvailable {
    availableStatuses: ClinicalCaseStatus[];
    availableTypes: string[];
    availableEccids: string[];
}

export interface ClinicalCaseListParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ClinicalCaseStatus | "";
    caseType?: string;
    eccId?: string;
    sortBy?: SortField;
    sortDir?: SortDirection;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    filters?: ClinicalCaseFiltersAvailable;
}

export interface CreateClinicalCaseRequest {
    title: string;
    description: string;
    caseType: string;
    status: ClinicalCaseStatus;
    pe: string;
    symptom: string;
    medicalHistory: string;
    eccId: string;
}

export interface UpdateClinicalCaseRequest {
    title?: string;
    description?: string;
    caseType?: string;
    pe?: string;
    symptom?: string;
    medicalHistory?: string;
    eccId?: string;
}

export interface UpdateCaseStatusRequest {
    status: ClinicalCaseStatus;
}

export interface UpdateLabValueRequest {
    value: string;
}

export interface UpdateRadiologyTextRequest {
    text: string;
}

export interface CreateClinicalCaseResponse {
    caseId: string;
    title: string;
    status: ClinicalCaseStatus;
    createdAt: string;
}

export interface UpdateClinicalCaseResponse {
    caseId: string;
    updatedAt: string;
}

export interface UpdateStatusResponse {
    caseId: string;
    status: ClinicalCaseStatus;
    updatedAt: string;
}

export interface DeleteClinicalCaseResponse {
    success: boolean;
    caseId: string;
}

export interface DuplicateClinicalCaseResponse {
    caseId: string;
    title: string;
    status: ClinicalCaseStatus;
    createdAt: string;
}

export interface UpdateLabResponse {
    id: number;
    value: string;
    updatedAt: string;
}

export interface UpdateRadiologyResponse {
    id: number;
    text: string;
    updatedAt: string;
}

export interface ApiErrorResponse {
    message: string;
    statusCode: number;
    errorCode?: string;
}