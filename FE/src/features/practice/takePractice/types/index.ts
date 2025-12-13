export interface ChatMessage {
    id: number;
    role: 'patient' | 'doctor';
    message: string;
    avatar: string;
}

export interface PracticeSessionState {
    isAiSidebarOpen: boolean;
    timeLeft: string;
    progress: number;
}