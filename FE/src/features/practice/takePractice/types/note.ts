export interface QuestionValidationResponseState {
    reason: string;
    suggestion: string;
    severity: string;
    category: string;
    confidence: number | null;
}

export interface NoteChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface NoteChatState {
    noteId: string;
    isOpen: boolean;
    showChat: boolean;
    messages: NoteChatMessage[];
    interactionHistory: { role: string; content: string }[];
    questionValidationResponse: QuestionValidationResponseState | null;
}