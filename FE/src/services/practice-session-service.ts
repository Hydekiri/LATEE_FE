import { apiClient } from '@/src/utils/api-client';
import { PracticeSessionSubmitDTO } from '@/src/types/submition';
import { PracticeStatus } from '@/src/types/practice';
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';

export interface PracticeSessionDto {
    readonly sessionId: string;
    readonly learnerId: string;
    readonly patientId: string;
    readonly moduleId: string;
    readonly discussionType: string;
    readonly guidelinesId: string | null;
    readonly status: PracticeStatus;
    readonly startTime: string;
    readonly endTime: string | null;
    readonly createdAt: string;
    readonly finalDiagnosis: string | null;
    readonly timeSetting?: number;
    readonly argumentTime?: number;
}

export interface CreateSessionDTO {
    readonly id: string;
    readonly learnerId: string;
    readonly patientId: string;
    readonly moduleId: string;
    readonly discussionType: string;
    readonly guidelinesId: string | null;
    readonly status: 'Practicing';
}

export interface UpdateStatusResponse {
    readonly sessionId: string;
    readonly status: PracticeStatus;
}

export interface ActiveSessionResponse {
    readonly sessionId: string;
    readonly status: PracticeStatus;
    readonly startTime: string;
    readonly patientId: string;
}

const BASE = '/practice-session/api/practice-sessions';

async function patchJson<T>(
    url: string,
    body: unknown
): Promise<T> {
    const token = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(errData.message ?? `PATCH ${url} failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}

export const practiceSessionService = {
    create: async (payload: CreateSessionDTO): Promise<{ id: string }> =>
        apiClient.post<{ id: string }, CreateSessionDTO>(BASE, payload),

    getById: async (sessionId: string): Promise<PracticeSessionDto> =>
        apiClient.get<PracticeSessionDto>(`${BASE}/${sessionId}`),

    submit: async (
        payload: PracticeSessionSubmitDTO
    ): Promise<{ sessionId: string }> =>
        apiClient.post<{ sessionId: string }, PracticeSessionSubmitDTO>(
            `${BASE}/submit`,
            payload
        ),

    patchStatus: async (
        sessionId: string,
        status: PracticeStatus
    ): Promise<UpdateStatusResponse> =>
        patchJson<UpdateStatusResponse>(`${BASE}/${sessionId}/status`, { status }),

    getActive: async (
        learnerId: string,
        patientId: string
    ): Promise<ActiveSessionResponse | null> => {
        try {
            return await apiClient.get<ActiveSessionResponse>(
                `${BASE}/active?learnerId=${encodeURIComponent(learnerId)}&patientId=${encodeURIComponent(patientId)}`
            );
        } catch {
            return null;
        }
    },

    getClinicalCases: async (params: {
        status?: string;
        page?: number;
        pageSize?: number;
    }): Promise<unknown> => {
        const q = new URLSearchParams();
        if (params.status) q.append('status', params.status);
        if (params.page) q.append('page', String(params.page));
        if (params.pageSize) q.append('pageSize', String(params.pageSize));
        return apiClient.get(`${BASE}/clinical-cases?${q.toString()}`);
    },
};