import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '../utils/cookies';

export interface ValidationMessageItem {
    role: 'doctor' | 'patient' | 'system';
    content: string;
}

export interface QuestionValidationRequest {
    doctor_id: string;
    learner_question: string;
    conversation_context?: ValidationMessageItem[];
}

export interface QuestionValidationResponse {
    isValid: boolean;
    reason: string;
    suggestion: string;
    severity: string;
    category: string;
    confidence: number;
}

export async function ValidateQuestion(
    payload: QuestionValidationRequest,
): Promise<QuestionValidationResponse> {
    const accessToken = getCookie('accessToken');

    const response = await fetch(`${API_BASE_URL}/ai-assistant/assistant/validate_question/hf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
            doctor_id: payload.doctor_id,
            learner_question: payload.learner_question,
            conversation_context: payload.conversation_context ?? [],
        }),
    });

    if (!response.ok) {
        throw new Error(`Validation request failed with status ${response.status}`);
    }

    const data = (await response.json()) as Partial<QuestionValidationResponse>;

    console.log('Validation response data:', data);

    return {
        isValid: Boolean(data.isValid),
        reason: data.reason ?? 'Reason not provided.',
        suggestion: data.suggestion ?? 'Suggestion not provided.',
        severity: data.severity ?? 'Severity not provided.',
        category: data.category ?? 'Category not provided.',
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.5,
    };
}
