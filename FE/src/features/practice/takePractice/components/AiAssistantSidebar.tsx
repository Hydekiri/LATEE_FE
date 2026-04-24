"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User } from 'lucide-react';
import { AiMessageBlock, fetchAiAssistantResponse } from '@/src/services/aiAssistant-service';
import { AIAssistantChatMessageTable, ChatMessageEntity } from '@/src/hooks/dexieConfigurations/AIAssistantChatMessages.table';

// Type cho message
interface Message {
    id?: number;
    role: 'user' | 'assistant';
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

    /*
     ========================================
     LOAD MESSAGES FROM DEXIE
     ========================================
    */
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const cached =
                    await AIAssistantChatMessageTable.getAll();

                setMessages(cached);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };

        loadMessages();
    }, []);

    /*
     ========================================
     ADD MESSAGE HELPER
     ========================================
    */
    const addMessage = async (
        message: Omit<ChatMessageEntity, 'id'>
    ) => {
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
            console.error('Failed to save message:', error);

            return null;
        }
    };

    /*
     ========================================
     UPDATE MESSAGE
     ========================================
    */
    const updateAssistantMessage = async (
        id: number,
        content: string
    ) => {
        // update react state
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === id
                    ? {
                        ...msg,
                        content,
                    }
                    : msg
            )
        );

        // update dexie
        await AIAssistantChatMessageTable.update(id, {
            content,
        });
    };


    const fetchAiResponse = async (
        question: string
    ) => {
        if (!question.trim()) return;

        setIsLoading(true);

        try {
            /*
            USER MESSAGE
            */

            await addMessage({
                role: 'user',
                content: question,
            });

            /*
            EMPTY ASSISTANT MESSAGE
            */

            const assistantMessage =
                await addMessage({
                    role: 'assistant',
                    content: '',
                });

            let streamedText = '';

            await fetchAiAssistantResponse(
                question,
                messages,

                // token
                async (token) => {
                    streamedText += token;

                    if (assistantMessage && assistantMessage.id) {
                        await updateAssistantMessage(
                            assistantMessage.id,
                            streamedText
                        );
                    }
                },

                // done
                async () => {
                    setIsLoading(false);
                },

                // error
                async (errorMessage) => {
                    await addMessage({
                        role: 'assistant',
                        content:
                            '❌ ' + errorMessage,
                    });

                    setIsLoading(false);
                }
            );

            setAiInput('');
        } catch (err) {
            console.error(err);

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

                {/* <div className="flex gap-3">
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
                </div> */}

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
                        <AiMessageBlock key={i} noteId={m.id} message={m.content}>
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