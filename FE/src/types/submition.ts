export interface EvaluationWarningDTO {
    warningId: string;
    label: string;
    description: string;
}

export interface PracticeSessionResultDTO {
    resultId: string;
    userId: string;
    clinicalCaseId: string;
    moduleId: 'EPA_STANDARD_V1';

    vpConversationLog: any[];
    aiReasoningLog: any[];

    finalDiagnosis: string;
    overallScore: number;

    warnings: EvaluationWarningDTO[];
}