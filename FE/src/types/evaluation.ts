export type DiagnosisMatchType =
    | 'EXACT_MATCH'
    | 'PARTIAL_MATCH'
    | 'WRONG'
    | 'MATCH'       
    | 'PARTIAL'     
    | string;       

export interface DiagnosisMatchDetail {
    readonly matchType: DiagnosisMatchType;
    readonly matchTypeLabel: string;
    readonly isAcceptable: boolean;
    readonly isDangerous: boolean;
    readonly requiresSafetyReview: boolean;
}

export interface EpaScoreResponse {
    readonly id?: string;
    readonly evaluationId?: string;
    readonly epaId: string;
    readonly numericalScore: number;
    readonly maxScore: number;
    readonly entrustmentLevel: number;
    readonly feedbackDetail: string;
    readonly evidenceCited: readonly string[] | null;
    readonly failurePatterns: readonly string[] | null;
    readonly safetyFlags: readonly string[] | null;
    readonly createdAt?: string;
}

export interface AdjustmentItem {
    readonly code: string;
    readonly title: string;
    readonly score: number;
    readonly reason: string;
    readonly source: string;
    readonly severity: string;
}

export interface AdjustmentValidation {
    readonly hasEthicsViolation: boolean;
    readonly hasUnsafeQuestion: boolean;
    readonly hasWorkflowViolation: boolean;
    readonly safetyEscalationRequired: boolean;
    readonly totalWarnings: number;
}

export interface AdjustmentsBlock {
    readonly positive: readonly AdjustmentItem[];
    readonly negative: readonly AdjustmentItem[];
    readonly validation: AdjustmentValidation;
}

export interface EvaluationWarning {
    readonly warningId: string;
    readonly practiceSessionId?: string;
    readonly learnerId?: string;
    readonly label: string;
    readonly description: string;
    readonly createdAt?: string;
}

export interface PracticeFeedbackResponse {
    readonly id?: string;
    readonly practiceSessionId?: string;
    readonly evaluationId?: string;
    readonly wasCached?: boolean;
    readonly overallAttempt: string;
    readonly overallLabel: string;
    readonly strength: string;
    readonly improvement?: string;
    readonly improvements?: readonly string[];
    readonly strengths?: readonly string[];
    readonly feedbackDetail?: string;
    readonly createdAt?: string;
}

export interface EvaluationReportResponse {
    readonly evaluationId: string;
    readonly epaId: string;
    readonly practiceSessionId: string;
    readonly learnerId: string;
    readonly patientId: string;
    readonly moduleId: string;
    readonly discussionType: string;
    readonly finalDiagnosis: string;
    readonly vpConversationLog: string | null;
    readonly aiReasoningLog: string | null;
    readonly score: number;
    readonly duration: number;
    readonly entrustmentLevel: number;
    readonly rubricVersion: string;
    readonly pureEpaScore: number;
    readonly positiveAdjustmentTotal?: number;
    readonly negativeAdjustmentTotal?: number;
    readonly adjustmentTotal?: number;
    readonly diagnosisMatch: DiagnosisMatchDetail | null;
    readonly diagnosisMatchType: DiagnosisMatchType;
    readonly diagnosisModifier?: number;
    readonly timeModifier?: number;
    readonly warningPenalty?: number;
    readonly safetyEscalationRequired?: boolean;
    readonly cognitiveAlerts?: readonly string[];
    readonly epaScores: readonly EpaScoreResponse[];
    readonly adjustments?: AdjustmentsBlock;
    readonly createdAt: string;
    readonly warnings?: readonly EvaluationWarning[];
    readonly practiceFeedback?: PracticeFeedbackResponse | null;
    readonly feedbackDetail?: string;
    readonly evaluationTrace?: unknown;
}

export interface PracticeHistoryItem {
    readonly practiceSessionId: string;
    readonly evaluationId: string | null;
    readonly score: number | null;
    readonly pureEpaScore: number | null;
    readonly entrustmentLevel: number | null;
    readonly finalDiagnosis: string;
    readonly duration: number | null;
    readonly diagnosisMatch: DiagnosisMatchDetail | null;
    readonly rubricVersion: string | null;
    readonly createdAt: string;
    readonly status: string;
    readonly feedbackId: string | null;
}

export interface PracticeHistoryResponse {
    readonly learnerId: string;
    readonly patientId: string;
    readonly items: readonly PracticeHistoryItem[];
}

export interface ResultsEpaScore {
    readonly scoreId: string;
    readonly epaId: string;
    readonly title: string;
    readonly numericalScore: number;
    readonly maxScore: number;
    readonly feedbackDetail: string;
    readonly evidenceCited?: readonly string[];
    readonly failurePatterns?: readonly string[];
    readonly safetyFlags?: readonly string[];
    readonly entrustmentLevel?: number;
}

export interface ResultsTabData {
    readonly resultId: string;
    readonly finalScore: number;
    readonly finalDiagnosis: string;
    readonly discussionType: string;
    readonly durationMinutes: number;
    readonly entrustmentLevel: number;
    readonly feedbackDetail: string;
    readonly diagnosisMatchType: DiagnosisMatchType;
    readonly epaScores: readonly ResultsEpaScore[];
    readonly pureEpaScore?: number;
    readonly rubricVersion?: string;
    readonly warnings?: readonly EvaluationWarning[];
}

export interface EvaluationHistoryItem {
    readonly evaluationId: string;
    readonly practiceSessionId: string;
    readonly score: number;
    readonly entrustmentLevel?: number;
    readonly rubricVersion?: string;
    readonly createdAt: string;
}

export interface EvaluationTabData {
    readonly overallAttempt: string;
    readonly overallLabel: string;
    readonly strength: string;
    readonly improvements: string;
    readonly epaScores: readonly ResultsEpaScore[];
}