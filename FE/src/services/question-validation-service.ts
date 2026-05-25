import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';

export interface ConversationContextMessage {
    role: string;
    content: string;
}

export interface QuestionValidationPayload {
    doctor_id: string;
    learner_question: string;
    conversation_context?: ConversationContextMessage[];
}

export interface QuestionValidationEvent {
    type?: 'done';
    isValid?: boolean;
    reason?: string;
    suggestion?: string;
}

export async function validateQuestionStream(
    payload: QuestionValidationPayload,
    onEvent: (event: QuestionValidationEvent) => void,
) {

    const accessToken = getCookie('accessToken');

    const response = await fetch(`${API_BASE_URL}/ai-assistant/assistant/validate_question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            // FIX: inject token để BE auth middleware không reject
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Validation request failed with status ${response.status}`);
    }

    if (!response.body) {
        throw new Error('Response body is empty – cannot read SSE stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
            if (!event.startsWith('data:')) continue;

            const jsonStr = event.replace('data:', '').trim();
            if (!jsonStr) continue;

            try {
                const parsed = JSON.parse(jsonStr) as QuestionValidationEvent;
                onEvent(parsed);
            } catch (error) {
                console.error('Failed to parse validation SSE event:', error);
            }
        }
    }
}