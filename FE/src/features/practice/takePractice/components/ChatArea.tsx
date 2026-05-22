'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';
import { useVpChat } from '@/src/hooks/useVpChat';
import { PatientData } from '@/src/types/practice';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { WarningPanel } from './WarningPanel';
import { ConfirmModal } from './ConfirmModal';
import type { NoteChatState } from '@/src/features/practice/takePractice/types/note';

interface ChatMsgProps {
    readonly role: 'user' | 'patient';
    readonly message: string;
    readonly avatar: string;
}

const ChatBubble = ({ role, message, avatar }: ChatMsgProps) => (
    <div className={`flex gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {role === 'patient' && (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <Image
                    src={avatar}
                    width={40}
                    height={40}
                    alt="Patient"
                    className="object-cover h-full w-full"
                    unoptimized={avatar.startsWith('http') || avatar.startsWith('/images/')}
                />
            </div>
        )}
        <div
            className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                role === 'user'
                    ? 'bg-[#235697] text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
            }`}
        >
            {message || (role === 'patient' && <span className="animate-pulse">...</span>)}
        </div>
        {role === 'user' && (
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <Image
                    src={avatar}
                    width={40}
                    height={40}
                    alt="Doctor"
                    className="object-cover h-full w-full"
                />
            </div>
        )}
    </div>
);

interface ChatAreaProps {
    readonly patientData: PatientData;
    readonly sessionId: string;
    readonly vpElapsed: number;
    readonly onProceedToReasoning: () => void;
}

export const ChatArea = ({
    patientData,
    sessionId,
    onProceedToReasoning,
}: ChatAreaProps) => {
    const [input, setInput] = useState<string>('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isPanelExpanded, setIsPanelExpanded] = useState<boolean>(false);
    const [noteID, setNoteID] = useState<string>('');
    const [notesState, setNotesState] = useState<Record<string, NoteChatState>>({});
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    const sessionIdRef = useRef<string>(sessionId);
    useEffect(() => {
        sessionIdRef.current = sessionId;
    }, [sessionId]);

    const handleWarning = useCallback(
        (warning: {
            noteId: string;
            reason: string;
            suggestion: string;
            severity: string;
            category: string;
        }) => {
            const id = warning.noteId;
            const currentSessionId = sessionIdRef.current;

            setNotesState((prev) => ({
                ...prev,
                [id]: {
                    noteId: id,
                    isOpen: false,
                    showChat: false,
                    messages: [],
                    interactionHistory: [],
                    questionValidationResponse: {
                        reason: warning.reason,
                        suggestion: warning.suggestion,
                        severity: warning.severity,
                        category: warning.category,
                        confidence: null,
                    },
                },
            }));
            setNoteID(id);
            setIsPanelExpanded(true);

            ValidationNoteTable.add({
                noteId: id,
                reason: warning.reason,
                category: warning.category,
                sessionId: currentSessionId,
                createdAt: Date.now(),
                suggestion: warning.suggestion,
                severity: warning.severity,
            }).catch(console.error);
        },
        [] 
    );

    const { messages, isSending, isValidating, sendMessage } = useVpChat({
        patientData,
        sessionId,
        onWarning: handleWarning,
    });

    useEffect(() => {
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages.length]);

    useEffect(() => {
        if (!isSending && !isValidating) {
            inputRef.current?.focus();
        }
    }, [isSending, isValidating]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const text = input.trim();
        if (!text || isSending) return;
        setInput('');
        await sendMessage(text);
    };

    const handleFinalConfirm = (diagnosis?: string) => {
        setIsConfirmModalOpen(false);
        console.log('Saved Diagnosis Data:', diagnosis);
        onProceedToReasoning();
    };

    return (
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white relative transition-all duration-300 overflow-hidden z-10">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        role={msg.role}
                        message={msg.message}
                        avatar={msg.avatar}
                    />
                ))}
                {(isSending || isValidating) && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs pl-14">
                        <span className="animate-pulse italic">
                            {isValidating ? 'Checking medical accuracy...' : 'Patient is typing...'}
                        </span>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="relative z-20">
                <WarningPanel
                    isPanelExpanded={isPanelExpanded}
                    setIsPanelExpanded={setIsPanelExpanded}
                    noteID={noteID}
                    setNoteID={setNoteID}
                    notesState={notesState}
                    setNotesState={setNotesState}
                />
            </div>

            <div className="p-6 pt-0 bg-white shrink-0 relative z-30">
                <form onSubmit={handleSend} className="relative group">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isSending ? 'Waiting for response...' : 'Ask the patient about symptoms, history...'}
                        disabled={isSending}
                        className={`w-full pl-5 pr-14 py-4 border border-[#235697] border-[1.5px] focus:outline-none focus:border-[#235697] text-sm shadow-sm transition-all duration-300 select-text pointer-events-auto ${
                            isPanelExpanded ? 'rounded-b-xl' : 'rounded-tr-xl rounded-br-xl rounded-bl-xl'
                        } ${isSending ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800'}`}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 z-40"
                    >
                        <Send className="w-5 h-5 rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                    </button>
                </form>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={handleFinalConfirm}
                requireDiagnosis={true}
            />
        </div>
    );
};