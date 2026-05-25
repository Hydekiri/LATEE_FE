


interface LabTestItemJoined {
    id: number;
    itemId: number;
    label: string;
    fluid: string;
    category: 'Blood Gas' | 'Chemistry' | 'Hematology';
    value: string;
    rangeLower: string;
    rangeUpper: string;
}

interface RadiologyReportEntity {
    id: number;
    noteId: string;
    modality: 'CT' | 'Ultrasound' | 'Radiograph' | 'Drainage' | 'MRI' | 'MRCP' | 'ERCP';
    region: string;
    examName: string;
    text: string;
}

export interface ClinicalCaseEntity {
    caseId: string;
    title: string;
    description: string;
    caseType: string;
    status: string;
    pe: string;
    symptom: string;
    medicalHistory: string;
    createdBy: string;
    createdByName?: string;
    eccId: string;
    createdAt: string;
    updatedAt: string;
    virtualPatientCount?: number;
    attemptCount?: number;
    avgScore?: number;
}

export interface VPCaseSummary {
    patientId: string;
    name: string;
    age: number;
    gender: string;
    level: string;
    status: string;
}

export interface ClinicalStats {
    totalAttempts: number;
    avgScore: number;
    completionRate: number;
}

export interface CompleteClinicalCaseSchema {
    caseId: string;
    title: string;
    description: string;
    caseType: string;
    status: string;
    pe: string;
    symptom: string;
    medicalHistory: string;
    createdBy: string;
    createdByName?: string;
    eccId: string;
    createdAt: string;
    updatedAt: string;
    virtualPatientCount?: number;
    attemptCount?: number;
    avgScore?: number;
    labs: LabTestItemJoined[];
    radiology: RadiologyReportEntity[];
    virtualPatients: VPCaseSummary[];
    stats: ClinicalStats;
}