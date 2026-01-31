import { API_BASE_URL } from '@/src/config/env';
import { Sparkles, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AiMessageBlockProps {
    isValid: boolean;
    noteId?: string;
    message?: string;
    children?: React.ReactNode;
}

export const AiMessageBlock = ({ isValid, noteId, message, children }: AiMessageBlockProps) => {
    return (
        <div className="flex gap-3" >
            {/* Avatar */}
            < div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1" >
                <Sparkles className="w-4 h-4" />
            </div>

            {/* Message Content */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1" >

                {/* Nếu sai thì hiển thị banner đỏ */}
                {
                    !isValid && (
                        <div className="inline-block bg-[#FF8A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2" >
                            <AlertTriangle className="w-3 h-3 inline mr-1" /> {noteId ?? "Note"
                            }
                        </div>
                    )}
                {children}
                {message && <p className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed">{message}</p>}
            </div>
        </div>
    );
};


export interface AiAssistantEvent {
    type: "token" | "done" | "error";
    content?: string;
    message?: string;
    source_documents?: string[];
}

export async function fetchAiAssistantResponse(
    question: string,
    onToken: (token: string) => void,
    onDone?: (payload: AiAssistantEvent) => void,
    onError?: (message: string) => void
) {
    const response = await fetch(`${API_BASE_URL}/ai-assistant/assistant/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        },
        body: JSON.stringify({
            doctor_id: "doctor_demo",
            question,
            patient_history: [],
            use_rag: true,
        }),
    });

    if (!response.body) {
        throw new Error("Response body is empty – cannot read SSE stream");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
            if (!event.startsWith("data:")) continue;

            const jsonStr = event.replace("data:", "").trim();
            if (!jsonStr) continue;

            try {
                const data: AiAssistantEvent = JSON.parse(jsonStr);

                if (data.type === "token" && data.content) {
                    onToken(data.content);
                }

                if (data.type === "done") {
                    onDone?.(data);
                }

                if (data.type === "error") {
                    onError?.(data.message ?? "Unknown error");
                }
            } catch (err) {
                console.error("JSON parse error:", err);
            }
        }
    }
}