'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send, AlertTriangle, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAreaProps {
    history: ChatMessage[];
    setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    patientId: string;
}

export const ChatArea = ({ history, setHistory, patientId }: ChatAreaProps) => {
    const [inputMessage, setInputMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'warning' | 'chat'>('warning');
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // 1. Ref để tự động cuộn
    const scrollRef = useRef<HTMLDivElement>(null);

    // Tự động cuộn xuống mỗi khi history thay đổi (kể cả khi đang stream chữ)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleNoteClick = (noteId: number) => {
        setActiveTab('chat');
        setAiExplanation(
            `The learner’s statement is not appropriate...`
        );
        setIsPanelExpanded(true);
    };

    const togglePanel = (tab: 'warning' | 'chat') => {
        if (activeTab === tab) {
            setIsPanelExpanded(!isPanelExpanded);
        } else {
            setActiveTab(tab);
            setIsPanelExpanded(true);
        }
    };

    // 2. Hàm xử lý gửi tin nhắn & hứng Stream từ Backend
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage;
        setInputMessage(''); 

        // Thêm tin nhắn Doctor vào UI
        const newDoctorMsg: ChatMessage = {
            id: Date.now(),
            role: 'doctor',
            message: userMessage,
            avatar: '/images/VirtualPatient/VP3.jpeg'
        };
        setHistory(prev => [...prev, newDoctorMsg]);
        
        setIsLoading(true);

        try {
            // Gọi endpoint STREAM
            const response = await fetch('http://localhost:5000/virtual-patient/ai/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: "25697",
                    patient_id: patientId,
                    question: userMessage
                }),
            });

            if (!response.body) return;

            // Tạo tin nhắn Patient rỗng để chuẩn bị hứng token
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

            // Vòng lặp đọc Stream
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'token') {
                                accumulatedMessage += data.content;
                                // Cập nhật nội dung tin nhắn theo từng từ
                                setHistory(prev => prev.map(msg => 
                                    msg.id === patientMsgId 
                                    ? { ...msg, message: accumulatedMessage } 
                                    : msg
                                ));
                            }
                        } catch (e) {
                            // Bỏ qua nếu không phải JSON hợp lệ
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
            {/* --- 1. Chat Area (Cần có ref và overflow-y-auto) --- */}
            <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
            >
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

            {/* --- 2. Panel Warning & Assistant (Giữ nguyên giao diện của bạn) --- */}
            <div className="px-6">
                <div className={`rounded-t-xl overflow-hidden transition-all duration-300 ${isPanelExpanded ? 'shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]' : ''}`}>
                    <div className="flex items-center justify-between bg-white border-[#235697]">
                        <div className="flex items-stretch">
                            <button onClick={() => togglePanel('warning')} className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all ${activeTab === 'warning' ? 'bg-[#EF4444] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <AlertTriangle className="w-4 h-4" /> 
                                {isPanelExpanded && <span>Warning</span>}
                            </button>
                            <button onClick={() => togglePanel('chat')} className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-l border-gray-100 ${activeTab === 'chat' ? 'bg-[#235697] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <MessageSquare className="w-4 h-4" /> 
                                {isPanelExpanded && <span>Assistant</span>}
                            </button>
                        </div>
                        <div className="pr-4 text-red-600 font-bold text-[11px] uppercase flex items-center gap-1">
                            <span className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">!</span>
                            12 warning notes
                        </div>
                    </div>

                    <div className={`border border-[#E90000] border-[1.5px] transition-all duration-300 overflow-hidden ${isPanelExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className={`${activeTab === 'warning' ? 'bg-[#FFF1F1]' : 'bg-[#F8FAFC]'} p-0 overflow-y-auto max-h-64`}>
                            {activeTab === 'warning' ? (
                                <div className="divide-y divide-red-100/50">
                                    {[12, 14, 16].map((noteId) => (
                                        <div key={noteId} onClick={() => handleNoteClick(noteId)} className="px-5 py-3 flex gap-4 text-xs hover:bg-red-100/50 cursor-pointer transition-colors">
                                            <span className="font-bold text-red-600 shrink-0">! Note #{noteId}:</span>
                                            <span className="text-gray-700">Incorrect response. Click to see AI explanation...</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 space-y-4">
                                    {aiExplanation && (
                                        <div className="flex gap-3 animate-fadeIn">
                                            <div className="w-8 h-8 rounded-full bg-[#235697] flex items-center justify-center shrink-0">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 bg-[#E8F0F7] p-4 rounded-2xl rounded-tl-none text-[13px] leading-relaxed text-[#235697] shadow-sm border border-blue-100">
                                                <div className="flex items-center gap-2 text-red-600 font-bold mb-2"><AlertTriangle className="w-3.5 h-3.5" /> Note #12</div>
                                                {aiExplanation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. Khung nhập liệu (Sử dụng thẻ form) --- */}
            <div className="p-6 pt-0 bg-white">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="relative group"
                >
                    <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Patient is typing..." : "Type your message here..."}
                        className={`w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 ${
                            isPanelExpanded ? 'rounded-b-xl border-t-0' : 'rounded-xl'
                        } ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
                        autoFocus
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