import { apiClient } from "@/src/utils/api-client";
import { PatientData } from "@/src/types/practice";
import { Expert } from "@/src/types/practice";
import { PaginatedResponse } from "@/src/types/api";


interface PatientApiResponse {
    patientId: string;
    caseId: string;
    name: string;
    age: number;
    gender: string;
    avatarImage: string | null;
    level: string;
    timeSetting: number;
    createdAt: string;
    feedbackCount?: number;
    medicalHistory: string;
    chiefConcern: string;
    timesPracticed: number;
    vitalSigns: PatientData['vitalSigns'];
    instructions: PatientData['instructions'];
    learningObjectives: string[];
    experts: Expert[];
    caseRule?: {
        rules: string[];
    };
    argumentTime?: number;
}

export const patientService = {
    getVirtualPatients: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<PatientData>> => {
        const response = await apiClient.get<PaginatedResponse<PatientApiResponse>>(
            `/virtual-patient/api/virtual-patients?page=${page}&pageSize=${pageSize}`
        );
        
        return {
            ...response,
            items: response.items.map((item: PatientApiResponse): PatientData => ({
                id: item.patientId,
                caseId: item.caseId,
                name: item.name,
                age: item.age,
                gender: item.gender,
                img: item.avatarImage || "/images/VP7.jpeg",
                level: item.level,
                time: `${item.timeSetting || 30} min`,
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
                feedback: item.feedbackCount || 0,
                description: item.medicalHistory || "",
                chiefConcern: item.chiefConcern || "",
                timesPracticed: item.timesPracticed || 0,
                vitalSigns: item.vitalSigns,
                instructions: item.instructions,
                caseRules: {
                    rules: item.caseRule?.rules || [],
                    totalTime: `${item.timeSetting || 30} min`,
                    timeBreakdown: [
                        `${item.timeSetting || 30} minutes for patient interaction`,
                        `${item.argumentTime || 15} minutes for explanation and reasoning`
                    ]
                },
                learningObjectives: item.learningObjectives || [],
                experts: item.experts || [],
                pronouns: "N/A", 
                ethnicity: "N/A",
                setting: "Clinic",
                occupation: "N/A"
            }))
        };
    }
};