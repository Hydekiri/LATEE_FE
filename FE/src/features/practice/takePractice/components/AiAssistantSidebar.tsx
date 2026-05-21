'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User } from 'lucide-react';
import {
    AiMessageBlock,
    fetchAiAssistantResponse,
    AiAssistantHistoryMessage,
} from '@/src/services/aiAssistant-service';
import {
    AIAssistantChatMessageTable,
} from '@/src/hooks/dexieConfigurations/AIAssistantChatMessages.table';

interface Message {
    readonly id?: number;
    readonly role: 'user' | 'assistant';
    readonly content: string;
}

interface AiAssistantSidebarProps {
    readonly sessionId: string;
}

export const AiAssistantSidebar = ({ sessionId }: AiAssistantSidebarProps) => {
    const [aiInput, setAiInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Khởi tạo Ref lưu vết tin nhắn phục vụ API History mà không phụ thuộc State liên tục
    const messagesRef = useRef<Message[]>([]);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    // Nạp tin nhắn cũ từ cache Dexie lúc khởi chạy
    useEffect(() => {
        if (!sessionId) return;
        let cancelled = false;

        const loadMessages = async () => {
            try {
                const cached = await AIAssistantChatMessageTable.getBySession(sessionId);
                if (!cancelled) {
                    setMessages(
                        cached.map((m) => ({
                            id: m.id,
                            role: m.role as 'user' | 'assistant',
                            content: m.content,
                        }))
                    );
                }
            } catch (error) {
                console.error('[AiAssistantSidebar] Failed to load messages:', error);
            }
        };

        void loadMessages();
        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    const fetchAiResponse = async (question: string): Promise<void> => {
        if (!question.trim() || isLoading) return;
        setIsLoading(true);
        setAiInput('');

        const userTimestamp = Date.now();
        const initialUserMsg: Message = { role: 'user', content: question };
        const initialAssistantMsg: Message = { role: 'assistant', content: '...' };

        // 1. Đẩy nhanh hiển thị UI trước để Learner thấy phản hồi tức thì
        setMessages((prev) => [...prev, initialUserMsg, initialAssistantMsg]);

        try {
            // Đóng gói lịch sử hội thoại chuẩn chỉnh gửi lên API
            const historyForApi: AiAssistantHistoryMessage[] = messagesRef.current.map((m) => ({
                role: m.role,
                content: m.content,
            }));

            let currentStreamedText = '';

            // 2. Kích hoạt API stream phản hồi từ AI Assistant
            await fetchAiAssistantResponse(
                question,
                historyForApi,
                (token: string) => {
                    currentStreamedText += token;
                    // Chỉ cập nhật text trực tiếp lên UI (Tốc độ cao, không lặp)
                    setMessages((prev) => {
                        const next = [...prev];
                        if (next.length > 0) {
                            next[next.length - 1] = { role: 'assistant', content: currentStreamedText };
                        }
                        return next;
                    });
                },
                async () => {
                    // Kịch bản Xong (Stream hoàn tất) -> Tiến hành ghi đồng bộ 1 phát duy nhất vào IndexedDB
                    setIsLoading(false);
                    try {
                        await AIAssistantChatMessageTable.add({
                            role: 'user',
                            content: question,
                            sessionId,
                            createdAt: userTimestamp,
                        });
                        await AIAssistantChatMessageTable.add({
                            role: 'assistant',
                            content: currentStreamedText,
                            sessionId,
                            createdAt: Date.now(),
                        });
                    } catch (dbErr) {
                        console.error('[Dexie Cache Failure]', dbErr);
                    }
                },
                async (errorMessage: string) => {
                    setMessages((prev) => {
                        const next = [...prev];
                        if (next.length > 0) {
                            next[next.length - 1] = { role: 'assistant', content: `Error: ${errorMessage}` };
                        }
                        return next;
                    });
                    setIsLoading(false);
                }
            );
        } catch (err) {
            console.error('[AiAssistantSidebar] fetchAiResponse error:', err);
            setIsLoading(false);
        }
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

                {messages.map((m, i) => (
                    m.role === 'user' ? (
                        <div key={i} className="flex gap-3 justify-end">
                            <div className="bg-[#235697] rounded-xl p-4 shadow-sm max-w-[85%]">
                                <p className="text-xs text-white leading-relaxed">{m.content}</p>
                            </div>
                            <div className="shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white shadow-md mt-1">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                    ) : (
                        <AiMessageBlock key={i} noteId={m.id} message={m.content}>
                            {/* <div className="text-xs leading-relaxed text-gray-800 bg-white rounded-xl p-4 border border-blue-50 shadow-sm">
                                {m.content}
                            </div> */}
                        </AiMessageBlock>
                    )
                ))}

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
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                void fetchAiResponse(aiInput);
                            }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#235697] disabled:bg-gray-100 disabled:cursor-not-allowed bg-white text-gray-800"
                    />
                    <button
                        className="bg-[#235697] text-white p-2 rounded-lg hover:bg-[#1d4880] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => void fetchAiResponse(aiInput)}
                        disabled={isLoading || !aiInput.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};