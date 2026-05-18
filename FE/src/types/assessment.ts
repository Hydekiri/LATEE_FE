// // src/types/assessment.ts

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

export interface AttemptItem {
    attemptId: string;
    learnerId: string;
    attemptNo: number;
    duration: number; // in seconds
    score: number;
    isPassed: boolean;
}

export interface AssessmentData {
    assessmentId: string;
    creatorId: string;
    moduleId?: string;
    specialty?: string;
    topic: string;
    subtopic?: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    title: string;
    descriptions: string;
    goal?: string;
    numQuestions: number;
    timeLimitMinutes: number;
    timesPracticed: number;
    maxScore: number;
    passingScorePercentage: number;
    maxAttempts: number;
    isActive: boolean;
    createdAt: string;
    listAttempts: AttemptItem[];

    questions: AssessmentQuestion[];

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