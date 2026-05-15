// // src/types/assessment.ts

// export interface Expert {
//     name: string;
//     role: string;
//     img: string;
// }

// export interface AssessmentData {
//     assessmentId: string;    
//     creatorId: string;
//     clinicalCaseId?: string;
//     moduleId?: string;
//     courseId?: string;

//     title: string;
//     topic: string;          
//     subtopic?: string;
//     specialty?: string;
//     difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; 

//     descriptions: string;    
//     goal: string;            
//     img: string;             

//     numQuestions: number;
//     timeLimitMinutes: number; 
//     passingScorePercentage: number;
//     maxAttempts: number;     

//     subTitle: string;        
//     level: string | number;  
//     timeRequired: string;   
//     deadline: string;       
//     releaseDate: string;    
//     timesPracticed: number;  

//     author: string;
//     authorRole: string;
//     learningObjectives: string[]; 
//     experts: Expert[];
// }
// export interface AssessmentQuestion {
//     questionId: string;
//     assessmentId: string;
//     questionType: 'MultipleChoice' | 'MultipleResponse' | 'TrueFalse' | 'FillInBlank' | 'ShortAnswer';
//     cognitiveLevel: string;
//     content: string;
//     options: string; 
//     explanation?: string;
//     points: number;
// }

// export interface AssessmentFullDetails extends AssessmentData {
//     questions: AssessmentQuestion[];
// }

export interface Expert {
    name: string;
    role: string;
    img: string | File;
}

export interface QuestionOption {
    id: string;
    text?: string;
    isCorrect?: boolean;
}

export interface AssessmentData {
    assessmentId: string;
    creatorId: string;
    clinicalCaseId?: string;
    courseId?: string;
    moduleId?: string;
    specialty?: string;
    topic: string;
    subTitle?: string;
    subtopic?: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    title: string;
    descriptions: string;
    goal?: string;
    numQuestions: number;
    timeLimitMinutes: number;
    timesPracticed: number;
    passingScorePercentage: number;
    maxAttempts: number;
    isActive: boolean;
    createdAt: string;

    img: string | File;
    author: string;
    authorRole: string;
    learningObjectives: string[];
    experts: Expert[];
    deadline: string;
}

export interface AssessmentQuestion {
    id: string;
    assessmentId: string;
    questionType: 'MultipleChoice' | 'MultipleResponse' | 'TrueFalse' | 'FillInBlank' | 'ShortAnswer';
    cognitiveLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
    question: string;
    questionOption: QuestionOption[];
    explanation?: string;
    points: number;
}

export interface AssessmentFullDetails extends AssessmentData {
    questions: AssessmentQuestion[];
}

export interface AssessmentAttempt {
    attemptId: string;
    assessmentId: string;
    userId: string;
    status: 'InProgress' | 'Completed' | 'Abandoned';
    startTime: string;
    endTime?: string;
    score?: number;
}