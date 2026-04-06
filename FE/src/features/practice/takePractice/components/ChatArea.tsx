// src/features/practice/takePractice/components/ChatArea.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { WarningPanel } from '@/src/features/practice/takePractice/components/WarningPanel';

interface ChatAreaProps {
    history: ChatMessage[];
    setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    patientId: string;
}

export const ChatArea = ({ history, setHistory, patientId }: ChatAreaProps) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // CHỈ CẦN RESET TRÊN UI, KHÔNG CẦN GỌI BACKEND NỮA
    useEffect(() => {
        setHistory([{
            id: Date.now(),
            role: 'patient',
            message: "Good morning, Doctor...",
            avatar: '/images/LVP1.jpeg'
        }]); 
    }, [patientId, setHistory]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage;
        setInputMessage(''); 

        // 1. Lưu lại snapshot của history HIỆN TẠI để gửi xuống Backend
        const chatHistoryForBE = history.map(msg => ({
            role: msg.role,
            content: msg.message
        }));

        // 2. Cập nhật UI bằng câu hỏi mới của bác sĩ
        setHistory(prev => [...prev, {
            id: Date.now(),
            role: 'doctor',
            message: userMessage,
            avatar: '/images/VirtualPatient/VP3.jpeg'
        }]);
        
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/virtual-patient/ai/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: "25697",
                    patient_id: patientId,
                    question: userMessage,
                    chat_history: chatHistoryForBE // ĐÍNH KÈM LỊCH SỬ CHAT TỪ FE XUỐNG
                }),
            });

            if (!response.body) return;

            const patientMsgId = Date.now() + 1;
            setHistory(prev => [...prev, {
                id: patientMsgId,
                role: 'patient',
                message: '',
                avatar: '/images/LVP1.jpeg'
            }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedMessage = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const rawData = line.substring(6).trim();
                            if (!rawData) continue;
                            
                            const data = JSON.parse(rawData);
                            if (data.type === 'token') {
                                accumulatedMessage += data.content;
                                setHistory(prev => prev.map(msg => 
                                    msg.id === patientMsgId ? { ...msg, message: accumulatedMessage } : msg
                                ));
                            }
                        } catch (e) {
                            console.error("Parse error:", e, "Line:", line);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Lỗi kết nối API Stream:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex flex-col bg-white relative transition-all duration-300">
            {/* Vùng Chat History */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                {history.map((chat) => (
                    <div key={chat.id} className={`flex gap-4 ${chat.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        {chat.role === 'patient' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image src="/images/LVP1.jpeg" width={40} height={40} alt="Patient" className="object-cover h-full w-full" />
                            </div>
                        )}
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            chat.role === 'doctor' ? 'bg-[#D1EFF9] text-gray-800 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                        }`}>
                            {chat.message || (chat.role === 'patient' && <span className="animate-pulse">...</span>)}
                        </div>
                        {chat.role === 'doctor' && (
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image src="/images/VirtualPatient/VP3.jpeg" width={40} height={40} alt="Doctor" className="object-cover h-full w-full" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <WarningPanel 
                isPanelExpanded={isPanelExpanded}
                setIsPanelExpanded={setIsPanelExpanded}
            />

            {/* Input Area */}
            <div className="p-6 pt-0 bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative group">
                    <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Patient is typing..." : "Type your message here..."}
                        className={`w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 ${
                            isPanelExpanded ? ' rounded-b-xl' : 'rounded-tr-xl rounded-br-xl rounded-bl-xl'
                        } ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-30"
                    >
                        <Send className={`w-6 h-6 rotate-[-15deg] group-hover:rotate-0 transition-transform ${isLoading ? 'animate-bounce' : ''}`} />
                    </button>
                </form>
            </div>
        </main>
    );
};