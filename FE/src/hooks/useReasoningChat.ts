// src/hooks/useReasoningChat.ts
'use client';
import { useState, useCallback, useRef } from 'react';
import {
    fetchClinicalReasoningQuestion,
    ClinicalReasoningHistoryItem,
    ClinicalReasoningResponse,
} from '@/src/services/clinical-reasoning-service';
import { ClinicalReasoningChatMessageTable, ClinicalReasoningDimensionTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';

export interface ReasoningMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    dimension?: string;
}

interface UseReasoningChatOptions {
    patientCase: string;
    sessionId: string;
}

export function useReasoningChat({ patientCase, sessionId }: UseReasoningChatOptions) {
    const [messages, setMessages] = useState<ReasoningMessage[]>([]);
    const [diagnosis, setDiagnosis] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const isSendingRef = useRef<boolean>(false);
    const diagnosisRef = useRef<string>('');
    const interactionHistory = useRef<ClinicalReasoningHistoryItem[]>([]);

    const addDexieMessage = useCallback(
        async (role: 'user' | 'assistant', content: string, dimension?: string): Promise<number> => {
            const id = await ClinicalReasoningChatMessageTable.add({
                role,
                content,
                sessionId,
                createdAt: Date.now(),
                dimension,
            });
            return Number(id);
        },
        [sessionId]
    );

    const updateDexieMessage = useCallback(async (id: number, content: string): Promise<void> => {
        await ClinicalReasoningChatMessageTable.update(id, { content });
    }, []);

    const loadFromDexie = useCallback(async (): Promise<void> => {
        if (!sessionId) return;
        try {
            const stored = await ClinicalReasoningChatMessageTable.getBySession(sessionId);
            if (stored.length > 0) {
                const mapped: ReasoningMessage[] = stored.map((m) => ({
                    id: m.id ?? Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
                    role: m.role,
                    content: m.content,
                    dimension: m.dimension,
                }));
                setMessages(mapped);

                const dims = await ClinicalReasoningDimensionTable.getAll();
                interactionHistory.current = dims.map((d) => ({
                    dimension: d.dimension,
                    question: d.question,
                    answer: d.answer,
                }));
            }
        } catch (e) {
            console.error('[useReasoningChat] loadFromDexie error:', e);
        }
    }, [sessionId]);

    const callReasoningWithStream = useCallback(
        async (
            history: ClinicalReasoningHistoryItem[],
            currentDiagnosis: string,
            onFinal: (response: ClinicalReasoningResponse) => void
        ): Promise<void> => {
            // Sửa đổi để tránh trùng Key React
            const placeholderId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
            setMessages((prev) => [
                ...prev,
                { id: placeholderId, role: 'assistant', content: '', dimension: '' },
            ]);
            const dexieId = await addDexieMessage('assistant', '', '');

            let streamedText = '';

            try {
                const response = await fetchClinicalReasoningQuestion(
                    {
                        patient_case: patientCase,
                        learner_diagnosis: currentDiagnosis,
                        interaction_history: history,
                    },
                    (token: string) => {
                        streamedText += token;
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === placeholderId
                                    ? { ...m, content: streamedText }
                                    : m
                            )
                        );
                    },
                    (finalData: ClinicalReasoningResponse) => {
                        const finalContent = finalData.stop
                            ? 'Clinical reasoning complete. You may now submit your final diagnosis.'
                            : (finalData.question || streamedText).trim();

                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === placeholderId
                                    ? {
                                        ...m,
                                        content: finalContent,
                                        dimension: finalData.dimension,
                                    }
                                    : m
                            )
                        );

                        updateDexieMessage(dexieId, finalContent).catch(console.error);
                        onFinal(finalData);
                    }
                );

                if (!response.stop && response.question && streamedText === '') {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === placeholderId
                                ? { ...m, content: response.question, dimension: response.dimension }
                                : m
                        )
                    );
                    updateDexieMessage(dexieId, response.question).catch(console.error);
                    onFinal(response);
                }
            } catch (err) {
                console.error('[useReasoningChat] streaming error:', err);
                const errContent = 'Unable to generate question. Please try again.';
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === placeholderId ? { ...m, content: errContent } : m
                    )
                );
                updateDexieMessage(dexieId, errContent).catch(console.error);
            }
        },
        [patientCase, addDexieMessage, updateDexieMessage]
    );

    const startReasoning = useCallback(
        async (initialDiagnosis: string): Promise<void> => {
            if (isSendingRef.current) return;
            isSendingRef.current = true;
            setIsSending(true);
            setDiagnosis(initialDiagnosis);
            diagnosisRef.current = initialDiagnosis;
            interactionHistory.current = [];

            try {
                await callReasoningWithStream([], initialDiagnosis, (finalData) => {
                    if (finalData.stop) {
                        setIsComplete(true);
                    }
                });
            } finally {
                isSendingRef.current = false;
                setIsSending(false);
            }
        },
        [callReasoningWithStream]
    );

    const sendAnswer = useCallback(
        async (answer: string, lastAiMsg?: ReasoningMessage): Promise<void> => {
            if (!answer.trim() || isSendingRef.current) return;
            isSendingRef.current = true;
            setIsSending(true);

            // Sửa đổi để tránh trùng Key React
            const userMsgId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
            setMessages((prev) => [
                ...prev,
                { id: userMsgId, role: 'user', content: answer },
            ]);
            addDexieMessage('user', answer, lastAiMsg?.dimension).catch(console.error);

            if (lastAiMsg) {
                const historyEntry: ClinicalReasoningHistoryItem = {
                    dimension: lastAiMsg.dimension ?? 'general',
                    question: lastAiMsg.content,
                    answer,
                };
                interactionHistory.current = [...interactionHistory.current, historyEntry];

                ClinicalReasoningDimensionTable.add({
                    dimension: historyEntry.dimension,
                    question: historyEntry.question,
                    answer: historyEntry.answer,
                }).catch(console.error);
            }

            try {
                await callReasoningWithStream(
                    interactionHistory.current,
                    diagnosisRef.current,
                    (finalData) => {
                        if (finalData.stop) {
                            setIsComplete(true);
                        }
                    }
                );
            } finally {
                isSendingRef.current = false;
                setIsSending(false);
            }
        },
        [callReasoningWithStream, addDexieMessage]
    );

    return {
        messages,
        diagnosis,
        setDiagnosis,
        isSending,
        isComplete,
        sendAnswer,
        startReasoning,
        loadFromDexie,
    };
}