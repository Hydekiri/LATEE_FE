import { apiClient } from '@/src/utils/api-client';
import { PracticeSessionSubmitDTO } from '@/src/types/submition';

export interface PracticeSessionDto {
    sessionId: string;
    learnerId: string;
    patientId: string;
    moduleId: string;
    discussionType: string;
    guidelinesId: string | null;
    status: 'Practicing' | 'VpCompleted' | 'ReasoningStarted' | 'Submitted' | 'Completed' | 'Abandoned';
    startTime: string;
    endTime: string | null;
    createdAt: string;
    finalDiagnosis: string | null;
    timeSetting?: number;
    argumentTime?: number;
}

export interface CreateSessionDTO {
    id: string;
    learnerId: string;
    patientId: string;
    moduleId: string;
    discussionType: string;
    guidelinesId: string | null;
    status: 'Practicing';
}

const BASE = '/practice-session/api/practice-sessions';

export const practiceSessionService = {
    create: async (payload: CreateSessionDTO): Promise<{ id: string }> => {
        return apiClient.post<{ id: string }>(BASE, payload);
    },

    getById: async (sessionId: string): Promise<PracticeSessionDto> => {
        return apiClient.get<PracticeSessionDto>(`${BASE}/${sessionId}`);
    },

    submit: async (payload: PracticeSessionSubmitDTO): Promise<{ sessionId: string }> => {
        return apiClient.post<{ sessionId: string }>(`${BASE}/submit`, payload);
    },

    getClinicalCases: async (params: {
        status?: string;
        page?: number;
        pageSize?: number;
    }) => {
        const q = new URLSearchParams();
        if (params.status) q.append('status', params.status);
        if (params.page) q.append('page', String(params.page));
        if (params.pageSize) q.append('pageSize', String(params.pageSize));
        return apiClient.get(`${BASE}/clinical-cases?${q}`);
    },
};