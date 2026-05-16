export interface EpaScoreResponse {
    id: string;
    evaluationId: string;
    epaId: string;
    numericalScore: number;
    entrustmentLevel: number;
    feedbackDetail: string;
    evidenceCited: string[] | null;
    failurePatterns: string[] | null;
    safetyFlags: string[] | null;
    createdAt: string;
}

export interface EvaluationReportResponse {
    evaluationId: string;
    epaId: string;
    practiceSessionId: string;
    learnerId: string;
    patientId: string;
    moduleId: string;
    discussionType: string;
    finalDiagnosis: string;
    vpConversationLog: {
        messages: Array<{ role: string; content: string }>;
    };
    aiReasoningLog: {
        steps: Array<{ step: number; content: string }>;
    };
    score: number;
    duration: number;
    feedbackDetail: string;
    entrustmentLevel: number;
    createdAt: string;
    warnings: Array<{
        warningId: string;
        label: string;
        description: string;
    }>;
    epaScores?: EpaScoreResponse[];
    practiceFeedback?: PracticeFeedbackResponse | null;
}

export interface PracticeFeedbackResponse {
    practiceSessionId: string;
    wasCached: boolean;
    feedbackDetail: string;
    strengths: string[];
    improvements: string[];
}

export interface EvaluationHistoryItem {
    evaluationId: string;
    practiceSessionId: string;
    score: number;
    createdAt: string;
}

export interface ResultsTabData {
    resultId: string;
    finalScore: number;
    finalDiagnosis: string;
    discussionType: string;
    duration: string;
    entrustmentLevel: number;
    evaluation: string;
    epaScores: ResultsEpaScore[];
}

export interface ResultsEpaScore {
    scoreId: string;
    epaId: string;
    title: string;
    numericalScore: number;
    maxScore: number;
    feedbackDetail: string;
}

export interface EvaluationTabData {
    overallAttempt: string;
    overallLabel: string;
    strength: string;
    improvements: string;
    epaScores: ResultsEpaScore[];
}