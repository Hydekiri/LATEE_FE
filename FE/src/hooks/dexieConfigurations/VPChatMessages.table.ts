import { db } from './database';

export interface ChatMessageEntity {
    id?: number;
    role: 'user' | 'patient';
    content: string;
}

export const VPChatMessageTable = {
    async add(data: Omit<ChatMessageEntity, 'id'>) {
        return await db.table('VPChatMessages').add(data);
    },

    async getAll() {
        return await db.table('VPChatMessages')
            .orderBy('id')
            .toArray();
    },

    async update(id: number, data: Partial<Omit<ChatMessageEntity, 'id'>>) {
        return await db.table('VPChatMessages').update(id, data);
    },

    async getByConversationId(conversationId: string) {
        return await db.table('VPChatMessages')
            .where('conversationId')
            .equals(conversationId)
            .sortBy('id');
    },

    async getLatest(limit = 10) {
        return await db.table('VPChatMessages')
            .orderBy('id')
            .reverse()
            .limit(limit)
            .toArray();
    },

    async delete(id: number) {
        return await db.table('VPChatMessages').delete(id);
    },

    async clear() {
        return await db.table('VPChatMessages').clear();
    },
};