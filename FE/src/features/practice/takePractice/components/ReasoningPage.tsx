'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './Header';
import { ReasoningSidebar } from './ReasoningSideBar';
import { ReasoningChat } from './ReasoningChat';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { SubmitModal } from './Submit';
import { ReasoningChatMessage } from '../types';
import {
    ClinicalReasoningChatMessageTable,
    ClinicalReasoningChatMessageEntity,
    ClinicalReasoningDimensionTable,
    ClinicalReasoningDimensionEntity
} from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import {
    ClinicalReasoningHistoryItem,
    fetchClinicalReasoningQuestion,
} from '@/src/services/clinical-reasoning-service';
import { pre } from 'framer-motion/client';

const INITIAL_REASONING_QUESTION = 'Vậy kết luận của bạn là gì ?';

export const ReasoningPage = ({ id }: { id: string }) => {
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ReasoningChatMessage[]>([]);
    const [interactionHistory, setInteractionHistory] = useState<ClinicalReasoningHistoryItem[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<{ question: string; dimension: string } | null>(null);
    const [isReasoningLoading, setIsReasoningLoading] = useState(false);
    const [reasoningError, setReasoningError] = useState<string | null>(null);

    const messageIdRef = useRef(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [chatHistory]);


    /*
    ========================================
    LOAD CHAT HISTORY FROM DEXIE
    ========================================
    */

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const messagesData = await ClinicalReasoningChatMessageTable.getAll();

                if (messagesData.length > 0) {
                    setChatHistory(
                        messagesData.map((table) => ({
                            id: table.id ?? 0,
                            role: table.role,
                            content: table.content,
                            avatar:
                                table.role === 'system'
                                    ? '/images/LVP1.jpeg'
                                    : '/images/doctor1.png',
                        }))
                    );

                    messageIdRef.current =
                        Math.max(
                            ...messagesData.map((table) => table.id ?? 0)
                        ) + 1;

                }

                /*
                INIT FIRST MESSAGE
                */
                if (messagesData.length === 0) {
                    const firstId =
                        await ClinicalReasoningChatMessageTable.add({
                            role: 'system',
                            content:
                                INITIAL_REASONING_QUESTION,
                            dimension: 'Mở đầu',
                        });

                    setChatHistory([
                        {
                            id: Number(firstId),
                            role: 'system',
                            content:
                                INITIAL_REASONING_QUESTION,
                            avatar:
                                '/images/LVP1.jpeg',
                        },
                    ]);
                }

                setCurrentQuestion({
                    question:
                        INITIAL_REASONING_QUESTION,
                    dimension: 'Mở đầu',
                });

                /*LOAD DIMENSION */
                const dimensionsData = await ClinicalReasoningDimensionTable.getAll();
                setInteractionHistory(dimensionsData.map(d => ({
                    dimension: d.dimension,
                    question: d.question,
                    answer: d.answer,
                })));


            } catch (err) {
                console.error(err);
            }
        };

        loadMessages();
    }, []);

    /*
    ========================================
    HELPERS
    ========================================
    */

    const addMessage = async (
        data: Omit<
            ClinicalReasoningChatMessageEntity,
            'id'
        >
    ) => {
        const id = await ClinicalReasoningChatMessageTable.add(
            data
        );

        const newMessage: ReasoningChatMessage = {
            id: Number(id),
            role: data.role,
            content: data.content,
            avatar:
                data.role === 'system'
                    ? '/images/LVP1.jpeg'
                    : '/images/doctor1.png',
        };

        setChatHistory((prev) => [
            ...prev,
            newMessage,
        ]);

        return Number(id);
    };

    const updateMessageById = async (
        id: number,
        content: string
    ) => {
        /*
        UPDATE REACT STATE
        */

        setChatHistory((prev) =>
            prev.map((msg) =>
                msg.id === id
                    ? {
                        ...msg,
                        content,
                    }
                    : msg
            )
        );

        /*
        UPDATE DEXIE
        */

        await ClinicalReasoningChatMessageTable.update(
            id,
            {
                content,
            }
        );
    };

    const removeMessageById = async (
        id: number
    ) => {
        setChatHistory((prev) =>
            prev.filter((m) => m.id !== id)
        );

        await ClinicalReasoningChatMessageTable.delete(
            id
        );
    };

    const patientCase = useMemo(
        () => `Clinical case from practice session ${id}.`,
        [id],
    );
    const learnerDiagnosis = useMemo(
        () => `Initial learner diagnosis for practice session ${id}.`,
        [id],
    );

    const appendChatMessage = async (role: ReasoningChatMessage['role'], content: string, dimension: string, question: string) => {
        if (!content.trim()) {
            return;
        }

        await addMessage({
            role: role,
            content: content,
            dimension: dimension,
        });

        await ClinicalReasoningDimensionTable.add({
            dimension,
            question,
            answer: content,
        });

        setInteractionHistory((prev) => [
            ...prev,
            {
                dimension: dimension,
                question: question,
                answer: content,
            },
        ]);
    };

    const mapReasoningError = (error: unknown) => {
        const rawMessage = error instanceof Error ? error.message : '';
        const normalizedMessage = rawMessage.toLowerCase();

        if (normalizedMessage.includes('503') || normalizedMessage.includes('llm not available')) {
            return 'Dịch vụ Clinical Reasoning đang bận (503). Vui lòng thử lại sau vài giây.';
        }

        if (normalizedMessage.includes('timed out') || normalizedMessage.includes('timeout')) {
            return 'Yêu cầu hết thời gian xử lý. Vui lòng thử lại.';
        }

        return rawMessage || 'Không thể lấy câu hỏi reasoning. Vui lòng thử lại.';
    };

    const requestNextQuestion = async (historyPayload: ClinicalReasoningHistoryItem[]) => {
        setIsReasoningLoading(true);
        setReasoningError(null);

        const streamingPatientMessageId = await addMessage({
            role: 'system',
            content: '',
            dimension: '',
        });
        let streamedQuestion = '';

        try {
            const response = await fetchClinicalReasoningQuestion({
                patient_case: patientCase,
                learner_diagnosis: learnerDiagnosis,
                interaction_history: historyPayload,
            },
                async (token) => {
                    streamedQuestion += token;

                    // tránh render raw json
                    if (
                        streamedQuestion.trim().startsWith('{')
                    ) {
                        return;
                    }

                    await updateMessageById(
                        streamingPatientMessageId,
                        streamedQuestion
                    );
                },
                async (finalData) => {
                    const finalQuestion = (finalData.question || streamedQuestion).trim();

                    if (finalData.stop) {
                        await updateMessageById(
                            streamingPatientMessageId,
                            'Phiên phản biện đã kết thúc hãy nộp bài'
                        );

                        return;
                    }

                    if (finalQuestion) {
                        await updateMessageById(
                            streamingPatientMessageId,
                            finalQuestion
                        );
                    }
                },
            );

            setCurrentQuestion({
                question: response.question,
                dimension: response.dimension,
            });

            if (response.stop) {
                await updateMessageById(
                    streamingPatientMessageId,
                    'Phiên phản biện đã kết thúc hãy nộp bài'
                );
                setCurrentQuestion(null);
            }
        } catch (error) {
            await removeMessageById(streamingPatientMessageId);
            setReasoningError(mapReasoningError(error));
        } finally {
            setIsReasoningLoading(false);
        }
    };

    const handleSendMessage = async (answer: string) => {
        if (!answer.trim() || isReasoningLoading || !currentQuestion) {
            return;
        }

        const nextHistory = [
            ...interactionHistory,
            {
                dimension: currentQuestion.dimension,
                question: currentQuestion.question,
                answer,
            },
        ];

        await appendChatMessage('user', answer, currentQuestion.dimension, currentQuestion.question);

        await requestNextQuestion(nextHistory);
    };

    useEffect(() => {
        messageIdRef.current = 1;
        setChatHistory((prev) => [
            ...prev,
            {
                id: messageIdRef.current++,
                role: 'system',
                content: INITIAL_REASONING_QUESTION,
                avatar: '/images/LVP1.jpeg',
            },
        ]);
        setInteractionHistory([]);
        setCurrentQuestion({
            question: INITIAL_REASONING_QUESTION,
            dimension: 'Mở đầu',
        });
        setReasoningError(null);
        setIsReasoningLoading(false);
    }, [patientCase, learnerDiagnosis]);

    const handleRetry = async () => {
        await requestNextQuestion(interactionHistory);
    };

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden">
                <ReasoningSidebar onEndConversationClick={() => setIsConfirmModalOpen(true)} />
                <ReasoningChat
                    history={chatHistory}
                    isSending={isReasoningLoading}
                    errorMessage={reasoningError}
                    onSendMessage={handleSendMessage}
                    onRetry={handleRetry}
                />
                {isAiSidebarOpen && <AiAssistantSidebar />}
            </div>

            <SubmitModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                clinicalCaseId={id}
            />
        </div>
    );
};

