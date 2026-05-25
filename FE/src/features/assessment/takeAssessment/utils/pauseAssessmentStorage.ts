export interface PausedAssessmentState {
    assessmentId: string;
    title: string;
    difficultyLevel?: string;
    timeLimitMinutes?: number;
    totalQuestions: number;
    currentQuestionIdx: number;
    timeLeft: number;
    durationSeconds: number;
    answers: Record<string, string>;
    pausedAt: string;
    image?: string;
}

const PAUSED_ASSESSMENTS_KEY = "latee_paused_assessments";

const isBrowser = () => typeof window !== "undefined";

const parsePausedAssessments = (rawData: string | null): PausedAssessmentState[] => {
    if (!rawData) return [];

    try {
        const parsed = JSON.parse(rawData);
        if (!Array.isArray(parsed)) return [];
        return parsed as PausedAssessmentState[];
    } catch {
        return [];
    }
};

export const getPausedAssessments = (): PausedAssessmentState[] => {
    if (!isBrowser()) return [];
    return parsePausedAssessments(window.localStorage.getItem(PAUSED_ASSESSMENTS_KEY));
};

export const getPausedAssessmentById = (assessmentId: string): PausedAssessmentState | null => {
    const pausedAssessments = getPausedAssessments();
    return pausedAssessments.find((item) => item.assessmentId === assessmentId) || null;
};

export const savePausedAssessment = (state: PausedAssessmentState): void => {
    if (!isBrowser()) return;

    const pausedAssessments = getPausedAssessments();
    const nextData = [
        state,
        ...pausedAssessments.filter((item) => item.assessmentId !== state.assessmentId)
    ];

    window.localStorage.setItem(PAUSED_ASSESSMENTS_KEY, JSON.stringify(nextData));
};

export const removePausedAssessment = (assessmentId: string): void => {
    if (!isBrowser()) return;

    const pausedAssessments = getPausedAssessments();
    const nextData = pausedAssessments.filter((item) => item.assessmentId !== assessmentId);
    window.localStorage.setItem(PAUSED_ASSESSMENTS_KEY, JSON.stringify(nextData));
};
