// FE/src/services/aiAssistant-service.tsx
import { API_BASE_URL } from '@/src/config/env';
import { Sparkles } from 'lucide-react';
import { getCookie } from '@/src/utils/cookies';

interface AiMessageBlockProps {
    noteId?: number;
    message?: string;
    children?: React.ReactNode;
}

export const AiMessageBlock = ({ noteId: _noteId, message, children }: AiMessageBlockProps) => {
    return (
        <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1">
                {children}
                {message && (
                    <p className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export interface AiAssistantEvent {
    type: 'token' | 'done' | 'error';
    content?: string;
    message?: string;
    source_documents?: string[];
}

export interface AiAssistantHistoryMessage {
    role: 'user' | 'assistant' | 'doctor' | 'patient' | 'system';
    content: string;
}

interface AssistantRequestMessageItem {
    role: 'doctor' | 'patient' | 'system';
    content: string;
}

export interface ValidationResult {
    isValid: boolean;
    reason: string;
    suggestion: string;
    severity: string;
    category: string;
    confidence: number | null;
}

const normalizeHistoryRole = (
    role: AiAssistantHistoryMessage['role']
): AssistantRequestMessageItem['role'] => {
    if (role === 'doctor' || role === 'patient' || role === 'system') {
        return role;
    }
    if (role === 'user') {
        return 'doctor';
    }
    return 'system';
};

const buildPatientHistory = (
    history: AiAssistantHistoryMessage[] = []
): AssistantRequestMessageItem[] => {
    return history
        .filter((item) => item && typeof item.content === 'string' && item.content.trim().length > 0)
        .map((item) => ({
            role: normalizeHistoryRole(item.role),
            content: item.content.trim(),
        }));
};

export async function fetchAiAssistantResponse(
    question: string,
    history: AiAssistantHistoryMessage[] = [],
    onToken: (token: string) => void,
    onDone?: (payload: AiAssistantEvent) => void,
    onError?: (message: string) => void
): Promise<void> {
    const accessToken = getCookie('accessToken');
    const controller = new AbortController();
    const TIMEOUT = 60 * 1000;

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, TIMEOUT);

    try {
        const response = await fetch(`${API_BASE_URL}/ai-assistant/assistant/stream/hf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/event-stream',
                'x-auth-env': 'client', 
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({
                doctor_id: 'doctor_demo',
                question,
                patient_history: buildPatientHistory(history),
                use_rag: true,
            }),
            signal: controller.signal,
        });

        if (!response.body) {
            throw new Error('Response body is empty');
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
                    const data = JSON.parse(jsonStr) as AiAssistantEvent;

                    if (data.type === 'token' && data.content) {
                        onToken(data.content);
                    }

                    if (data.type === 'done') {
                        onDone?.(data);
                        clearTimeout(timeoutId);
                    }

                    if (data.type === 'error') {
                        onError?.(data.message ?? 'Unknown error');
                        clearTimeout(timeoutId);
                    }
                } catch (err) {
                    console.error('[aiAssistant-service] JSON parse error:', err);
                }
            }
        }
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
            onError?.('Request timed out. Please try again.');
        } else {
            onError?.('Something went wrong. Please try again.');
        }
    } finally {
        clearTimeout(timeoutId);
    }
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