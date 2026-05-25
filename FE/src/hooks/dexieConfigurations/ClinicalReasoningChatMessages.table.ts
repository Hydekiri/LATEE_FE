import { db } from './database';
export interface ClinicalReasoningChatMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    sessionId: string;
    createdAt: number;
    dimension?: string;
}

export type ClinicalReasoningChatMessageInput = Omit<
    ClinicalReasoningChatMessage,
    'id'
>;

export interface ClinicalReasoningDimensionEntity {
    id?: number;
    dimension: string;
    question: string;
    answer: string;
    sessionId: string;
    createdAt: number;
}

export type ClinicalReasoningDimensionInput = Omit<
    ClinicalReasoningDimensionEntity,
    'id'
>;

const TABLE = 'ClinicalReasoningChatMessages';
const DIM_TABLE = 'ClinicalReasoningDimensions';

export const ClinicalReasoningChatMessageTable = {
    add: (msg: ClinicalReasoningChatMessageInput): Promise<number> =>
        db.table<ClinicalReasoningChatMessage, number>(TABLE).add(msg),

    getBySession: (sessionId: string): Promise<ClinicalReasoningChatMessage[]> =>
        db
            .table<ClinicalReasoningChatMessage, number>(TABLE)
            .where('sessionId')
            .equals(sessionId)
            .sortBy('createdAt') as Promise<ClinicalReasoningChatMessage[]>,

    clearBySession: (sessionId: string): Promise<number> =>
        db
            .table<ClinicalReasoningChatMessage, number>(TABLE)
            .where('sessionId')
            .equals(sessionId)
            .delete(),

    getAll: (): Promise<ClinicalReasoningChatMessage[]> =>
        db
            .table<ClinicalReasoningChatMessage, number>(TABLE)
            .orderBy('createdAt')
            .toArray(),

    update: (
        id: number,
        updates: Partial<ClinicalReasoningChatMessageInput>
    ): Promise<number> =>
        db.table<ClinicalReasoningChatMessage, number>(TABLE).update(id, updates),

    delete: (id: number): Promise<void> =>
        db.table<ClinicalReasoningChatMessage, number>(TABLE).delete(id),

    clear: (): Promise<void> =>
        db.table<ClinicalReasoningChatMessage, number>(TABLE).clear(),
};

export const ClinicalReasoningDimensionTable = {
    add: (data: ClinicalReasoningDimensionInput): Promise<number> =>
        db.table<ClinicalReasoningDimensionEntity, number>(DIM_TABLE).add(data),

    getBySession: (
        sessionId: string
    ): Promise<ClinicalReasoningDimensionEntity[]> =>
        db
            .table<ClinicalReasoningDimensionEntity, number>(DIM_TABLE)
            .where('sessionId')
            .equals(sessionId)
            .toArray(),

    getAll: (): Promise<ClinicalReasoningDimensionEntity[]> =>
        db
            .table<ClinicalReasoningDimensionEntity, number>(DIM_TABLE)
            .toArray(),

    clearBySession: (sessionId: string): Promise<number> =>
        db
            .table<ClinicalReasoningDimensionEntity, number>(DIM_TABLE)
            .where('sessionId')
            .equals(sessionId)
            .delete(),

    clear: (): Promise<void> =>
        db
            .table<ClinicalReasoningDimensionEntity, number>(DIM_TABLE)
            .clear(),
};