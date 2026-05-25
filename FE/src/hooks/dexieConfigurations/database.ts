import Dexie, { type Table } from 'dexie';
import type { ChatMessageEntity as VPChatMessageEntity } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import type { ClinicalReasoningChatMessage } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import type { ValidationNoteEntity } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import type { ChatMessageEntity as AIChatMessageEntity } from '@/src/hooks/dexieConfigurations/AIAssistantChatMessages.table';
import type { ClinicalReasoningDimensionEntity } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';

export class PracticeDatabase extends Dexie {
    VPChatMessages!: Table<VPChatMessageEntity, number>;
    ClinicalReasoningChatMessages!: Table<ClinicalReasoningChatMessage, number>;
    ClinicalReasoningDimensions!: Table<ClinicalReasoningDimensionEntity, number>;
    ValidationNotes!: Table<ValidationNoteEntity, number>;
    AIAssistantChatMessages!: Table<AIChatMessageEntity, number>;

    constructor() {
        super('AIAssistantDatabase');

        this.version(1).stores({
            VPChatMessages: '++id, role, content',
            ValidationNotes: '++id, question, reason, suggestion, category, severity, confidence',
            AIAssistantChatMessages: '++id, role, content',
            ClinicalReasoningChatMessages: '++id, role, content, dimension',
            ClinicalReasoningDimensions: '++id, dimension, question, answer',
        });

        this.version(2).stores({
            VPChatMessages: '++id, sessionId, role',
            ValidationNotes: '++id, sessionId, category',
            AIAssistantChatMessages: '++id, role, content',
            ClinicalReasoningChatMessages: '++id, sessionId, role',
            ClinicalReasoningDimensions: '++id, dimension, question, answer',
        });

        this.version(3).stores({
            VPChatMessages: '++id, sessionId, role, createdAt',
            ValidationNotes: '++id, sessionId, category, createdAt',
            AIAssistantChatMessages: '++id, sessionId, role, createdAt',
            ClinicalReasoningChatMessages: '++id, sessionId, role, createdAt',
            ClinicalReasoningDimensions: '++id, dimension, question, answer',
        });

        this.version(4).stores({
            VPChatMessages: '++id, sessionId, role, createdAt',
            ValidationNotes: '++id, sessionId, category, createdAt',
            AIAssistantChatMessages: '++id, sessionId, role, createdAt',
            ClinicalReasoningChatMessages: '++id, sessionId, role, createdAt',
            ClinicalReasoningDimensions: '++id, sessionId, dimension, question, answer',
        });
    }
}

export const db = new PracticeDatabase();