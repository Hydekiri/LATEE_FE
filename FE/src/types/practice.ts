// src/types/practice.ts

export interface Expert {
    expertId?: string;       
    name: string;
    role: string;
    img: string;
    bio?: string;               
    education?: string;        
    skills?: string[];         
    phone?: string;            
    email?: string;            
    location?: string;         
}

export interface VitalSigns {
    bp: string;
    hr: number;
    spo2?: string | number;
    rr?: number;
    temp?: string | number;
}

export interface PatientInstructions {
    role: string;
    task: string;
    tone?: string;
    procedure: string[];
}

export interface CaseRules {
    rules: string[];
    totalTime: string;
    timeBreakdown: string[];
}

export interface PatientData {
    id: string;
    caseId: string;
    img: string;
    name: string;
    age: number;
    gender: string;
    pronouns?: string;
    ethnicity?: string;
    occupation?: string;
    setting?: string;
    level: string;
    time: string;
    date: string;
    feedback: number;
    timesPracticed: number;
    description: string;
    chiefConcern: string;
    vitalSigns: VitalSigns;
    instructions: PatientInstructions;
    caseRules: CaseRules;
    timeSetting?: number;
    argumentTime?: number;
    learningObjectives: string[];
    experts: Expert[];
}