import { apiClient } from '@/src/utils/api-client';
import {
    DiscoveryFilterState,
    DiscoveryResponse,
    LearnerLastDiscovery,
    LearnerLastDiscoveryPayload,
    SaveDiscoveryResponse,
    FetchCasesPayload,
    FetchCasesResponse,
} from '@/src/types/discovery';

const VP_BASE = '/virtual-patient/api/virtual-patients';

export const discoveryService = {
    async getDiscoveryList(
        learnerId: string,
        filters: DiscoveryFilterState
    ): Promise<DiscoveryResponse> {
        const q = new URLSearchParams();
        q.set('learnerId', learnerId);
        q.set('page', String(filters.page));
        q.set('pageSize', String(filters.pageSize));
        q.set('sortBy', filters.sortBy);
        if (filters.level) q.set('level', filters.level);
        if (filters.gender) q.set('gender', filters.gender);

        return apiClient.get<DiscoveryResponse>(
            `${VP_BASE}/discovery?${q.toString()}`
        );
    },

    async fetchNewCasesFromDB(payload: FetchCasesPayload): Promise<FetchCasesResponse> {
        return apiClient.post<FetchCasesResponse, FetchCasesPayload>(
            `${VP_BASE}/discovery/fetch-cases`,
            payload
        );
    },

    async getLearnerLastDiscovery(learnerId: string): Promise<LearnerLastDiscovery | null> {
        try {
            return await apiClient.get<LearnerLastDiscovery>(
                `${VP_BASE}/learner-last-discovery?learnerId=${encodeURIComponent(learnerId)}`
            );
        } catch {
            return null;
        }
    },

    async saveLearnerLastDiscovery(
        payload: LearnerLastDiscoveryPayload
    ): Promise<SaveDiscoveryResponse> {
        return apiClient.post<SaveDiscoveryResponse, LearnerLastDiscoveryPayload>(
            `${VP_BASE}/learner-last-discovery`,
            payload
        );
    },
};