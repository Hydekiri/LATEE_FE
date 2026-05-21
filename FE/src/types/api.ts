export interface PaginatedResponse<T> {
    readonly items: readonly T[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
    readonly totalPages: number;
}

export interface ApiError {
    readonly message: string;
    readonly statusCode?: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    readonly data: T | null;
    readonly state: LoadingState;
    readonly error: string | null;
}

export interface FetchedPatientSummary {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly level: string;
}

export interface FetchCasesPayload {
    readonly learnerId: string;
    readonly level: string;
    readonly gender: string;
    readonly fetchCount: number;
}

export interface FetchCasesDataSuccess {
    readonly learnerId: string;
    readonly fetchedCount: number;
    readonly currentPoolTotal: number;
    readonly fetchedItems: readonly FetchedPatientSummary[];
}

export interface FetchCasesResponse {
    readonly success: boolean;
    readonly message: string;
    readonly data: FetchCasesDataSuccess;
}