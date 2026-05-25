// src/services/discovery-service.ts
import { clientApi } from '@/src/utils/api-client';
import {
    DiscoveryPatientItem,
    FetchCasesPayload,
    FetchCasesResponse,
    LearnerLastDiscovery,
    LearnerLastDiscoveryPayload,
    SaveDiscoveryResponse,
} from '@/src/types/discovery';

// ── Shape returned by GET /discovery ──────────────────────────
interface DiscoveryApiResponse {
    readonly items: readonly DiscoveryPatientItem[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
    readonly filters: {
        readonly availableLevels: readonly string[];
        readonly availableGenders: readonly string[];
        readonly availableSpecialties: readonly string[];
        readonly availableCaseTypes: readonly string[];
    } | null;
}

const BASE = '/virtual-patient/api/virtual-patients';

export const discoveryService = {
    async getDiscoveryPool(
        learnerId: string,
        sortBy: string = 'newest'
    ): Promise<readonly DiscoveryPatientItem[]> {
        const q = new URLSearchParams({
            learnerId,
            sortBy,
            pageSize: '200',
            page: '1',
        });
        const res = await clientApi.get<DiscoveryApiResponse>(
            `${BASE}/discovery?${q.toString()}`
        );
        return res.items;
    },

    async fetchNewCasesFromDB(
        payload: FetchCasesPayload
    ): Promise<FetchCasesResponse> {
        return clientApi.post<FetchCasesResponse, FetchCasesPayload>(
            `${BASE}/discovery/fetch-cases`,
            payload
        );
    },

    async getLearnerLastDiscovery(
        learnerId: string
    ): Promise<LearnerLastDiscovery | null> {
        try {
            return await clientApi.get<LearnerLastDiscovery>(
                `${BASE}/learner-last-discovery?learnerId=${encodeURIComponent(learnerId)}`
            );
        } catch {
            return null;
        }
    },

    async saveLearnerLastDiscovery(
        payload: LearnerLastDiscoveryPayload
    ): Promise<SaveDiscoveryResponse> {
        return clientApi.post<SaveDiscoveryResponse, LearnerLastDiscoveryPayload>(
            `${BASE}/learner-last-discovery`,
            payload
        );
    },
} as const;