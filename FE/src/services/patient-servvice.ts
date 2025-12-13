import { MOCK_PATIENTS } from "@/src/data/mockData";
import { PatientData } from "@/src/types/practice";

export const getPatientById = async (id: string): Promise<PatientData | undefined> => {
    if (!id) return undefined;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanId = id.trim(); 
    const patient = MOCK_PATIENTS.find((p) => p.id === cleanId);

    return patient;
};