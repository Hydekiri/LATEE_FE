// src/lib/db/database.ts

import Dexie from 'dexie';

export class AppDatabase extends Dexie {
    constructor() {
        super('AIAssistantDatabase');

        this.version(1).stores({
            VPChatMessages:
                '++id, role, content',

            ValidationNotes:
                '++id, question, reason, suggestion, category, severity, confidence',

            AIAssistantChatMessages:
                '++id, role, content',

            ClinicalReasoningChatMessages:
                '++id, role, content, dimension',

            ClinicalReasoningDimensions:
                '++id, dimension, question, answer',
        });
    }
}

export const db = new AppDatabase();