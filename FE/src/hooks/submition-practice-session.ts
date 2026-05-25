import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { ClinicalReasoningChatMessageTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';

export interface ConversationMessage {
    role: 'learner' | 'patient';
    content: string;
}

export interface ReasoningStep {
    step: number;
    content: string;
}

export interface PracticeSessionSubmitPayload {
    sessionId: string;
    learnerId: string;
    finalDiagnosis: string;
    vpConversationLog: { messages: ConversationMessage[] };
    aiReasoningLog: { steps: ReasoningStep[] };
    moduleId: string;
    discussionType: string;
    guidelinesId: string | null;
    warnings: Array<{
        warningId: string;
        label: string;
        description: string;
        learnerId: string;         
        practiceSessionId: string; 
    }>;
}

export interface PracticeSessionDetailResponse {
    sessionId: string;
    learnerId: string;
    patientId: string;
    moduleId: string;
    discussionType: string;
    guidelinesId: string | null;
    vpConversationLog: { messages: ConversationMessage[] };
    aiReasoningLog: { steps: ReasoningStep[] };
    finalDiagnosis: string;
    status: string;
    startTime: string;
    endTime: string | null;
    createdAt: string;
    warnings: Array<{
        warningId: string;
        label: string;
        description: string;
    }>;
}

export interface EvaluationSubmitPayload {
    practiceSessionId: string;
    learnerId: string;
    epaId: string;
    finalDiagnosis: string;
    vpConversationLog: { messages: ConversationMessage[] };
    aiReasoningLog: { steps: ReasoningStep[] };
    moduleId: string;
    discussionType: string;
    duration: number;
    warnings: Array<{
        warningId: string;
        label: string;
        description: string;
    }>;
}

export interface EvaluationResponseData {
    message: string;
    data: {
        evaluationId: string;
        score: number;
        entrustmentLevel: number;
        feedbackDetail: string;
        finalDiagnosis: string;
        discussionType: string;
        duration: number;
        practiceSessionId: string;
    };
}

export async function buildSessionSubmitPayload(params: {
    sessionId: string;
    learnerId: string;
    diagnosis: string;
    moduleId: string;
}): Promise<PracticeSessionSubmitPayload> {
    const [vpMessages, reasoningMessages, notes] = await Promise.all([
        VPChatMessageTable.getBySession(params.sessionId),
        ClinicalReasoningChatMessageTable.getBySession(params.sessionId),
        ValidationNoteTable.getBySession(params.sessionId),
    ]);

    const messagesLog: ConversationMessage[] = (vpMessages || []).map((m) => ({
        role: m.role === 'user' ? 'learner' : 'patient',
        content: String(m.content || '').trim(),
    }));

    const stepsLog: ReasoningStep[] = (reasoningMessages || []).map((m, i) => ({
        step: Number(i + 1),
        content: String(m.content || '').trim(),
    }));

    const warningsPayload = (notes || []).map((w, idx) => ({
        warningId: String(w.noteId || `W-${String(idx + 1).padStart(3, '0')}`),
        label: String(w.category || 'Clinical Rule Violation').trim(),
        description: String(w.reason || w.suggestion || 'Validation Warning').trim(),
        learnerId: String(params.learnerId),                
        practiceSessionId: String(params.sessionId),       
    }));

    return {
        sessionId: String(params.sessionId),
        learnerId: String(params.learnerId),
        finalDiagnosis: String(params.diagnosis).trim(),
        vpConversationLog: { messages: messagesLog },
        aiReasoningLog: { steps: stepsLog },
        moduleId: String(params.moduleId || 'EPA_STANDARD_V1'),
        discussionType: 'Message Type', 
        guidelinesId: 'GL-001',          
        warnings: warningsPayload,
    };
}

export async function submitPracticeSession(
    payload: PracticeSessionSubmitPayload
): Promise<{ sessionId: string }> {
    const accessToken = getCookie('accessToken');
    
    console.log('[DEBUG PAYLOAD SUBMIT]:', JSON.stringify(payload, null, 2));

    const res = await fetch(
        `${API_BASE_URL}/practice-session/api/practice-sessions/submit`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-env': 'client',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify(payload),
        }
    );
    
    if (!res.ok) {
        const errorDetail = await res.text();
        console.error('[BE Validation Errors]:', errorDetail);
        throw new Error(`Submit session failed: ${res.status} - ${errorDetail}`);
    }
    
    return res.json() as Promise<{ sessionId: string }>;
}

export async function getPracticeSessionById(sessionId: string): Promise<PracticeSessionDetailResponse> {
    const accessToken = getCookie('accessToken');
    const res = await fetch(
        `${API_BASE_URL}/practice-session/api/practice-sessions/${sessionId}`,
        {
            headers: {
                'x-auth-env': 'client', 
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
        }
    );
    if (!res.ok) throw new Error(`Fetch practice session details failed: ${res.status}`);
    return res.json() as Promise<PracticeSessionDetailResponse>;
}

export async function submitEvaluation(
    payload: EvaluationSubmitPayload
): Promise<EvaluationResponseData> {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}/evaluation/api/evaluation/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-env': 'client', 
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const detail = await res.text();
        console.error('[submitEvaluation] Error detail:', detail);
        throw new Error(`Submit evaluation failed: ${res.status}`);
    }
    return res.json() as Promise<EvaluationResponseData>;
}