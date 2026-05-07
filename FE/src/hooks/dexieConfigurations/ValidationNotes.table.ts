import { db } from './database';

export interface ValidationNoteEntity {
    id: string;
    question: string;
    reason: string;
    suggestion: string;
    category: string;
    severity: string;
    confidence: number;
}

export const ValidationNoteTable = {
    async add(data: ValidationNoteEntity) {
        return await db.table('ValidationNotes').add(data);
    },

    async getAll() {
        return await db.table('ValidationNotes')
            .orderBy('id')
            .toArray();
    },

    async getByConversationId(conversationId: string) {
        return await db.table('ValidationNotes')
            .where('conversationId')
            .equals(conversationId)
            .sortBy('id');
    },

    async getLatest(limit = 10) {
        return await db.table('ValidationNotes')
            .orderBy('id')
            .reverse()
            .limit(limit)
            .toArray();
    },

    async delete(id: string) {
        return await db.table('ValidationNotes').delete(id);
    },

    async clear() {
        return await db.table('ValidationNotes').clear();
    },
};