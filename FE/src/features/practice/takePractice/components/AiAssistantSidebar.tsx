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
    ChatMessageEntity,
} from '@/src/hooks/dexieConfigurations/AIAssistantChatMessages.table';

interface Message {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
}

interface AiAssistantSidebarProps {
    sessionId: string;
}

export const AiAssistantSidebar = ({ sessionId }: AiAssistantSidebarProps) => {
    const [aiInput, setAiInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Logic nạp dữ liệu cũ giữ nguyên
    useEffect(() => {
        if (!sessionId) return;

        const loadMessages = async () => {
            try {
                const cached = await AIAssistantChatMessageTable.getBySession(sessionId);
                setMessages(
                    cached.map((m) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                    }))
                );
            } catch (error) {
                console.error('[AiAssistantSidebar] Failed to load messages:', error);
            }
        };

        void loadMessages();
    }, [sessionId]);

    const addMessage = async (
        message: Omit<ChatMessageEntity, 'id'>
    ): Promise<Message | null> => {
        try {
            const id = await AIAssistantChatMessageTable.add(message);
            const newMessage: Message = {
                id: Number(id),
                role: message.role,
                content: message.content,
            };
            setMessages((prev) => [...prev, newMessage]);
            return newMessage;
        } catch (error) {
            console.error('[AiAssistantSidebar] Failed to save message:', error);
            return null;
        }
    };

    const updateAssistantMessage = async (id: number, content: string): Promise<void> => {
        setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, content } : msg))
        );
        await AIAssistantChatMessageTable.update(id, { content });
    };

    // Logic fetch stream cũ giữ nguyên hoàn toàn
    const fetchAiResponse = async (question: string): Promise<void> => {
        if (!question.trim()) return;
        setIsLoading(true);

        try {
            await addMessage({
                role: 'user',
                content: question,
                sessionId,
                createdAt: Date.now(),
            });

            const assistantMessage = await addMessage({
                role: 'assistant',
                content: '',
                sessionId,
                createdAt: Date.now(),
            });

            let streamedText = '';

            const historyForApi: AiAssistantHistoryMessage[] = messages.map((m) => ({
                role: m.role === 'user' ? 'user' : 'assistant',
                content: m.content,
            }));

            await fetchAiAssistantResponse(
                question,
                historyForApi,
                async (token: string) => {
                    streamedText += token;
                    if (assistantMessage?.id !== undefined) {
                        await updateAssistantMessage(assistantMessage.id, streamedText);
                    }
                },
                async () => {
                    setIsLoading(false);
                },
                async (errorMessage: string) => {
                    if (assistantMessage?.id !== undefined) {
                        await updateAssistantMessage(
                            assistantMessage.id,
                            `Error: ${errorMessage}`
                        );
                    }
                    setIsLoading(false);
                }
            );

            setAiInput('');
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

                {/* Render ALL Messages (Sử dụng đúng CSS Template mới) */}
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
                            <p></p>
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
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#235697] disabled:bg-gray-100 disabled:cursor-not-allowed"
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