export interface EvaluationWarningDTO {
    warningId: string;
    label: string;
    description: string;
}

export interface VpConversationMessage {
    role: 'learner' | 'patient' | 'doctor' | 'system';
    content: string;
}

export interface AiReasoningStep {
    step: number;
    content: string;
}

export interface PracticeSessionResultDTO {
    resultId: string;
    userId: string;
    clinicalCaseId: string;
    moduleId: string;
    vpConversationLog: VpConversationMessage[];
    aiReasoningLog: AiReasoningStep[];
    finalDiagnosis: string;
    overallScore: number;
    warnings: EvaluationWarningDTO[];
}

export interface PracticeSessionSubmitDTO {
    sessionId: string;
    learnerId: string;
    finalDiagnosis: string;
    vpConversationLog: { messages: VpConversationMessage[] };
    aiReasoningLog: { steps: AiReasoningStep[] };
    moduleId: string;
    discussionType: string;
    guidelinesId: string | null;
    warnings: EvaluationWarningDTO[];
}