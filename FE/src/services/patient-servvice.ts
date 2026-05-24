import { clientApi, serverApi } from '@/src/utils/api-client';
import {
    PatientData,
    Expert,
    VitalSigns,
    PatientInstructions,
    CaseRules,
    AttemptCountData,
} from '@/src/types/practice';
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

interface PaginatedRawResponse {
    items: PatientApiResponse[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface PatientQueryOptions {
    readonly search?: string;
    readonly level?: string;
    readonly gender?: string;
    readonly occupation?: string;
    readonly sortBy?: string;
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

    const safeInstructions: PatientInstructions = {
        ...instructions,
        procedure: instructions.procedure ?? [],
        task: instructions.task || 'Take a focused clinical history from this patient.',
    };

    const experts: Expert[] = (item.experts ?? []).map((e: RawExpert) => ({
        expertId: e.expertId,
        name: e.name,
        role: e.role ?? e.titlePosition ?? 'Expert',
        img: e.avatarUrl ?? e.img ?? '/images/doctor1.png',
        bio: e.bioQuote,
        education: e.educationDetail,
        skills: e.expertiseSkill
            ? e.expertiseSkill.split(',').map((s) => s.trim())
            : [],
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
        instructions: safeInstructions,
        caseRules: {
            rules: item.caseRule?.rules ?? [],
            totalTime:
                item.caseRule?.totalTime ?? `${timeSetting + argumentTime} min`,
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
        pageSize = 9,
        options: PatientQueryOptions = {}
    ): Promise<PaginatedResponse<PatientData>> {
        const q = new URLSearchParams();
        q.set('page', String(page));
        q.set('pageSize', String(pageSize));
        if (options.gender) q.set('gender', options.gender);
        if (options.level) q.set('level', options.level);
        if (options.search) q.set('search', options.search);
        if (options.occupation) q.set('occupation', options.occupation);
        if (options.sortBy) q.set('sortBy', options.sortBy);

        try {
            const response = await serverApi.get<PaginatedRawResponse>(
                `/virtual-patient/api/virtual-patients?${q.toString()}`
            );
            return {
                ...response,
                items: response.items.map(mapRawToPatientData),
            };
        } catch (error) {
            console.error('[PATIENT SERVICE ERROR] getVirtualPatients', error);
            return { items: [], total: 0, page, pageSize, totalPages: 0 };
        };
    },

    async getVirtualPatientById(id: string): Promise<PatientData> {
        try {
            const item = await serverApi.get<PatientApiResponse>(
                `/virtual-patient/api/virtual-patients/${id}`
            );
            return mapRawToPatientData(item);
        } catch (error) {
            console.error('[PATIENT SERVICE ERROR] getVirtualPatientById', { id, error });
            throw error;
        }
    },

    async getAttemptCount(
        learnerId: string,
        patientId: string
    ): Promise<AttemptCountData> {
        return clientApi.get<AttemptCountData>(
            `/practice-session/api/practice-sessions/attempt-count?learnerId=${encodeURIComponent(learnerId)}&patientId=${encodeURIComponent(patientId)}`
        );
    },
};

export async function getPatientById(id: string): Promise<PatientData> {
    return patientService.getVirtualPatientByIdServer(id);
}