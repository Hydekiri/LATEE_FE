export type PracticePhase =
    | 'idle'
    | 'vp_chat'
    | 'reasoning'
    | 'submitted'
    | 'evaluated';

export interface PracticeSessionState {
    sessionId: string;
    patientId: string;
    learnerId: string;
    moduleId: string;
    phase: PracticePhase;
    vpStartedAt: number | null;
    vpEndedAt: number | null;
    reasoningStartedAt: number | null;
    reasoningEndedAt: number | null;
    evaluationId: string | null;
}

const STORE_KEY = 'practice_session_state';

function load(): PracticeSessionState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(STORE_KEY);
        return raw ? (JSON.parse(raw) as PracticeSessionState) : null;
    } catch {
        return null;
    }
}

function save(state: PracticeSessionState): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function clear(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORE_KEY);
}

export const practiceSessionStore = { load, save, clear };