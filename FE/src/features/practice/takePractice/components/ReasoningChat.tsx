'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ReasoningChatProps {
    history: ChatMessage[];
    isSending: boolean;
    errorMessage?: string | null;
    onSendMessage: (message: string) => Promise<void> | void;
    onRetry: () => Promise<void> | void;
}

export const ReasoningChat = ({ history, isSending, errorMessage, onSendMessage, onRetry }: ReasoningChatProps) => {
    const [inputMessage, setInputMessage] = useState('');

    const handleSend = async () => {
        const trimmedMessage = inputMessage.trim();
        if (!trimmedMessage || isSending) {
            return;
        }

        setInputMessage('');
        await onSendMessage(trimmedMessage);
    };

    return (
        <main className="flex-1 flex flex-col bg-white relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {history.map((chat) => (
                    <div key={chat.id} className={`flex gap-4 ${chat.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        {chat.role === 'patient' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image src="/images/LVP1.jpeg" width={40} height={40} alt="Patient" className="object-cover h-full w-full" />
                            </div>
                        )}
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${chat.role === 'doctor' ? 'bg-[#D1EFF9] text-gray-800 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                            }`}>
                            {chat.message}
                        </div>
                        {chat.role === 'doctor' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image src="/images/VirtualPatient/VP3.jpeg" width={40} height={40} alt="Doctor" className="object-cover h-full w-full" />
                            </div>
                        )}
                    </div>
                ))}

                {isSending && (
                    <div className="text-sm text-gray-500">Đang tạo câu hỏi tiếp theo...</div>
                )}

                {errorMessage && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                        <span>{errorMessage}</span>
                        <button
                            onClick={() => void onRetry()}
                            disabled={isSending}
                            className="px-3 py-1.5 rounded-md border border-red-200 bg-white text-red-700 text-xs font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Thử lại
                        </button>
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
                        disabled={isSending}
                        placeholder="Type your message here..."
                        className="w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 rounded-xl disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={() => void handleSend()}
                        disabled={isSending || !inputMessage.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:text-gray-400 disabled:hover:bg-transparent"
                    >
                        <Send className="w-6 h-6 rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                    </button>
                </div>
            </div>
        </main>
    );
};