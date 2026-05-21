export interface LearnerLog {
    name: string;
    email: string;
    lastPractice: string;
    evalScore: number;
    entrustment: string;
    roadmap: string;
    risk: 'Low' | 'Medium' | 'High';
}

export interface IssueItem {
    id: string;
    user: string;
    itemType: ItemType;
    contextId: string;
    content: string;
    status: IssueStatus;
    date: string;
    isPublic: boolean;
    expertReply: string | null;
}

export interface LearnerLog {
    name: string;
    email: string;
    lastPractice: string;
    evalScore: number;
    entrustment: string;
    roadmap: string;
    risk: 'Low' | 'Medium' | 'High';
}

export interface IssueItem {
    id: string;
    user: string;
    itemType: ItemType;
    contextId: string; 
    content: string;
    status: IssueStatus;
    date: string;
    isPublic: boolean;
    expertReply: string | null;
}

export type IssueStatus = 'Open' | 'InReview' | 'Resolved' | 'Rejected';
export type ItemType = 'Assessment' | 'Practice';

export type PatientLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type PatientStatus = 'active' | 'inactive';

export interface VitalSignsSchema {
    bp: string;
    hr: number;
    temp: number;
    spo2: string;
    rr: number;
}

export interface VirtualPatientEntity {
    patientId: string;         // patient_id VARCHAR(50)
    caseId: string;            // case_id VARCHAR(50)
    name: string;              // name VARCHAR(100)
    age: number;               // age INT
    gender: string;            // gender VARCHAR(10)
    pronouns: string;          // pronouns VARCHAR(50)
    occupation: string;        // occupation VARCHAR(255)
    ethnicity: string;         // ethnicity VARCHAR(100)
    persona: string;           // persona TEXT
    chiefConcern: string;      // chief_concern VARCHAR(255)
    vitalSigns: string;        // vital_signs TEXT (JSON String)
    instructions: string;      // instructions TEXT
    behaviors: string;         // behaviors TEXT
    learningObjectives: string;// learning_objectives TEXT
    timeSetting: number;       // time_setting INT
    argumentTime: number;      // argument_time INT
    level: PatientLevel;       // level ENUM
    caseRule: string;          // case_rule TEXT
    status: PatientStatus;     // status ENUM
    avatarImage: string;       // avatar_image VARCHAR(255)
    createdAt?: string;
    updatedAt?: string;
}

export interface ClinicalCaseEntity {
    caseId: string;            // case_id VARCHAR(50)
    title: string;             // title TEXT
    description: string;       // description TEXT
    type: string;              // type TEXT
    status: string;            // status VARCHAR(50)
    pe: string;                // pe TEXT
    symptom: string;           // symptom TEXT
    medicalhistory: string;    // medicalhistory TEXT
    createdBy: string;         // created_by VARCHAR(50)
    eccid: string;             // eccid VARCHAR(50)
    createdAt?: string;
    updatedAt?: string;
}

export interface AssessmentEntity {
    assessmentId: string;
    moduleId: string;
    specialty: string;
    topic: string;
    subtopic: string;
    difficultyLevel: PatientLevel;
    title: string;
    descriptions: string;
    goal: string;
    numQuestions: number;
    timeLimitMinutes: number;
    passingScorePercentage: number;
    maxAttempts: number;
    allowedQuestionTypes: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IssueEntity {
    id: string;
    assessmentId: string | null;
    practiceSessionId: string | null;
    learnerId: string;
    itemType: ItemType;
    editDeadline: number;
    description: string;
    label: string;
    status: IssueStatus;
    createdAt: string;
    updatedAt: string;
    feedback?: string | null;
}
