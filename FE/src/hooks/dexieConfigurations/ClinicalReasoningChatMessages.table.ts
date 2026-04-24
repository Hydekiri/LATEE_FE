import { db } from './database';

export interface ClinicalReasoningChatMessageEntity {
    id: number;
    role: 'user' | 'system';
    content: string;
    dimension: string;
}

export const ClinicalReasoningChatMessageTable = {
    async add(data: Omit<ClinicalReasoningChatMessageEntity, 'id'>) {
        return await db.table('ClinicalReasoningChatMessages').add(data);
    },

    async getAll() {
        return await db.table('ClinicalReasoningChatMessages')
            .orderBy('id')
            .toArray();
    },

    async update(id: number, updates: Partial<Omit<ClinicalReasoningChatMessageEntity, 'id'>>) {
        return await db.table('ClinicalReasoningChatMessages').update(id, updates);
    },

    async getByConversationId(conversationId: string) {
        return await db.table('ClinicalReasoningChatMessages')
            .where('conversationId')
            .equals(conversationId)
            .sortBy('id');
    },

    async getLatest(limit = 10) {
        return await db.table('ClinicalReasoningChatMessages')
            .orderBy('id')
            .reverse()
            .limit(limit)
            .toArray();
    },

    async delete(id: number) {
        return await db.table('ClinicalReasoningChatMessages').delete(id);
    },

    async clear() {
        return await db.table('ClinicalReasoningChatMessages').clear();
    },
};


export interface ClinicalReasoningDimensionEntity {
    id: number;
    dimension: string;
    question: string;
    answer: string;
}

export const ClinicalReasoningDimensionTable = {
    async add(data: Omit<ClinicalReasoningDimensionEntity, 'id'>) {
        return await db.table('ClinicalReasoningDimensions').add(data);
    },

    async getAll() {
        return await db.table('ClinicalReasoningDimensions').toArray();
    },

    async clear() {
        return await db.table('ClinicalReasoningDimensions').clear();
    },
};