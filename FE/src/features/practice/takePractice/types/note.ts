export interface NoteChatMessage {
    role: 'assistant' | 'user' | 'doctor' | 'patient';
    content: string;
}

export interface QuestionValidationResponse {
    reason: string | "No reason provided";
    suggestion: string | "No suggestion provided";
    severity: string | "No severity provided";
    category: string | "No category provided";
    confidence: number | null;
}

export interface NoteChatState {
    noteId: string;
    isOpen: boolean;
    showChat: boolean;
    messages: NoteChatMessage[];
    interactionHistory: NoteChatMessage[]; 
    questionValidationResponse: QuestionValidationResponse;
}