// src/services/evaluation-service.ts

import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import {
    EvaluationReportResponse,
    EvaluationHistoryItem,
    PracticeFeedbackResponse,
    PracticeHistoryResponse,
    ResultsTabData,
    ResultsEpaScore,
    EvaluationTabData,
    EpaScoreResponse,
    DiagnosisMatchType,
} from '@/src/types/evaluation';

const EPA_TITLES: Record<string, string> = {
    EPA_1: 'EPA_1: History Taking',
    EPA_2: 'EPA_2: Diagnostic Reasoning & Differential Diagnosis',
    EPA_3: 'EPA_3: Diagnostic Testing',
    EPA_4: 'EPA_4: Management Plan & Safe Order Entry',
    EPA_5: 'EPA_5: Communication & Professionalism',
    'EPA-001': 'EPA-001: History Taking',
};

function getEpaTitle(epaId: string): string {
    return EPA_TITLES[epaId] ?? epaId;
}

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
            scoreId: epa.id ?? `${epa.epaId}_${report.evaluationId}`,
            epaId: epa.epaId,
            title: getEpaTitle(epa.epaId),
            numericalScore: epa.numericalScore,
            maxScore: epa.maxScore,
            feedbackDetail: epa.feedbackDetail ?? '',
            evidenceCited: epa.evidenceCited ?? undefined,
            failurePatterns: epa.failurePatterns ?? undefined,
            safetyFlags: epa.safetyFlags ?? undefined,
            entrustmentLevel: epa.entrustmentLevel,
        })
    );

    const resolvedEpaScores: readonly ResultsEpaScore[] =
        epaScores.length > 0
            ? epaScores
            : [
                {
                    scoreId: report.evaluationId,
                    epaId: report.epaId,
                    title: getEpaTitle(report.epaId),
                    numericalScore: Math.round((report.score / 100) * 20),
                    maxScore: 20,
                    feedbackDetail: report.feedbackDetail ?? '',
                },
            ];

    return {
        resultId: report.evaluationId,
        finalScore: report.score,
        finalDiagnosis: report.finalDiagnosis,
        discussionType: report.discussionType,
        durationMinutes: report.duration,
        entrustmentLevel: report.entrustmentLevel,
        feedbackDetail: report.feedbackDetail ?? '',
        diagnosisMatchType: report.diagnosisMatchType,
        epaScores: resolvedEpaScores,
        pureEpaScore: report.pureEpaScore,
        rubricVersion: report.rubricVersion,
        warnings: report.warnings,
    };
}

export function mapToEvaluationTabData(
    feedback: PracticeFeedbackResponse,
    report: EvaluationReportResponse
): EvaluationTabData {
    const epaScores: ResultsEpaScore[] = (report.epaScores ?? []).map(
        (epa: EpaScoreResponse) => ({
            scoreId: epa.id ?? `${epa.epaId}_${report.evaluationId}`,
            epaId: epa.epaId,
            title: getEpaTitle(epa.epaId),
            numericalScore: epa.numericalScore,
            maxScore: epa.maxScore,
            feedbackDetail: epa.feedbackDetail ?? '',
            entrustmentLevel: epa.entrustmentLevel,
        })
    );

    const overallLabel =
        feedback.overallLabel ??
        (report.score >= 80
            ? 'Qualified'
            : report.score >= 60
                ? 'Partially qualified'
                : 'Not yet qualified');

    const improvementText =
        feedback.improvement ??
        (feedback.improvements ? feedback.improvements.join('\n') : '');

    const strengthText =
        feedback.strength ??
        (feedback.strengths ? feedback.strengths.join('\n') : '');

    return {
        overallAttempt: feedback.overallAttempt,
        overallLabel,
        strength: strengthText,
        improvements: improvementText,
        epaScores,
    };
}

export const evaluationService = {
    async getReport(evaluationId: string): Promise<EvaluationReportResponse> {
        const res = await fetch(
            `${API_BASE_URL}/evaluation/api/evaluation/${evaluationId}/report`,
            { headers: getAuthHeaders() }
        );
        if (!res.ok)
            throw new Error(`Failed to fetch evaluation report: ${res.status}`);
        return res.json() as Promise<EvaluationReportResponse>;
    },

    async generatePracticeFeedback(
        practiceSessionId: string
    ): Promise<PracticeFeedbackResponse> {
        const res = await fetch(
            `${API_BASE_URL}/evaluation/api/evaluation/practice-feedback/${practiceSessionId}`,
            { method: 'POST', headers: getAuthHeaders(), body: '{}' }
        );
        if (!res.ok)
            throw new Error(`Failed to generate feedback: ${res.status}`);
        const json = (await res.json()) as { data: PracticeFeedbackResponse };
        return json.data;
    },

    async getCachedPracticeFeedback(
        practiceSessionId: string
    ): Promise<PracticeFeedbackResponse | null> {
        try {
            const res = await fetch(
                `${API_BASE_URL}/evaluation/api/evaluation/practice-feedback/${practiceSessionId}`,
                { method: 'GET', headers: getAuthHeaders() }
            );
            if (!res.ok) return null;
            const json = (await res.json()) as {
                data: PracticeFeedbackResponse | null;
            };
            return json.data;
        } catch {
            return null;
        }
    },

    async getPracticeHistory(
        learnerId: string,
        patientId: string
    ): Promise<PracticeHistoryResponse> {
        const res = await fetch(
            `${API_BASE_URL}/evaluation/api/evaluation/practice-history?learnerId=${encodeURIComponent(learnerId)}&patientId=${encodeURIComponent(patientId)}`,
            { headers: getAuthHeaders() }
        );
        if (!res.ok)
            throw new Error(`Failed to fetch practice history: ${res.status}`);
        return res.json() as Promise<PracticeHistoryResponse>;
    },

    async getHistory(userId: string): Promise<EvaluationHistoryItem[]> {
        const res = await fetch(
            `${API_BASE_URL}/evaluation/api/evaluation/${userId}/history`,
            { headers: getAuthHeaders() }
        );
        if (!res.ok)
            throw new Error(`Failed to fetch evaluation history: ${res.status}`);
        return res.json() as Promise<EvaluationHistoryItem[]>;
    },
};