// src/features/practice/takePractice/components/ReasoningPage.tsx

'use client';

import { useEffect, useState, useRef, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from './Header';
import { ReasoningSidebar } from './ReasoningSideBar';
import { ReasoningChat } from './ReasoningChat';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { SubmitModal } from './Submit';
import { useReasoningChat, ReasoningMessage } from '@/src/hooks/useReasoningChat';
import { usePracticeTimer } from '@/src/hooks/usePracticeTimer';
import { practiceSessionStore } from '@/src/stores/practiceSessionStore';
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import { useExitProtection } from '@/src/hooks/useExitProtection';
import { ApiHttpError, practiceSessionService } from '@/src/services/practice-session-service';
import { ExitConfirmModal } from "@/src/features/practice/takePractice/components/ExitConfirmModal";

interface ReasoningPageProps {
    id: string;
}

interface PatientApiResponse {
    chiefConcern?: string;
    description?: string;
    medicalHistory?: string;
    symptom?: string;
    avatarImage?: string | null;
    argumentTime?: number;
}

const ReasoningContent = ({ id }: ReasoningPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sessionId = useMemo(
        () => searchParams.get('sessionId') ?? `SESS_${id}_FALLBACK`,
        [searchParams, id]
    );
    const vpDuration = useMemo(
        () => parseInt(searchParams.get('vpDuration') ?? '0', 10),
        [searchParams]
    );

    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [patientData, setPatientData] = useState<PatientApiResponse | null>(null);
    const [reasoningError, setReasoningError] = useState<string | null>(null);
    const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);

    const hasStarted = useRef<boolean>(false);
    const hasPatchedStatus = useRef<boolean>(false);
    const lastAiMsgRef = useRef<ReasoningMessage | null>(null);

    useExitProtection({
        enabled: !isExiting,
        onExitAttempt: () => setIsExitModalOpen(true),
    });

    const timer = usePracticeTimer({
        autoStart: true,
        storageKey: `reasoning_timer_${sessionId}`,
    });

    const patchStatusOnce = useCallback(async (status: string): Promise<void> => {
        if (!sessionId || hasPatchedStatus.current) return;
        hasPatchedStatus.current = true;
        try {
            await practiceSessionService.patchStatus(
                sessionId,
                status as Parameters<typeof practiceSessionService.patchStatus>[1]
            );
        } catch (e) {
            if (e instanceof ApiHttpError && e.status === 404) {
                console.warn('[ReasoningPage] status sync endpoint unavailable (404):', e.url);
                return;
            }
            console.error('[ReasoningPage] patchStatus error:', e);
            hasPatchedStatus.current = false;
        }
    }, [sessionId]);

    useEffect(() => {
        let cancelled = false;
        const fetchPatient = async () => {
            try {
                const accessToken = getCookie('accessToken');
                const res = await fetch(
                    `${API_BASE_URL}/virtual-patient/api/virtual-patients/${id}`,
                    { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
                );
                if (res.ok && !cancelled) {
                    const data = (await res.json()) as PatientApiResponse;
                    setPatientData(data);
                }
            } catch (e) {
                console.error('[ReasoningPage] Failed to load patient:', e);
            }
        };
        void fetchPatient();
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        void patchStatusOnce('ReasoningStarted');
    }, [patchStatusOnce]);

    const patientCase = useMemo(() => {
        if (!patientData) return `Clinical case for session ${sessionId}`;
        const concern = patientData.chiefConcern ?? patientData.symptom ?? 'Unknown concern';
        const history =
            patientData.medicalHistory ?? patientData.description ?? 'Not available';
        return `${concern}. Medical history: ${history}`;
    }, [patientData, sessionId]);

    const { messages, isSending, isComplete, sendAnswer, startReasoning, loadFromDexie } =
        useReasoningChat({ patientCase, sessionId });

    useEffect(() => {
        if (!sessionId) return;
        void loadFromDexie();
    }, [sessionId, loadFromDexie]);

    useEffect(() => {
        if (!patientData || hasStarted.current || !sessionId) return;
        hasStarted.current = true;

        const stored = practiceSessionStore.load();
        const storedDiagnosis =
            stored?.sessionId === sessionId && stored.phase === 'reasoning'
                ? 'To be determined'
                : 'To be determined';

        void startReasoning(storedDiagnosis);
    }, [patientData, sessionId, startReasoning]);

    useEffect(() => {
        const aiMsgs = messages.filter((m) => m.role === 'assistant');
        if (aiMsgs.length > 0) {
            lastAiMsgRef.current = aiMsgs[aiMsgs.length - 1];
        }
    }, [messages]);

    const handleSendMessage = async (answer: string): Promise<void> => {
        setReasoningError(null);
        try {
            await sendAnswer(answer, lastAiMsgRef.current ?? undefined);
        } catch {
            setReasoningError(
                'An error occurred while processing your answer. Please try again.'
            );
        }
    };

    const handleRetry = async (): Promise<void> => {
        setReasoningError(null);
        hasStarted.current = false;
        await startReasoning('To be determined');
    };

    const handleConfirmExit = async (): Promise<void> => {
        setIsExiting(true);
        try {
            timer.stop();
        } catch (timerErr) {
            console.error('[ReasoningPage] Failed to stop timer:', timerErr);
        }

        try {
            await practiceSessionService.patchStatus(sessionId, 'Abandoned');
        } catch (apiErr) {
            console.warn('[ReasoningPage] Backend session sync skipped or failed (404/500):', apiErr);
        }

        setIsExiting(false);
        router.push(`/practice/${id}`);
    };

    const maxTimeArgument = useMemo(
        () => (patientData?.argumentTime ? patientData.argumentTime * 60 : 1800),
        [patientData]
    );

    const remainingSeconds = useMemo(
        () => Math.max(0, maxTimeArgument - timer.elapsed),
        [maxTimeArgument, timer.elapsed]
    );

    const countdownDisplay = useMemo(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [remainingSeconds]);

    const progressPercent = useMemo(
        () => Math.max(0, (remainingSeconds / maxTimeArgument) * 100),
        [remainingSeconds, maxTimeArgument]
    );

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen((prev) => !prev)}
                onRequestExit={() => setIsExitModalOpen(true)}
                sessionId={sessionId}
                patientId={id}
            />
            <div className="flex flex-1 overflow-hidden">
                <ReasoningSidebar
                    onEndConversationClick={() => setIsConfirmModalOpen(true)}
                    countdownDisplay={countdownDisplay}
                    progressPercent={progressPercent}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-2 border-b border-gray-100 flex justify-between items-center text-sm text-gray-500 shrink-0">
                        <span className="font-medium">Clinical Reasoning Phase</span>
                        <span className="font-mono font-bold text-[#235697]">
                            {timer.formatted}
                        </span>
                    </div>

                    <ReasoningChat
                        messages={messages}
                        isSending={isSending}
                        isComplete={isComplete}
                        errorMessage={reasoningError}
                        onSendMessage={handleSendMessage}
                        onRetry={handleRetry}
                    />
                </div>

                {isAiSidebarOpen && <AiAssistantSidebar sessionId={sessionId} />}
            </div>

            <SubmitModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                patientId={id}
                sessionId={sessionId}
                vpDuration={vpDuration}
                timerStop={() => timer.stop()}
            />

            <ExitConfirmModal
                isOpen={isExitModalOpen}
                isProcessing={isExiting}
                onConfirm={handleConfirmExit}
                onCancel={() => setIsExitModalOpen(false)}
            />
        </div>
    );
};

export const ReasoningPage = ({ id }: ReasoningPageProps) => {
    return (
        <Suspense
            fallback={
                <div className="h-screen flex items-center justify-center bg-[#F8FAFC] text-[#235697] font-semibold">
                    Loading reasoning session...
                </div>
            }
        >
            <ReasoningContent id={id} />
        </Suspense>
    );
};