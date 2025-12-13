export interface Expert {
    name: string;
    role: string;
    img: string;
}

export interface PatientData {
    id: string;
    caseId: string;
    img: string;
    name: string;
    age: number;
    gender: string;
    pronouns: string;
    ethnicity: string;
    setting: string;
    level: string;
    time: string;
    occupation: string;
    description: string;
    chiefConcern: string;
    date: string;
    feedback: number;
    timesPracticed: number;
    
    vitalSigns: {
        bp: string;
        hr: number;
        spo2: number;
        rr: number;
        temp: string;
    };
    
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