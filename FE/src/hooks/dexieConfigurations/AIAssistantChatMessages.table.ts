import { db } from './database';

export interface ChatMessageEntity {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    sessionId: string;
    createdAt: number;
}

export const AIAssistantChatMessageTable = {
    async add(data: Omit<ChatMessageEntity, 'id'>) {
        return await db.table('AIAssistantChatMessages').add(data);
    },

    async getAll(): Promise<ChatMessageEntity[]> {
        return await db.table('AIAssistantChatMessages')
            .orderBy('createdAt')
            .toArray() as ChatMessageEntity[];
    },

    async update(id: number, updates: Partial<Omit<ChatMessageEntity, 'id'>>) {
        return await db.table('AIAssistantChatMessages').update(id, updates);
    },

    async getBySession(sessionId: string): Promise<ChatMessageEntity[]> {
        return await db.table('AIAssistantChatMessages')
            .where('sessionId')
            .equals(sessionId)
            .sortBy('createdAt') as ChatMessageEntity[];
    },

    async clearBySession(sessionId: string) {
        return await db.table('AIAssistantChatMessages')
            .where('sessionId')
            .equals(sessionId)
            .delete();
    },

    async delete(id: number) {
        return await db.table('AIAssistantChatMessages').delete(id);
    },

    async clear() {
        return await db.table('AIAssistantChatMessages').clear();
    },
};