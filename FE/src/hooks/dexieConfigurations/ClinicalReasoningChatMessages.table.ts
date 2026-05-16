import { db } from './database';

export interface ClinicalReasoningChatMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    sessionId: string;
    createdAt: number;
    dimension?: string;
}

export type ClinicalReasoningChatMessageEntity = ClinicalReasoningChatMessage;

export interface ClinicalReasoningDimensionEntity {
    id?: number;
    dimension: string;
    question: string;
    answer: string;
}

export const ClinicalReasoningChatMessageTable = {
    add: (msg: Omit<ClinicalReasoningChatMessage, 'id'>) =>
        db.table('ClinicalReasoningChatMessages').add(msg),

    getBySession: (sessionId: string): Promise<ClinicalReasoningChatMessage[]> =>
        db.table('ClinicalReasoningChatMessages')
            .where('sessionId')
            .equals(sessionId)
            .sortBy('createdAt') as Promise<ClinicalReasoningChatMessage[]>,

    clearBySession: (sessionId: string): Promise<number> =>
        db.table('ClinicalReasoningChatMessages')
            .where('sessionId')
            .equals(sessionId)
            .delete(),

    getAll: (): Promise<ClinicalReasoningChatMessage[]> =>
        db.table('ClinicalReasoningChatMessages')
            .orderBy('createdAt')
            .toArray() as Promise<ClinicalReasoningChatMessage[]>,

    update: (id: number, updates: Partial<Omit<ClinicalReasoningChatMessage, 'id'>>) =>
        db.table('ClinicalReasoningChatMessages').update(id, updates),

    delete: (id: number) =>
        db.table('ClinicalReasoningChatMessages').delete(id),

    clear: () =>
        db.table('ClinicalReasoningChatMessages').clear(),
};

export const ClinicalReasoningDimensionTable = {
    add: (data: Omit<ClinicalReasoningDimensionEntity, 'id'>) =>
        db.table('ClinicalReasoningDimensions').add(data),

    getAll: (): Promise<ClinicalReasoningDimensionEntity[]> =>
        db.table('ClinicalReasoningDimensions').toArray() as Promise<ClinicalReasoningDimensionEntity[]>,

    clear: () =>
        db.table('ClinicalReasoningDimensions').clear(),
};