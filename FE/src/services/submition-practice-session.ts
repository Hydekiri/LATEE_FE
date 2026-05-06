import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { ClinicalReasoningChatMessageTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { API_BASE_URL } from '../config/env';
import { getCookie } from '../utils/cookies';

export interface EvaluationSubmitDTO {
    SessionId: string;
    userId: string;
    clinicalCaseId: string;
    vpLog: string;        
    reasoningLog: string; 
    diagnosis: string;
    overallScore: number;
    caseType: string;
    discussionType: string;
    duration: string;
    warnings: {
        warningId: string;
        label: string;
        description: string;
    }[];
}

export async function buildEvaluationPayload(params: {
    sessionId: string;
    userId: string;
    clinicalCaseId: string;
    diagnosis: string;
    duration?: string;
}): Promise<EvaluationSubmitDTO> {

    const [vpMessages, reasoningMessages, notes] = await Promise.all([
        VPChatMessageTable.getAll(),
        ClinicalReasoningChatMessageTable.getAll(),
        ValidationNoteTable.getAll()
    ]);

    const vpLogData = vpMessages.map(m => ({ role: m.role, content: m.content }));
    const reasoningLogData = reasoningMessages.map(m => ({ role: m.role, content: m.content }));

    return {
        SessionId: params.sessionId,
        userId: params.userId,
        clinicalCaseId: params.clinicalCaseId,
        vpLog: JSON.stringify(vpLogData),
        reasoningLog: JSON.stringify(reasoningLogData),
        diagnosis: params.diagnosis,
        overallScore: 0, 
        caseType: "Diagnosis", 
        discussionType: "Clinical Simulation",
        duration: params.duration || "00:00",
        
        warnings: notes.map(w => ({
            warningId: w.id?.toString() || `warn_${Date.now()}`,
            label: w.category || "Clinical Rule Violation",
            description: w.reason || ""
        })),
    };
}

export async function submitEvaluation(payload: EvaluationSubmitDTO) {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}/evaluation/api/evaluation/submit`, {
        method: 'POST',
        headers: { 
            'accept': '*/*',
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorDetail = await res.text();
        console.error("Submission Error Detail:", errorDetail);
        throw new Error(`Submit evaluation failed with status ${res.status}`);
    }

    return res.json();
}