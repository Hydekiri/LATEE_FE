'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from './Header';
import { ReasoningSidebar } from './ReasoningSideBar';
import { ReasoningChat } from './ReasoningChat';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { SubmitModal } from './Submit';
import { ChatMessage } from '../types';
import {
    ClinicalReasoningHistoryItem,
    fetchClinicalReasoningQuestion,
} from '@/src/services/clinical-reasoning-service';

const INITIAL_REASONING_QUESTION = 'Vậy kết luận của bạn là gì ?';

export const ReasoningPage = ({ id }: { id: string }) => {
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [interactionHistory, setInteractionHistory] = useState<ClinicalReasoningHistoryItem[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<{ question: string; dimension: string } | null>(null);
    const [isReasoningLoading, setIsReasoningLoading] = useState(false);
    const [reasoningError, setReasoningError] = useState<string | null>(null);

    const messageIdRef = useRef(1);

    const patientCase = useMemo(
        () => `Clinical case from practice session ${id}.`,
        [id],
    );
    const learnerDiagnosis = useMemo(
        () => `Initial learner diagnosis for practice session ${id}.`,
        [id],
    );

    const appendChatMessage = (role: ChatMessage['role'], message: string) => {
        if (!message.trim()) {
            return;
        }

        setChatHistory((prev) => [
            ...prev,
            {
                id: messageIdRef.current++,
                role,
                message,
                avatar: role === 'patient' ? '/images/LVP1.jpeg' : '/images/doctor1.png',
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

        try {
            const response = await fetchClinicalReasoningQuestion({
                patient_case: patientCase,
                learner_diagnosis: learnerDiagnosis,
                interaction_history: historyPayload,
            });

            setCurrentQuestion({
                question: response.question,
                dimension: response.dimension,
            });

            if (response.question) {
                appendChatMessage('patient', response.question);
            }

            if (response.stop) {
                setCurrentQuestion(null);
            }
        } catch (error) {
            setReasoningError(mapReasoningError(error));
        } finally {
            setIsReasoningLoading(false);
        }
    };

    const handleSendMessage = async (answer: string) => {
        if (!answer.trim() || isReasoningLoading || !currentQuestion) {
            return;
        }

        appendChatMessage('doctor', answer);

        const nextInteractionHistory: ClinicalReasoningHistoryItem[] = [
            ...interactionHistory,
            {
                dimension: currentQuestion.dimension,
                question: currentQuestion.question,
                answer,
            },
        ];

        setInteractionHistory(nextInteractionHistory);
        await requestNextQuestion(nextInteractionHistory);
    };

    useEffect(() => {
        messageIdRef.current = 1;
        setChatHistory([
            {
                id: messageIdRef.current++,
                role: 'patient',
                message: INITIAL_REASONING_QUESTION,
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
            />
        </div>
    );
};

