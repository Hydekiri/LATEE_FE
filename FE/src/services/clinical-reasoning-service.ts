import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';

export const ALL_DIMENSIONS = [
    'Cơ sở bằng chứng',
    'Chẩn đoán phân biệt',
    'Dữ kiện mâu thuẫn',
    'Giải thích cơ chế bệnh sinh',
    'Thông tin còn thiếu',
    'Ưu tiên chẩn đoán nguy hiểm',
    'Độ chắc chắn của quyết định',
    'Hành động lâm sàng tiếp theo',
] as const;

export interface ClinicalReasoningHistoryItem {
    dimension: string;
    question: string;
    answer: string;
}

export interface ClinicalReasoningRequest {
    patient_case: string;
    learner_diagnosis: string;
    interaction_history?: ClinicalReasoningHistoryItem[];
}

export interface ClinicalReasoningResponse {
    dimension: string;
    question: string;
    stop: boolean;
}

export interface ClinicalReasoningStreamEvent {
    type: 'token' | 'done' | 'error';
    content?: string;
    message?: string;
    dimension?: string;
    question?: string;
    stop?: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CLINICAL_REASONING_STREAM_URL = `${API_BASE_URL}/ai-assistant/clinicalreasoning/hf`;

const parseErrorDetail = async (response: Response): Promise<string> => {
    const text = await response.text();
    if (!text) return '';

    try {
        const parsed = JSON.parse(text) as { detail?: string };
        if (parsed.detail) return parsed.detail;
    } catch {
        return text;
    }

    return text;
};

const requestClinicalReasoning = async (
    payload: ClinicalReasoningRequest,
    onToken?: (token: string) => void,
    onDone?: (response: ClinicalReasoningResponse) => void,
    onError?: (message: string) => void
): Promise<ClinicalReasoningResponse> => {
    const accessToken = getCookie('accessToken');

    const response = await fetch(CLINICAL_REASONING_STREAM_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
    });

    console.log('[clinical-reasoning-service] Payload sent:', payload);

    if (!response.ok) {
        const detail = await parseErrorDetail(response);
        throw new Error(
            detail || `Clinical reasoning request failed with status ${response.status}`
        );
    }

    if (!response.body) {
        throw new Error('Response body is empty - cannot read SSE stream');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    let accumulatedQuestion = '';
    let finalResponse: ClinicalReasoningResponse | null = null;

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

            let parsed: ClinicalReasoningStreamEvent;

            try {
                parsed = JSON.parse(jsonStr) as ClinicalReasoningStreamEvent;
            } catch {
                continue;
            }

            if (parsed.type === 'token' && parsed.content) {
                accumulatedQuestion += parsed.content;

                if (
                    !accumulatedQuestion.trim().startsWith('{') &&
                    !accumulatedQuestion.includes('"dimension"')
                ) {
                    onToken?.(parsed.content);
                }
                continue;
            }

            if (parsed.type === 'done') {
                finalResponse = {
                    dimension: parsed.dimension ?? '',
                    question:
                        parsed.question?.trim() || accumulatedQuestion.trim(),
                    stop: Boolean(parsed.stop),
                };
                onDone?.(finalResponse);
                continue;
            }

            if (parsed.type === 'error') {
                const errorMessage =
                    parsed.message ?? 'Clinical reasoning stream failed.';
                onError?.(errorMessage);
                throw new Error(errorMessage);
            }
        }
    }

    if (finalResponse) {
        return finalResponse;
    }

    return {
        dimension: '',
        question: accumulatedQuestion,
        stop: false,
    };
};

export async function fetchClinicalReasoningQuestion(
    payload: ClinicalReasoningRequest,
    onToken?: (token: string) => void,
    onDone?: (response: ClinicalReasoningResponse) => void,
    onError?: (message: string) => void
): Promise<ClinicalReasoningResponse> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
            return await requestClinicalReasoning(payload, onToken, onDone, onError);
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            const is503 =
                message.includes('503') ||
                message.toLowerCase().includes('llm not available');

            if (is503 && attempt === 0) {
                await sleep(1200);
                continue;
            }

            throw error;
        }
    }

    throw new Error('Clinical reasoning request failed after retries.');
}