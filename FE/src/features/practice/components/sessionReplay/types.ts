import type { PracticeStatus } from '@/src/types/practice';

export interface VPMessage {
    readonly role: 'learner' | 'patient' | 'doctor' | 'user';
    readonly content: string;
}

export interface VPConversationLog {
    readonly messages: readonly VPMessage[];
}

export interface ReasoningStep {
    readonly step: number;
    readonly content: string;
}

export interface AIReasoningLog {
    readonly steps: readonly ReasoningStep[];
}

export interface SessionWarning {
    readonly warningId: string;
    readonly label: string;
    readonly description: string;
}

export interface PracticeSessionDetail {
    readonly sessionId: string;
    readonly learnerId: string;
    readonly patientId: string;
    readonly moduleId: string;
    readonly discussionType: string;
    readonly guidelinesId: string | null;
    readonly vpConversationLog: VPConversationLog | null;
    readonly aiReasoningLog: AIReasoningLog | null;
    readonly finalDiagnosis: string | null;
    readonly status: PracticeStatus;
    readonly startTime: string | null;
    readonly endTime: string | null;
    readonly createdAt: string;
    readonly warnings: readonly SessionWarning[];
}


export interface AttemptListItem {
    readonly sessionId: string;
    readonly attemptNumber: number;
    readonly createdAt: string;
    readonly status: PracticeStatus;
    readonly finalDiagnosis: string | null;
}