// src/services/evaluation-service.ts
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import {
    EvaluationReportResponse,
    EvaluationHistoryItem,
    PracticeFeedbackResponse,
    ResultsTabData,
    EvaluationTabData,
    ResultsEpaScore,
    EpaScoreResponse,
} from '@/src/types/evaluation';

const EPA_TITLES: Record<string, string> = {
    EPA_1: 'Information Gathering',
    EPA_2: 'Diagnosis Reasoning & Differential Diagnosis',
    EPA_3: 'Diagnosis Testing',
    EPA_4: 'Management Plan & Safe Order Entry',
    EPA_5: 'Communication & Professionalism',
    'EPA-001': 'Information Gathering',
};

function getAuthHeaders(): HeadersInit {
    const token = getCookie('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export function mapEvaluationReportToResultsData(
    report: EvaluationReportResponse
): ResultsTabData {
    const epaScores: ResultsEpaScore[] = (report.epaScores ?? []).map(
        (epa: EpaScoreResponse) => ({
        scoreId: epa.id,
        epaId: epa.epaId,
        title: EPA_TITLES[epa.epaId] ?? epa.epaId,
        numericalScore: epa.numericalScore,
        maxScore: 20,
        feedbackDetail: epa.feedbackDetail ?? '',
        })
    );

    const fallbackEpaScores: ResultsEpaScore[] =
        epaScores.length === 0
        ? [
            {
                scoreId: report.evaluationId,
                epaId: report.epaId,
                title: EPA_TITLES[report.epaId] ?? 'Overall Evaluation',
                numericalScore: Math.round((report.score / 100) * 20),
                maxScore: 20,
                feedbackDetail: report.feedbackDetail,
            },
            ]
        : epaScores;

    return {
        resultId: report.evaluationId,
        finalScore: report.score,
        finalDiagnosis: report.finalDiagnosis,
        discussionType: report.discussionType,
        duration: `${report.duration} min`,
        entrustmentLevel: report.entrustmentLevel,
        evaluation: report.feedbackDetail,
        epaScores: fallbackEpaScores,
    };
}

export function mapToEvaluationTabData(
    feedback: PracticeFeedbackResponse,
    report: EvaluationReportResponse
): EvaluationTabData {
    const epaScores: ResultsEpaScore[] = (report.epaScores ?? []).map(
        (epa: EpaScoreResponse) => ({
        scoreId: epa.id,
        epaId: epa.epaId,
        title: EPA_TITLES[epa.epaId] ?? epa.epaId,
        numericalScore: epa.numericalScore,
        maxScore: 20,
        feedbackDetail: epa.feedbackDetail ?? '',
        })
    );

    return {
        overallAttempt: feedback.feedbackDetail,
        overallLabel: report.score >= 80 ? 'Qualified' : report.score >= 60 ? 'Partially qualified' : 'Not yet qualified',
        strength: feedback.strengths.join('\n'),
        improvements: feedback.improvements.join('\n'),
        epaScores,
    };
    }

export const evaluationService = {
    async getReport(evaluationId: string): Promise<EvaluationReportResponse> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/evaluation/${evaluationId}/report`,
        { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error(`Failed to fetch evaluation report: ${res.status}`);
        return res.json() as Promise<EvaluationReportResponse>;
    },

    async generatePracticeFeedback(
        practiceSessionId: string
    ): Promise<PracticeFeedbackResponse> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/evaluation/practice-feedback/${practiceSessionId}`,
        { method: 'POST', headers: getAuthHeaders(), body: '{}' }
        );
        if (!res.ok) throw new Error(`Failed to generate feedback: ${res.status}`);
        const json = await res.json() as { data: PracticeFeedbackResponse };
        return json.data;
    },

    async getHistory(userId: string): Promise<EvaluationHistoryItem[]> {
        const res = await fetch(
        `${API_BASE_URL}/evaluation/api/evaluation/${userId}/history`,
        { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error(`Failed to fetch evaluation history: ${res.status}`);
        return res.json() as Promise<EvaluationHistoryItem[]>;
    },
};