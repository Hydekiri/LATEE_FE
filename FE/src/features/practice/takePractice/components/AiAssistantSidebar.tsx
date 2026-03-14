import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, AlertTriangle, User } from 'lucide-react';
import { AiMessageBlock, fetchAiAssistantResponse } from '@/src/services/aiAssistant-service';

// Type cho message
interface Message {
    role: 'user' | 'assistant';
    isValid: boolean;
    noteId?: string;
    content: string;
}

export const AiAssistantSidebar = () => {
    const [aiInput, setAiInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchAiResponse = async (question: string) => {
        // Kiểm tra input rỗng
        if (!question.trim()) return;

        setIsLoading(true);

        // 1. Thêm câu hỏi của user vào messages
        setMessages((prev) => [
            ...prev,
            {
                role: 'user',
                isValid: true,
                content: question,
            },
        ]);

        // Clear input ngay sau khi thêm câu hỏi
        setAiInput("");

        // tạo block rỗng nơi sẽ stream token vào
        let streamedText = "";

        // 2. Tạo 1 block AI rỗng để fill từ SSE stream
        setMessages((prev) => [
            ...prev,
            {
                role: 'assistant',
                isValid: true,
                content: ""
            },
        ]);

        await fetchAiAssistantResponse(
            question,

            // TOKEN STREAM
            (token) => {
                streamedText += token;

                setMessages((prev) => {
                    const updated = [...prev];

                    updated[updated.length - 1] = {
                        role: 'assistant',
                        isValid: true,
                        content: streamedText,
                    };

                    return updated;
                });
            },

            // DONE EVENT
            (payload) => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: 'assistant',
                        isValid: true,
                        content: streamedText,
                    };
                    return updated;
                });
                setIsLoading(false);
            },

            // ERROR EVENT
            (errorMessage) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        isValid: false,
                        noteId: "Error",
                        content: "❌ " + errorMessage,
                    },
                ]);
                setIsLoading(false);
            }
        );
    };

    return (
        <aside className="w-80 bg-[#D1EFF9]/30 border-l border-blue-100 flex flex-col h-full shrink-0 relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1">
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Welcome to the Latee tutorial! I am Dr. MoX, and I will be your guide through this introductory case.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1">
                        <div className="inline-block bg-[#FF8A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2">
                            <AlertTriangle className="w-3 h-3 inline mr-1" /> Note #1652
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Incorrect response. Instead of ending the conversation, you should continue gathering more information...
                        </p>
                    </div>
                </div>

                {/* Render ALL Messages */}
                {messages.map((m, i) => (
                    m.role === 'user' ? (
                        // User Message
                        <div key={i} className="flex gap-3 justify-end">
                            <div className="bg-[#235697] rounded-xl p-4 shadow-sm max-w-[85%]">
                                <p className="text-xs text-white leading-relaxed">
                                    {m.content}
                                </p>
                            </div>
                            <div className="shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-md mt-1">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                    ) : (
                        // AI Message
                        <AiMessageBlock key={i} isValid={m.isValid} noteId={m.noteId} message={m.content}>
                            <p></p>
                        </AiMessageBlock>
                    )
                ))}

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-blue-100 bg-[#D1EFF9]/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask Dr. MoX..."
                        disabled={isLoading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                fetchAiResponse(aiInput);
                            }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#235697] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        className="bg-[#235697] text-white p-2 rounded-lg hover:bg-[#1d4880] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => fetchAiResponse(aiInput)}
                        disabled={isLoading || !aiInput.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};