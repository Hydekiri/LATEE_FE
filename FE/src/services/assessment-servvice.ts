import { MOCK_ASSESSMENTS } from "@/src/data/assessmentData";
import { AssessmentData, AssessmentFullDetails } from "@/src/types/assessment";
import { ApiClient } from "@/src/utils/api-client";
import { AssessmentAttempt } from "@/src/types/assessment";

export const getAssessmentById = async (id: string): Promise<AssessmentData | undefined> => {
    if (!id) return undefined;

    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanId = id.trim(); 
    const assessment = MOCK_ASSESSMENTS.find((a) => a.assessmentId === cleanId);

    return assessment;
};

export const createAssessment = async (payload: Partial<AssessmentData>): Promise<AssessmentData> => {
    const res = await ApiClient.post('/assessments', payload);
    return res.data;
};


export const generateAIQuestions = async (id: string, customPrompt: string = ""): Promise<{ message: string }> => {
    const res = await ApiClient.post(`/assessments/${id}/generate-questions`, { customPrompt });
    return res.data;
};

export const getAssessmentDetails = async (id: string): Promise<AssessmentFullDetails> => {
    const res = await ApiClient.get(`/assessments/${id}`);
    return res.data;
};

interface SubmitPayload {
    attemptId: string;
    answers: Record<string, string | string[]>;
}

export const submitAssessmentAttempt = async (payload: SubmitPayload): Promise<AssessmentAttempt> => {
    const res = await ApiClient.post('/assessments/submit', payload);
    return res.data;
};