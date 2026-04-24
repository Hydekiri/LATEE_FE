import { db } from './database';

export interface ChatMessageEntity {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
}

export const AIAssistantChatMessageTable = {
    async add(data: Omit<ChatMessageEntity, 'id'>) {
        return await db.table('AIAssistantChatMessages').add(data);
    },

    async getAll() {
        return await db.table('AIAssistantChatMessages')
            .orderBy('id')
            .toArray();
    },

    async update(id: number, updates: Partial<Omit<ChatMessageEntity, 'id'>>) {
        return await db.table('AIAssistantChatMessages').update(id, updates);
    },

    async getByConversationId(conversationId: string) {
        return await db.table('AIAssistantChatMessages')
            .where('conversationId')
            .equals(conversationId)
            .sortBy('id');
    },

    async getLatest(limit = 10) {
        return await db.table('AIAssistantChatMessages')
            .orderBy('id')
            .reverse()
            .limit(limit)
            .toArray();
    },

    async delete(id: number) {
        return await db.table('AIAssistantChatMessages').delete(id);
    },

    async clear() {
        return await db.table('AIAssistantChatMessages').clear();
    },
};