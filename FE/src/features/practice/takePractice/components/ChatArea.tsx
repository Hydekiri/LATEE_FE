'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Send, AlertTriangle, MessageSquare, ChevronDown, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { validateQuestionStream } from '@/src/services/question-validation-service';

interface ChatAreaProps {
    history: ChatMessage[];
    practiceId: string;
}

interface WarningNote {
    id: number;
    question: string;
    reason: string;
    suggestion: string;
    createdAt: string;
}

export const ChatArea = ({ history, practiceId }: ChatAreaProps) => {
    const [inputMessage, setInputMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'warning' | 'chat'>('warning');
    const [isPanelExpanded, setIsPanelExpanded] = useState(true);
    const [warningNotes, setWarningNotes] = useState<WarningNote[]>([]);
    const [selectedNote, setSelectedNote] = useState<WarningNote | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const warningStorageKey = useMemo(() => `practice-warning-notes-${practiceId}`, [practiceId]);

    useEffect(() => {
        const raw = window.localStorage.getItem(warningStorageKey);
        if (!raw) {
            setWarningNotes([]);
            setSelectedNote(null);
            return;
        }

        try {
            const parsed = JSON.parse(raw) as WarningNote[];
            setWarningNotes(parsed);
            setSelectedNote(parsed[0] ?? null);
        } catch {
            setWarningNotes([]);
            setSelectedNote(null);
        }
    }, [warningStorageKey]);

    useEffect(() => {
        window.localStorage.setItem(warningStorageKey, JSON.stringify(warningNotes));
    }, [warningNotes, warningStorageKey]);

    const handleNoteClick = (noteId: number) => {
        const clickedNote = warningNotes.find((note) => note.id === noteId) ?? null;
        setSelectedNote(clickedNote);
        setActiveTab('chat');
        setIsPanelExpanded(true);
    };

    const handleSendMessage = async () => {
        const learnerQuestion = inputMessage.trim();
        if (!learnerQuestion || isValidating) {
            return;
        }

        setIsValidating(true);
        setInputMessage('');

        const context = history.slice(-10).map((message) => ({
            role: message.role,
            content: message.message,
        }));

        let isInvalid = false;
        let reason = '';
        let suggestionText = '';

        try {
            await validateQuestionStream(
                {
                    "doctor_id": 'doctor-123',
                    "learner_question": learnerQuestion,
                    "conversation_context": context
                },
                (event) => {
                    if (event.type === 'done') {
                        return;
                    }

                    if (typeof event.isValid === 'boolean') {
                        isInvalid = !event.isValid;
                    }

                    if (event.reason) {
                        reason = event.reason;
                    }

                    if (event.suggestion) {
                        suggestionText += event.suggestion;
                    }
                },
            );

            if (isInvalid) {
                const newNote: WarningNote = {
                    id: Date.now(),
                    question: learnerQuestion,
                    reason: reason || 'Câu hỏi chưa phù hợp với quy trình chẩn đoán.',
                    suggestion: suggestionText.trim() || 'Hãy điều chỉnh câu hỏi theo đúng tiến trình khai thác bệnh sử.',
                    createdAt: new Date().toISOString(),
                };

                setWarningNotes((prev) => [newNote, ...prev]);
                setSelectedNote(newNote);
                setActiveTab('warning');
                setIsPanelExpanded(true);
            }
        } catch (error) {
            console.error('Validate question failed:', error);
        } finally {
            setIsValidating(false);
        }
    };

    const togglePanel = (tab: 'warning' | 'chat') => {
        if (activeTab === tab) {
            setIsPanelExpanded(!isPanelExpanded);
        } else {
            setActiveTab(tab);
            setIsPanelExpanded(true);
        }
    };

    return (
        <main className="flex-1 flex flex-col bg-white relative transition-all duration-300">
            {/* --- 1. Chat Area --- */}
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
            </div>

            {/* --- 2. Panel Warning & Assistant --- */}
            <div className="px-6">
                <div className={`rounded-t-xl overflow-hidden transition-all duration-300 ${isPanelExpanded ? 'shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]' : ''}`}>

                    {/* Tabs Header */}
                    <div className="flex items-center justify-between bg-white border-[#235697]">
                        <div className="flex items-stretch">
                            {/* Tab Warning */}
                            <button
                                onClick={() => togglePanel('warning')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all ${activeTab === 'warning' ? 'bg-[#EF4444] text-white' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {isPanelExpanded && (
                                    <>
                                        <span>Warning</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeTab === 'warning' ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>

                            {/* Tab Assistant */}
                            <button
                                onClick={() => togglePanel('chat')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold transition-all border-l border-gray-100 ${activeTab === 'chat' ? 'bg-[#235697] text-white' : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                {isPanelExpanded && (
                                    <>
                                        <span>Assistant</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeTab === 'chat' ? 'rotate-180' : ''}`} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Nhãn số lượng Note */}

                        <div className="pr-4 text-red-600 font-bold text-[11px] uppercase tracking-tight flex items-center gap-1">
                            <span className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">!</span>
                            {warningNotes.length} warning notes
                        </div>

                    </div>

                    {/* Nội dung bên trong Tab */}
                    <div className={`border border-[#E90000] border-[1.5px] transition-all duration-300 ease-in-out overflow-hidden ${isPanelExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className={`${activeTab === 'warning' ? 'bg-[#FFF1F1]' : 'bg-[#F8FAFC]'} p-0 overflow-y-auto max-h-64`}>
                            {activeTab === 'warning' ? (
                                <div className="divide-y divide-red-100/50">
                                    {warningNotes.length === 0 && (
                                        <div className="px-5 py-3 text-xs text-gray-500">No warning notes yet.</div>
                                    )}

                                    {warningNotes.map((note, index) => (
                                        <div
                                            key={note.id}
                                            onClick={() => handleNoteClick(note.id)}
                                            className="px-5 py-3 flex gap-4 text-xs hover:bg-red-100/50 cursor-pointer transition-colors"
                                        >
                                            <span className="font-bold text-red-600 shrink-0">! Note #{warningNotes.length - index}:</span>
                                            <span className="text-gray-700 line-clamp-2">{note.reason} <p></p> {note.suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-5 space-y-4">
                                    {selectedNote && (
                                        <div className="flex gap-3 animate-fadeIn">
                                            <div className="w-8 h-8 rounded-full bg-[#235697] flex items-center justify-center shrink-0">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 bg-[#E8F0F7] p-4 rounded-2xl rounded-tl-none text-[13px] leading-relaxed text-[#235697] shadow-sm border border-blue-100">
                                                <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> Warning Note
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Reason: {selectedNote.reason}</p>
                                                <p>{selectedNote.suggestion}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedNote && (
                                        <div className="flex justify-end">
                                            <div className="max-w-[80%] bg-[#D1EFF9] p-3 rounded-2xl rounded-tr-none text-xs text-gray-700 shadow-sm">
                                                {selectedNote.question}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. Khung nhập liệu (Input) --- */}
            <div className="p-6 pt-0 bg-white">
                <div className="relative group">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                void handleSendMessage();
                            }
                        }}
                        placeholder="Type your message here..."
                        className={`w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 ${isPanelExpanded ? 'rounded-b-xl border-t-0' : 'rounded-xl'
                            }`}
                    />
                    <button
                        onClick={() => void handleSendMessage()}
                        disabled={isValidating}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-6 h-6 rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                    </button>
                </div>
            </div>
        </main>
    );
};