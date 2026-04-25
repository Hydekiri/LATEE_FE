'use client';

import { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // Thêm để lấy sessionId
import { Header } from './Header';
import { ReasoningSidebar } from './ReasoningSideBar';
import { ReasoningChat } from './ReasoningChat';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { SubmitModal } from './Submit';
import { ReasoningChatMessage } from '../types';
import {
    ClinicalReasoningChatMessageTable,
    ClinicalReasoningChatMessageEntity,
    ClinicalReasoningDimensionTable
} from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import {
    ClinicalReasoningHistoryItem,
    fetchClinicalReasoningQuestion,
} from '@/src/services/clinical-reasoning-service';

const INITIAL_REASONING_QUESTION = 'Vậy kết luận của bạn là gì ?';
const ReasoningContent = ({ id }: { id: string }) => {
    const searchParams = useSearchParams();
    const sessionId = useMemo(() => 
        searchParams.get('sessionId') || `SESS_${id}_FALLBACK`, 
    [searchParams, id]);

    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ReasoningChatMessage[]>([]);
    const [interactionHistory, setInteractionHistory] = useState<ClinicalReasoningHistoryItem[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<{ question: string; dimension: string } | null>(null);
    const [isReasoningLoading, setIsReasoningLoading] = useState(false);
    const [reasoningError, setReasoningError] = useState<string | null>(null);

    const messageIdRef = useRef(1);
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const messagesData = await ClinicalReasoningChatMessageTable.getAll();
                if (messagesData.length > 0) {
                    setChatHistory(
                        messagesData.map((m) => ({
                            id: m.id ?? 0,
                            role: m.role,
                            content: m.content,
                            avatar: m.role === 'system' ? '/images/LVP1.jpeg' : '/images/doctor1.png',
                        }))
                    );
                    messageIdRef.current = Math.max(...messagesData.map((m) => m.id ?? 0)) + 1;
                } else {
                    const firstId = await ClinicalReasoningChatMessageTable.add({
                        role: 'system',
                        content: INITIAL_REASONING_QUESTION,
                        dimension: 'Mở đầu',
                    });
                    setChatHistory([{
                        id: Number(firstId),
                        role: 'system',
                        content: INITIAL_REASONING_QUESTION,
                        avatar: '/images/LVP1.jpeg',
                    }]);
                }
                const dimensionsData = await ClinicalReasoningDimensionTable.getAll();
                setInteractionHistory(dimensionsData.map(d => ({
                    dimension: d.dimension,
                    question: d.question,
                    answer: d.answer,
                })));

                setCurrentQuestion({
                    question: INITIAL_REASONING_QUESTION,
                    dimension: 'Mở đầu',
                });

            } catch (err) {
                console.error("Load Dexie Error:", err);
            }
        };
        loadData();
    }, []);

    const patientCase = useMemo(() => `Clinical case for session ${sessionId}`, [sessionId]);
    const learnerDiagnosis = useMemo(() => `Diagnosis for session ${sessionId}`, [sessionId]);

    const addMessage = async (data: Omit<ClinicalReasoningChatMessageEntity, 'id'>) => {
        const id = await ClinicalReasoningChatMessageTable.add(data);
        const newMessage: ReasoningChatMessage = {
            id: Number(id),
            role: data.role,
            content: data.content,
            avatar: data.role === 'system' ? '/images/LVP1.jpeg' : '/images/doctor1.png',
        };
        setChatHistory((prev) => [...prev, newMessage]);
        return Number(id);
    };

    const updateMessageById = async (id: number, content: string) => {
        setChatHistory((prev) => prev.map((msg) => msg.id === id ? { ...msg, content } : msg));
        await ClinicalReasoningChatMessageTable.update(id, { content });
    };

    const requestNextQuestion = async (historyPayload: ClinicalReasoningHistoryItem[]) => {
        setIsReasoningLoading(true);
        setReasoningError(null);

        const streamingId = await addMessage({ role: 'system', content: '', dimension: '' });
        let streamedQuestion = '';

        try {
            const response = await fetchClinicalReasoningQuestion(
                {
                    patient_case: patientCase,
                    learner_diagnosis: learnerDiagnosis,
                    interaction_history: historyPayload,
                },
                async (token) => {
                    streamedQuestion += token;
                    if (!streamedQuestion.trim().startsWith('{')) {
                        await updateMessageById(streamingId, streamedQuestion);
                    }
                },
                async (finalData) => {
                    if (finalData.stop) {
                        await updateMessageById(streamingId, 'Phiên phản biện đã kết thúc, hãy nộp bài.');
                        setCurrentQuestion(null);
                        return;
                    }
                    const finalMsg = (finalData.question || streamedQuestion).trim();
                    await updateMessageById(streamingId, finalMsg);
                    setCurrentQuestion({ question: finalMsg, dimension: finalData.dimension });
                }
            );
        } catch (error) {
            setChatHistory(prev => prev.filter(m => m.id !== streamingId));
            setReasoningError("Dịch vụ đang bận, vui lòng thử lại.");
        } finally {
            setIsReasoningLoading(false);
        }
    };

    const handleSendMessage = async (answer: string) => {
        if (!answer.trim() || isReasoningLoading || !currentQuestion) return;

        const nextHistory = [
            ...interactionHistory,
            { dimension: currentQuestion.dimension, question: currentQuestion.question, answer },
        ];

        await addMessage({ role: 'user', content: answer, dimension: currentQuestion.dimension });
        await ClinicalReasoningDimensionTable.add({
            dimension: currentQuestion.dimension,
            question: currentQuestion.question,
            answer
        });
        setInteractionHistory(nextHistory);

        await requestNextQuestion(nextHistory);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header isAiSidebarOpen={isAiSidebarOpen} onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <ReasoningSidebar onEndConversationClick={() => setIsConfirmModalOpen(true)} />
                <div className="flex-1 flex flex-col" ref={scrollRef}>
                    <ReasoningChat
                        history={chatHistory}
                        isSending={isReasoningLoading}
                        errorMessage={reasoningError}
                        onSendMessage={handleSendMessage}
                        onRetry={() => requestNextQuestion(interactionHistory)}
                    />
                </div>
                {isAiSidebarOpen && <AiAssistantSidebar />}
            </div>

            <SubmitModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                clinicalCaseId={id}
                sessionId={sessionId}
            />
        </div>
    );
};

// Component Export chính thức (có Wrap Suspense vì dùng useSearchParams)
export const ReasoningPage = ({ id }: { id: string }) => {
    return (
        <Suspense fallback={<div>Loading reasoning session...</div>}>
            <ReasoningContent id={id} />
        </Suspense>
    );
};