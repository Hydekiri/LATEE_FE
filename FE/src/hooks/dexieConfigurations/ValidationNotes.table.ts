import { db } from './database';

export interface ValidationNoteEntity {
    id?: number;          
    noteId: string;       
    reason: string;      
    category: string;     
    sessionId: string;    
    createdAt: number;    
    suggestion?: string;
    severity?: string;
}

export const ValidationNoteTable = {
    async add(data: Omit<ValidationNoteEntity, 'id'>) {
        return await db.table('ValidationNotes').add(data);
    },
    async getBySession(sessionId: string): Promise<ValidationNoteEntity[]> {
        return await db.table('ValidationNotes')
            .where('sessionId')
            .equals(sessionId)
            .toArray();
    },
    async clearBySession(sessionId: string) {
        return await db.table('ValidationNotes').where('sessionId').equals(sessionId).delete();
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