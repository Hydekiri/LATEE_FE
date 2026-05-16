import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { ClinicalReasoningChatMessageTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { API_BASE_URL } from '../config/env';
import { getCookie } from '../utils/cookies';

export interface ConversationMessage {
    role: 'learner' | 'patient';
    content: string;
}

export interface ReasoningStep {
    step: number;
    content: string;
}

//POST /practice-session/api/practice-sessions/submit
export interface PracticeSessionSubmitPayload {
    sessionId:           string;
    learnerId:           string;
    finalDiagnosis:      string;
    vpConversationLog:   { messages: ConversationMessage[] };
    aiReasoningLog:      { steps: ReasoningStep[] };
    moduleId:            string;
    discussionType:      string;
    guidelinesId:        string | null;
    warnings: Array<{
        warningId:   string;
        label:       string;
        description: string;
    }>;
}

//POST /evaluation/api/evaluation/submit
export interface EvaluationSubmitPayload {
    practiceSessionId:   string;   
    learnerId:           string;
    epaId:               string;
    finalDiagnosis:      string;
    vpConversationLog:   { messages: ConversationMessage[] };
    aiReasoningLog:      { steps: ReasoningStep[] };
    moduleId:            string;
    discussionType:      string;
    duration:            number;
    warnings: Array<{
        warningId:   string;
        label:       string;
        description: string;
    }>;
}

export async function buildSubmitPayloads(params: {
    sessionId:  string;
    learnerId:  string;
    patientId:  string;
    diagnosis:  string;
    moduleId:   string;
    duration:   number;
}): Promise<{
    sessionPayload:    PracticeSessionSubmitPayload;
    evaluationPayload: EvaluationSubmitPayload;
}> {
    const [vpMessages, reasoningMessages, notes] = await Promise.all([
        VPChatMessageTable.getAll(),
        ClinicalReasoningChatMessageTable.getAll(),
        ValidationNoteTable.getAll()
    ]);

    const vpLog = {
        messages: vpMessages.map(m => ({
            role:    (m.role === 'user' ? 'learner' : 'patient') as 'learner' | 'patient',
            content: m.content
        }))
    };

    const reasoningLog = {
        steps: reasoningMessages.map((m, i) => ({
            step:    i + 1,
            content: m.content
        }))
    };

    const warnings = notes.map(w => ({
        warningId:   w.id ?? crypto.randomUUID(),
        label:       w.category ?? "Clinical Rule Violation",
        description: w.reason ?? ""
    }));

    const sessionPayload: PracticeSessionSubmitPayload = {
        sessionId:         params.sessionId,
        learnerId:         params.learnerId,
        finalDiagnosis:    params.diagnosis,
        vpConversationLog: vpLog,
        aiReasoningLog:    reasoningLog,
        moduleId:          params.moduleId,
        discussionType:    "Message Type",
        guidelinesId:      null,
        warnings
    };

    const evaluationPayload: EvaluationSubmitPayload = {
        practiceSessionId: params.sessionId,   
        learnerId:         params.learnerId,
        epaId:             params.moduleId,
        finalDiagnosis:    params.diagnosis,
        vpConversationLog: vpLog,
        aiReasoningLog:    reasoningLog,
        moduleId:          params.moduleId,
        discussionType:    "Message Type",
        duration:          params.duration,
        warnings
    };

    return { sessionPayload, evaluationPayload };
}

export async function submitPracticeSession(
    payload: PracticeSessionSubmitPayload
): Promise<{ sessionId: string }> {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}/practice-session/api/practice-sessions/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Submit session failed: ${res.status}`);
    return res.json();
}

export async function submitEvaluation(
    payload: EvaluationSubmitPayload
): Promise<{ message: string; data: { evaluationId: string; score: number } }> {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}/evaluation/api/evaluation/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const detail = await res.text();
        console.error("Submission Error:", detail);
        throw new Error(`Submit evaluation failed: ${res.status}`);
    }
    return res.json();
}