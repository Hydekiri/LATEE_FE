import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';

export type IssueStatus = 'Open' | 'InReview' | 'Resolved' | 'Rejected';

export interface IssueExpertFeedback {
    expertId: string;
    expertName: string;
    feedback: string;
}

export interface IssueItem {
    issueId: string;
    learnerId: string;
    learnerName: string;
    createdAt: string;
    label: string;
    description: string;
    status: IssueStatus;
    expertFeedback: IssueExpertFeedback | null;
}

export interface CreateIssueDTO {
    practiceSessionId: string;
    learnerId: string;
    label: string;
    description: string;
    itemType: 'Practice';
}

export interface UpdateIssueDTO {
    description: string;
}

function getAuthHeaders(): HeadersInit {
    const token = getCookie('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export const issueService = {
    async getIssuesBySession(practiceSessionId: string): Promise<IssueItem[]> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/issues?practiceSessionId=${practiceSessionId}`,
        { headers: getAuthHeaders() }
        );
        if (!res.ok) {
        if (res.status === 404 || res.status === 501) return [];
        throw new Error(`Failed to fetch issues: ${res.status}`);
        }
        const json = await res.json() as { items: IssueItem[] };
        return json.items ?? [];
    },

    async createIssue(dto: CreateIssueDTO): Promise<IssueItem> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/issues`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        }
        );
        if (!res.ok) throw new Error(`Failed to create issue: ${res.status}`);
        return res.json() as Promise<IssueItem>;
    },

    async updateIssue(issueId: string, dto: UpdateIssueDTO): Promise<IssueItem> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/issues/${issueId}`,
        {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        }
        );
        if (!res.ok) throw new Error(`Failed to update issue: ${res.status}`);
        return res.json() as Promise<IssueItem>;
    },

    async deleteIssue(issueId: string): Promise<void> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/issues/${issueId}`,
        { method: 'DELETE', headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error(`Failed to delete issue: ${res.status}`);
    },
};