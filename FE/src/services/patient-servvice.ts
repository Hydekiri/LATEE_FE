import { apiClient } from '@/src/utils/api-client';
import { PatientData, Expert, VitalSigns, PatientInstructions, CaseRules } from '@/src/types/practice';
import { PaginatedResponse } from '@/src/types/api';


interface RawExpert {
    expertId?: string;
    name: string;
    role?: string;
    titlePosition?: string;
    avatarUrl?: string | null;
    img?: string;
    bioQuote?: string;
    educationDetail?: string;
    expertiseSkill?: string;
    phone?: string;
    email?: string;
    location?: string;
}

interface PatientApiResponse {
    patientId: string;
    caseId: string;
    name: string;
    age: number;
    gender: string;
    pronouns?: string;
    ethnicity?: string;
    occupation?: string;
    avatarImage: string | null;
    level: string;
    timeSetting: number;
    argumentTime?: number;
    createdAt: string;
    feedbackCount?: number;
    medicalHistory: string;
    chiefConcern: string;
    timesPracticed?: number;
    vitalSigns: VitalSigns;
    instructions: PatientInstructions | null;
    learningObjectives: string[];
    experts?: RawExpert[];
    caseRule?: {
        rules: string[];
        totalTime?: string;
        timeBreakdown?: string[];
    } | null;
    symptom?: string;
}


function mapRawToPatientData(item: PatientApiResponse): PatientData {
    const timeSetting = item.timeSetting || 30;
    const argumentTime = item.argumentTime || 15;

    const instructions: PatientInstructions = item.instructions ?? {
        role: 'Medical Learner',
        task: 'Take a focused clinical history from this patient.',
        tone: 'Professional',
        procedure: [
        'Introduce yourself',
        'Take a focused history',
        'Identify key findings',
        'Formulate a differential diagnosis',
        ],
    };

    if (!instructions.procedure) {
        instructions.procedure = [];
    }
    if (!instructions.task) {
        instructions.task = 'Take a focused clinical history from this patient.';
    }

    const experts: Expert[] = (item.experts ?? []).map((e: RawExpert) => ({
        expertId: e.expertId,
        name: e.name,
        role: e.role ?? e.titlePosition ?? 'Expert',
        img: e.avatarUrl ?? e.img ?? '/images/doctor1.png',
        bio: e.bioQuote,
        education: e.educationDetail,
        skills: e.expertiseSkill ? e.expertiseSkill.split(',').map((s) => s.trim()) : [],
        phone: e.phone,
        email: e.email,
        location: e.location,
    }));

    return {
        id: item.patientId,
        caseId: item.caseId,
        name: item.name,
        age: item.age,
        gender: item.gender,
        pronouns: item.pronouns ?? 'N/A',
        ethnicity: item.ethnicity ?? 'N/A',
        occupation: item.occupation ?? 'N/A',
        setting: 'Clinic',
        img: item.avatarImage || '/images/VP7.jpeg',
        level: item.level,
        time: `${timeSetting} min`,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
        feedback: item.feedbackCount ?? 0,
        timesPracticed: item.timesPracticed ?? 0,
        description: item.medicalHistory || '',
        chiefConcern: item.chiefConcern || '',
        vitalSigns: item.vitalSigns ?? { bp: 'N/A', hr: 0 },
        instructions,
        caseRules: {
        rules: item.caseRule?.rules ?? [],
        totalTime: item.caseRule?.totalTime ?? `${timeSetting + argumentTime} min`,
        timeBreakdown: item.caseRule?.timeBreakdown ?? [
            `${timeSetting} minutes for patient interaction`,
            `${argumentTime} minutes for explanation and reasoning`,
        ],
        },
        learningObjectives: item.learningObjectives ?? [],
        experts,
    };
}


export const patientService = {
    async getVirtualPatients(
        page = 1,
        pageSize = 9
    ): Promise<PaginatedResponse<PatientData>> {
        const response = await apiClient.get<PaginatedResponse<PatientApiResponse>>(
        `/virtual-patient/api/virtual-patients?page=${page}&pageSize=${pageSize}`
        );
        return {
        ...response,
        items: response.items.map(mapRawToPatientData),
        };
    },

    async getVirtualPatientById(id: string): Promise<PatientData> {
        const item = await apiClient.get<PatientApiResponse>(
        `/virtual-patient/api/virtual-patients/${id}`
        );
        return mapRawToPatientData(item);
    },
};


export async function getPatientById(id: string): Promise<PatientData> {
    return patientService.getVirtualPatientById(id);
}