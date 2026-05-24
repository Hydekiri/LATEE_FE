import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';

export interface ValidationResult {
    isValid: boolean;
    reason: string;
    suggestion: string;
    severity: string;
    category: string;
    confidence: number | null;
}

export async function validateLearnerQuestion(params: {
    doctorId: string;
    question: string;
    context: { role: string; content: string }[];
}): Promise<ValidationResult> {
    const accessToken = getCookie('accessToken');
    const res = await fetch(`${API_BASE_URL}/assistant/validate_question/hf`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'x-auth-env': 'client', 
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
        doctor_id: params.doctorId,
        learner_question: params.question,
        conversation_context: params.context,
        }),
    });
    if (!res.ok) throw new Error(`Validation failed: ${res.status}`);
    return res.json() as Promise<ValidationResult>;
}