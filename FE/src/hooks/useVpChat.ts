// src/hooks/useVpChat.ts
'use client';
import { useState, useCallback, useRef, useMemo } from 'react'; 
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { getAvatarByAge } from "@/src/utils/patient-assets"; 
import { PatientData } from '@/src/types/practice'; 
import { ValidateQuestion } from '@/src/services/validate-question-service';

export interface VpChatMessage {
    id: number;
    role: 'user' | 'patient';
    message: string;
    avatar: string;
}

interface StreamData {
    type: 'token' | 'done';
    content?: string;
}

interface UseVpChatOptions {
    patientData: PatientData; 
    sessionId: string;
    onWarning?: (warning: {
        noteId: string;
        reason: string;
        suggestion: string;
        severity: string;
        category: string;
    }) => void;
}

interface FlexiblePatientData extends Partial<PatientData> {
    patientId?: string;
    id?: string;
    age?: number;
    gender?: string;
    img?: string;
}

export function useVpChat({ patientData, sessionId, onWarning }: UseVpChatOptions) {
    const flexiblePatient = patientData as FlexiblePatientData;

    const displayImage = useMemo(() => {
        if (!flexiblePatient) return '/images/VirtualPatient/VP5.jpeg'; 

        if (flexiblePatient.img && flexiblePatient.img.startsWith('http') && !flexiblePatient.img.includes("VP7.jpeg")) {
            return flexiblePatient.img;
        }

        if (flexiblePatient.img && flexiblePatient.img.startsWith('/images') && !flexiblePatient.img.includes("VP7.jpeg")) {
            return flexiblePatient.img;
        }
        
        const safeId = flexiblePatient.id || flexiblePatient.patientId || "default";
        const safeAge = flexiblePatient.age ?? 30;
        const safeGender = flexiblePatient.gender ?? "Unknown";

        return getAvatarByAge(String(safeId), safeAge, safeGender);
    }, [flexiblePatient?.id, flexiblePatient?.patientId, flexiblePatient?.age, flexiblePatient?.gender, flexiblePatient?.img]);

    const [messages, setMessages] = useState<Omit<VpChatMessage, 'avatar'>[]>([
        {
            id: 1,
            role: 'patient',
            message: 'Hello, doctor!',
        },
    ]);

    const synchronizedMessages = useMemo<VpChatMessage[]>(() => {
        return messages.map((m) => ({
            ...m,
            avatar: m.role === 'patient' ? displayImage : '/images/doctor1.png',
        }));
    }, [messages, displayImage]);
    
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const isSendingRef = useRef<boolean>(false);
    
    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isSendingRef.current) return;
            isSendingRef.current = true;
            setIsSending(true);

            // Sửa lỗi trùng key bằng chuỗi số an toàn hơn
            const userMsgId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
            const userMsg = {
                id: userMsgId,
                role: 'user' as const,
                message: text,
            };
            setMessages((prev) => [...prev, userMsg]);

            await VPChatMessageTable.add({
                role: 'user',
                content: text,
                sessionId,
                createdAt: Date.now(),
            }).catch(console.error);

            const chatHistoryForAi = synchronizedMessages.map((m) => ({
                role: m.role === 'user' ? 'doctor' as const : 'patient' as const,
                content: m.message,
            }));

            void (async () => {
                try {
                    setIsValidating(true);
                    const validation = await ValidateQuestion({
                        doctor_id: getCookie('userId') || 'DR-001',
                        learner_question: text,
                        conversation_context: chatHistoryForAi,
                    });
                    
                    if (!validation.isValid && onWarning) {
                        // Sửa lỗi trùng key cho Note ID
                        const generatedNoteId = `NOTE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
                        onWarning({
                            noteId: generatedNoteId,
                            reason: validation.reason,
                            suggestion: validation.suggestion,
                            severity: validation.severity,
                            category: validation.category,
                        });
                    }
                } catch (err) {
                    console.error('[Validation Background Process] Error:', err);
                } finally {
                    setIsValidating(false);
                }
            })();

            try {
                const finalPatientId = flexiblePatient.id || flexiblePatient.patientId;
                const accessToken = getCookie('accessToken');

                const streamRes = await fetch(`${API_BASE_URL}/virtual-patient/ai/stream`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
                    },
                    body: JSON.stringify({
                        doctor_id: getCookie('userId') || 'DR-001',
                        patient_id: String(finalPatientId), 
                        question: text,
                        chat_history: chatHistoryForAi, 
                    }),
                });

                if (!streamRes.ok) throw new Error(`VP API error: ${streamRes.status}`);

                // Sửa lỗi trùng key cho stream message id
                const streamMsgId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
                const streamMsg = {
                    id: streamMsgId,
                    role: 'patient' as const,
                    message: '',
                };
                setMessages((prev) => [...prev, streamMsg]);

                const reader = streamRes.body?.getReader();
                const decoder = new TextDecoder();
                let accumulatedReply = '';

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

                        for (const line of lines) {
                            const rawData = line.replace('data: ', '').trim();
                            if (!rawData) continue;

                            try {
                                const parsed = JSON.parse(rawData) as StreamData;
                                
                                if (parsed.type === 'token' && parsed.content) {
                                    accumulatedReply += parsed.content;
                                    setMessages((prev) =>
                                        prev.map((m) =>
                                            m.id === streamMsgId
                                                ? { ...m, message: accumulatedReply }
                                                : m
                                        )
                                    );
                                } else if (parsed.type === 'done') {
                                    break;
                                }
                            } catch (e) {
                                console.error("Error parsing stream chunk:", e);
                            }
                        }
                    }
                }

                if (accumulatedReply) {
                    await VPChatMessageTable.add({
                        role: 'assistant',
                        content: accumulatedReply,
                        sessionId,
                        createdAt: Date.now(),
                    }).catch(console.error);
                }

            } catch (error) {
                console.error('[useVpChat] Stream Chat Error:', error);
                const errId = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
                const errMsg = {
                    id: errId,
                    role: 'patient' as const,
                    message: 'I am having trouble responding.',
                };
                setMessages((prev) => [...prev, errMsg]);
            } finally {
                isSendingRef.current = false;
                setIsSending(false);
            }
        },
        [synchronizedMessages, sessionId, onWarning, flexiblePatient.id, flexiblePatient.patientId, displayImage]
    );

    return { messages: synchronizedMessages, isSending, isValidating, sendMessage };
}