// src/features/practice/components/subComponents/types/submition.ts
export interface EPAScore {
    scoreId: string;
    epaId: string;
    title: string;
    numericalScore: number; 
    maxScore: number;
    feedbackDetail: string; 
}

export interface EvaluationResultData {
    resultId: string;
    finalScore: number;
    correctAnswer: string;
    caseType: string;
    discussionType: string;
    duration: string;
    evaluation: string;
    epaScores: EPAScore[]; 
}