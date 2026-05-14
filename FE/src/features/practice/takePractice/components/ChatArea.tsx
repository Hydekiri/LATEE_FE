// src/features/practice/takePractice/components/ChatArea.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { WarningPanel } from '@/src/features/practice/takePractice/components/WarningPanel';
import { NoteChatMessage, NoteChatState } from '../types/note';
import { ValidateQuestion } from '@/src/services/validate-question-service';
import { VPChatMessageTable, ChatMessageEntity } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { ValidationNoteTable, ValidationNoteEntity } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { getCookie } from '@/src/utils/cookies';

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

    const [noteID, setNoteID] = useState<string>('');
    const [notesState, setNotesState] = useState<Record<string, NoteChatState>>({});

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        setHistory([{
            id: 1706,
            role: 'patient',
            message: "Good morning, Doctor...",
            avatar: '/images/LVP1.jpeg'
        }]);
    }, [patientId, setHistory]);


    useEffect(() => {

        const loadData = async () => {
            const chatData = await VPChatMessageTable.getAll();

            if (chatData.length > 0) {
                setHistory(
                    chatData.map((msg) => ({
                        id: msg.id ?? (msg.role === 'user' ? 2004 : 1706), // Fallback ID
                        role:
                            msg.role === 'user'
                                ? 'doctor'
                                : 'patient',
                        message: msg.content,
                        avatar:
                            msg.role === 'user'
                                ? '/images/VirtualPatient/VP3.jpeg'
                                : '/images/LVP1.jpeg',
                    }))
                );
            } else {
                const firstId =
                    await VPChatMessageTable.add({
                        role: 'patient',
                        content: 'Good morning, Doctor...',
                    });
                setHistory([
                    {
                        id: Number(firstId),
                        role: 'patient',
                        message: 'Good morning, Doctor...',
                        avatar: '/images/LVP1.jpeg',
                    }
                ]);
            }
            const noteData = await ValidationNoteTable.getAll();
            const restoredNotes: Record<string, NoteChatState> = {};
            let maxNoteId = '';

            for (const note of noteData) {
                const currentId = note.id ?? '';
                maxNoteId = currentId;

                restoredNotes[currentId] = {
                    noteId: currentId,
                    isOpen: false,
                    showChat: false,
                    messages: [],
                    interactionHistory: [],
                    questionValidationResponse: {
                        reason: note.reason,
                        suggestion: note.suggestion,
                        severity: note.severity,
                        category: note.category,
                        confidence: note.confidence,
                    }
                };
            }

            setNoteID(maxNoteId);

            setNotesState(restoredNotes);
        };

        loadData();

    }, [patientId, setHistory]);


    const addChatMessage = async (
        role: 'user' | 'patient',
        content: string
    ) => {

        const id =
            await VPChatMessageTable.add({
                role,
                content,
            });

        const newMessage: ChatMessage = {
            id: Number(id),
            role:
                role === 'user'
                    ? 'doctor'
                    : 'patient',
            message: content,
            avatar:
                role === 'user'
                    ? '/images/VirtualPatient/VP3.jpeg'
                    : '/images/LVP1.jpeg',
        };

        setHistory(prev => [
            ...prev,
            newMessage
        ]);

        return Number(id);
    };

    const updateChatMessage = async (
        id: number,
        content: string
    ) => {

        setHistory(prev =>
            prev.map(msg =>
                msg.id === id
                    ? {
                        ...msg,
                        message: content
                    }
                    : msg
            )
        );

        await VPChatMessageTable.update(
            id,
            { content }
        );
    };


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!inputMessage.trim() || isLoading) {
            return;
        }

        const message = inputMessage.trim();

        setInputMessage('');

        await Promise.all([
            handleValidateQuestion(message),
            handleSendMessage(message),
        ]);
    };

    const handleSendMessage = async (userMessage: string) => {
        const chatHistoryForBE = history.map(msg => ({
            role: msg.role,
            content: msg.message
        }));

        await addChatMessage('user', userMessage);
        setIsLoading(true);

        // // 2. Cập nhật UI bằng câu hỏi mới của bác sĩ
        // setHistory(prev => [...prev, {
        //     id: Date.now(),
        //     role: 'doctor',
        //     message: userMessage,
        //     avatar: '/images/VirtualPatient/VP3.jpeg'
        // }]);

        // setIsLoading(true);

        try {
            const accessToken = getCookie('accessToken');
            const learnerId = getCookie("userId") || "unknown_learner";

            const response = await fetch('http://localhost:5000/virtual-patient/ai/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
                },
                body: JSON.stringify({
                    doctor_id: learnerId,
                    patient_id: patientId,
                    question: userMessage,
                    chat_history: chatHistoryForBE
                }),
            });

            if (!response.body) return;

            // const patientMsgId = Date.now() + 1;
            // setHistory(prev => [...prev, {
            //     id: patientMsgId,
            //     role: 'patient',
            //     message: '',
            //     avatar: '/images/LVP1.jpeg'
            // }]);

            const patientMsgId = await addChatMessage(
                'patient',
                ''
            );

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
                                // setHistory(prev => prev.map(msg =>
                                //     msg.id === patientMsgId ? { ...msg, message: accumulatedMessage } : msg
                                // ));
                                await updateChatMessage(
                                    patientMsgId,
                                    accumulatedMessage
                                );
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

    const handleValidateQuestion = async (message: string) => {
        const learnerId = getCookie("userId");
        const validationResponse = await ValidateQuestion({
            doctor_id: learnerId || "unknown_learner",
            learner_question: message,
            conversation_context: history.map(msg => ({
                role: msg.role === 'doctor' ? 'doctor' : 'patient',
                content: msg.message
            }))
        });

        if (validationResponse && validationResponse.isValid === false) {
            const recentContext = history.slice(-5).map(msg => ({
                role: msg.role === 'doctor' ? 'doctor' : 'patient',
                content: msg.message
            }));

            const userMessage: NoteChatMessage = {
                role: 'user',
                content: message
            };
            recentContext.push(userMessage);

            // setNoteID(prevId => {

            //     const newId = prevId + 1;

            //     setNotesState(prev => ({
            //         ...prev,

            //         [newId]: {
            //             noteId: newId,
            //             isOpen: false,
            //             showChat: false,
            //             messages: [],
            //             interactionHistory: recentContext.map(item => ({
            //                 role: item.role === 'doctor' ? 'doctor' : 'patient',
            //                 content: item.content
            //             })),
            //             questionValidationResponse: {
            //                 isValid:
            //                     validationResponse.isValid,
            //                 reason:
            //                     validationResponse.reason,
            //                 suggestion:
            //                     validationResponse.suggestion,
            //                 severity:
            //                     validationResponse.severity,
            //                 category:
            //                     validationResponse.category,
            //                 confidence:
            //                     validationResponse.confidence,
            //             }
            //         }
            //     }));

            //     return newId;
            // });


            /*
                SAVE NOTE TO DEXIE
                */
            const newId = crypto.randomUUID();
            await ValidationNoteTable.add({
                id: newId,
                question: message,
                reason:
                    validationResponse.reason,
                suggestion:
                    validationResponse.suggestion,
                category:
                    validationResponse.category,
                severity:
                    validationResponse.severity,
                confidence:
                    validationResponse.confidence,
            });

            //const newId = crypto.randomUUID()

            setNotesState(prev => ({

                ...prev,

                [newId]: {
                    noteId: newId,
                    isOpen: false,
                    showChat: false,
                    messages: [],
                    interactionHistory: recentContext.map(item => ({
                        role: item.role === 'doctor' ? 'doctor' : 'patient',
                        content: item.content
                    })),

                    questionValidationResponse: {
                        isValid:
                            validationResponse.isValid,
                        reason:
                            validationResponse.reason,
                        suggestion:
                            validationResponse.suggestion,
                        severity:
                            validationResponse.severity,
                        category:
                            validationResponse.category,
                        confidence:
                            validationResponse.confidence,
                    }
                }
            }));

            setNoteID(newId);
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
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${chat.role === 'doctor' ? 'bg-[#D1EFF9] text-gray-800 rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
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

                noteID={noteID}
                setNoteID={setNoteID}

                notesState={notesState}
                setNotesState={setNotesState}
            />

            {/* Input Area */}
            <div className="p-6 pt-0 bg-white">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="relative group">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                        placeholder={isLoading ? "Patient is typing..." : "Type your message here..."}
                        className={`w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 ${isPanelExpanded ? ' rounded-b-xl' : 'rounded-tr-xl rounded-br-xl rounded-bl-xl'
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