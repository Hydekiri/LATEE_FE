'use client';

import Image from 'next/image';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { ReasoningMessage } from '@/src/hooks/useReasoningChat';

interface ReasoningChatProps {
    messages: ReasoningMessage[];
    isSending: boolean;
    isComplete: boolean;
    errorMessage?: string | null;
    onSendMessage: (message: string) => Promise<void>;
    onRetry?: () => Promise<void>;
}

export const ReasoningChat = ({
    messages,
    isSending,
    isComplete,
    errorMessage,
    onSendMessage,
    onRetry,
}: ReasoningChatProps) => {
    const [inputMessage, setInputMessage] = useState<string>('');

    const handleSend = async () => {
        const trimmed = inputMessage.trim();
        if (!trimmed || isSending) return;
        setInputMessage('');
        await onSendMessage(trimmed);
    };

    return (
        <main className="flex-1 flex flex-col bg-white relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((chat) => (
                    <div
                        key={chat.id}
                        className={`flex gap-4 ${
                            chat.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {chat.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image
                                    src="/images/LVP1.jpeg"
                                    width={40}
                                    height={40}
                                    alt="AI Reasoning"
                                    className="object-cover h-full w-full"
                                />
                            </div>
                        )}
                        <div
                            className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                chat.role === 'user'
                                    ? 'bg-[#D1EFF9] text-gray-800 rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                            }`}
                        >
                            {chat.dimension && (
                                <span className="text-xs font-bold text-[#1BA7D9] block mb-1 uppercase">
                                    {chat.dimension}
                                </span>
                            )}
                            {chat.content || (
                                <span className="animate-pulse text-gray-400">...</span>
                            )}
                        </div>
                        {chat.role === 'user' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image
                                    src="/images/VirtualPatient/VP3.jpeg"
                                    width={40}
                                    height={40}
                                    alt="Doctor"
                                    className="object-cover h-full w-full"
                                />
                            </div>
                        )}
                    </div>
                ))}

                {isSending && (
                    <div className="text-sm text-gray-500 pl-14 animate-pulse">
                        Creating new question...
                    </div>
                )}

                {isComplete && (
                    <div className="text-center text-sm text-[#10B981] font-bold py-2">
                        Reasoning session complete. Ready to submit.
                    </div>
                )}

                {errorMessage && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                        <span>{errorMessage}</span>
                        {onRetry && (
                            <button
                                onClick={() => void onRetry()}
                                disabled={isSending}
                                className="px-3 py-1.5 rounded-md border border-red-200 bg-white text-red-700 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Try again
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 pt-0 bg-white">
                <div className="relative group">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                void handleSend();
                            }
                        }}
                        disabled={isSending || isComplete}
                        placeholder={
                            isComplete
                                ? 'Reasoning complete — submit your diagnosis'
                                : 'Type your reasoning here...'
                        }
                        className="w-full pl-5 pr-14 py-4 border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 rounded-xl disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={() => void handleSend()}
                        disabled={isSending || !inputMessage.trim() || isComplete}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        <Send className="w-6 h-6 rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                    </button>
                </div>
            </div>
        </main>
    );
};