export interface DiscoveryAttemptSummary {
    readonly attempted: boolean;
    readonly attemptCount: number;
    readonly maxAttempts: number;
    readonly bestScore: number | null;
    readonly latestScore: number | null;
}

export interface DiscoveryExpertSummary {
    readonly expertId: string;
    readonly name: string;
    readonly role: string;
    readonly avatarUrl: string | null;
}

export interface DiscoveryPatientItem {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: string;
    readonly occupation: string | null;
    readonly chiefConcern: string;
    readonly symptom: string | null;
    readonly level: string;
    readonly avatarImage: string | null;
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly createdAt: string;
    readonly feedbackCount: number;
    readonly attemptSummary: DiscoveryAttemptSummary | null;
    readonly experts: readonly DiscoveryExpertSummary[];
}

export interface DiscoveryFilters {
    readonly availableLevels: readonly string[];
    readonly availableGenders: readonly string[];
    readonly availableSpecialties: readonly string[];
    readonly availableCaseTypes: readonly string[];
}

// --- Các Interface cũ bạn hỏi nằm ở đây ---
export interface DiscoveryResponse {
    readonly items: readonly DiscoveryPatientItem[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
    readonly filters: DiscoveryFilters | null;
}

export interface LearnerLastDiscovery {
    readonly learnerId: string;
    readonly filterJson: string | null;
    readonly lastAccessed: string | null;
}

export interface LearnerLastDiscoveryPayload {
    readonly learnerId: string;
    readonly filterJson: string | null;
    readonly lastAccessed: string | null;
}

export interface SaveDiscoveryResponse {
    readonly success: boolean;
    readonly learnerId: string;
    readonly lastAccessed: string;
}

export type DiscoverySortBy = 'newest' | 'oldest' | 'level_asc' | 'level_desc';

export interface DiscoveryFilterState {
    readonly level: string;
    readonly gender: string;
    readonly sortBy: DiscoverySortBy;
    readonly page: number;
    readonly pageSize: number;
    readonly fetchCount: number; 
}

export const DEFAULT_DISCOVERY_FILTER: DiscoveryFilterState = {
    level: '',
    gender: '',
    sortBy: 'newest',
    page: 1,
    pageSize: 9,
    fetchCount: 5, 
};

export interface FetchedPatientSummary {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly level: string;
}

export interface FetchCasesPayload {
    readonly learnerId: string;
    readonly level: string | null;
    readonly gender: string | null;
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

export type DiscoveryLoadState = 'idle' | 'checking' | 'loading' | 'ready' | 'empty' | 'error';