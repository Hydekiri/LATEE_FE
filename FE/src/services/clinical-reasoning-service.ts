import { API_BASE_URL } from '@/src/config/env';

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

const REASONING_ENDPOINTS = [
    '/clinicalreasoning',
    '/ai-assistant/clinicalreasoning',
] as const;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseErrorDetail = async (response: Response) => {
    const text = await response.text();

    if (!text) {
        return '';
    }

    try {
        const parsed = JSON.parse(text) as { detail?: string };
        if (parsed.detail) {
            return parsed.detail;
        }
    } catch {
        return text;
    }

    return text;
};

const requestClinicalReasoning = async (
    endpoint: string,
    payload: ClinicalReasoningRequest,
): Promise<ClinicalReasoningResponse> => {
    const response = await fetch(`http://localhost:5000/ai-assistant/clinicalreasoning`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const detail = await parseErrorDetail(response);
        throw new Error(detail || `Clinical reasoning request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ClinicalReasoningResponse;

    return {
        dimension: data.dimension ?? '',
        question: data.question ?? '',
        stop: Boolean(data.stop),
    };
};

export async function fetchClinicalReasoningQuestion(
    payload: ClinicalReasoningRequest,
): Promise<ClinicalReasoningResponse> {
    let lastError: unknown = null;

    for (const endpoint of REASONING_ENDPOINTS) {
        try {
            return await requestClinicalReasoning(endpoint, payload);
        } catch (error) {
            lastError = error;

            const message = error instanceof Error ? error.message : '';
            const is503 = message.includes('503') || message.toLowerCase().includes('llm not available');

            if (is503) {
                await sleep(1200);

                try {
                    return await requestClinicalReasoning(endpoint, payload);
                } catch (retryError) {
                    lastError = retryError;
                    continue;
                }
            }
        }
    }

    if (lastError instanceof Error) {
        throw lastError;
    }

    throw new Error('Clinical reasoning request failed.');
}