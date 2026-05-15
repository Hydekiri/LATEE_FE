// src/types/practice.ts

export interface Expert {
    name: string;
    role: string;
    img: string;
}

export interface VitalSigns {
    bp: string;
    hr: number;
    spo2?: string | number; 
    rr?: number;
    temp?: string;
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
    instructions: {
        role: string;
        task: string;
        procedure: string[];
    };
    caseRules: {
        rules: string[];
        totalTime: string;
        timeBreakdown: string[];
    };

    learningObjectives: string[];
    experts: Expert[];
}