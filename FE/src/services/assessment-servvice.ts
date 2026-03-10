import { MOCK_ASSESSMENTS } from "@/src/data/assessmentData";
import { AssessmentData } from "@/src/types/assessment";

export const getAssessmentById = async (id: string): Promise<AssessmentData | undefined> => {
    if (!id) return undefined;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanId = id.trim(); 
    const assessment = MOCK_ASSESSMENTS.find((a) => a.id === cleanId);

    return assessment;
};