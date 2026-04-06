export interface NoteChatMessage {
    role: 'assistant' | 'user';
    content: string;
}

export interface NoteChatState {
    noteId: number;
    isOpen: boolean;
    showChat: boolean;
    messages: NoteChatMessage[];
}