'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ExitConfirmModal } from './ExitConfirmModal';
import { usePracticeTimer } from '@/src/hooks/usePracticeTimer';
import { usePracticeSession } from '@/src/hooks/usePracticeSession';
import { useExitProtection } from '@/src/hooks/useExitProtection';
import { getCookie } from '@/src/utils/cookies';
import { PatientData } from '@/src/types/practice';
import { getPatientById } from '@/src/services/patient-servvice';
import { resolvePatientAvatar } from '@/src/utils/patient-assets';
import { practiceSessionService } from '@/src/services/practice-session-service';
import { clientApi } from '@/src/utils/api-client';

interface TakePracticePageProps {
    readonly params: { id: string };
}

interface RawPatientApiResponse {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: string;
    readonly avatarImage: string | null;
    readonly level: string;
    readonly timeSetting: number;
    readonly argumentTime?: number;
    readonly createdAt: string;
    readonly medicalHistory: string;
    readonly chiefConcern: string;
    readonly vitalSigns: { bp: string; hr: number; temp?: number; spo2?: string | number; rr?: number };
    readonly instructions: { role: string; task: string; tone: string; procedure: string[] } | null;
    readonly learningObjectives: string[];
}

export const TakePracticePage = ({ params }: TakePracticePageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionIdFromQuery = searchParams.get('sessionId') ?? '';

    const hasInitialized = useRef<boolean>(false);
    const [sessionId, setSessionId] = useState<string>(sessionIdFromQuery);
    const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(true);
    const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);

    const { initSession } = usePracticeSession(params.id);

    const timer = usePracticeTimer({
        autoStart: false,
        storageKey: `vp_timer_${params.id}`,
    });

    useExitProtection({
        enabled: !isExiting,
        onExitAttempt: () => setIsExitModalOpen(true),
    });


    useEffect(() => {
        let cancelled = false;
        const fetchPatientDetails = async () => {
            try {
                const data = await getPatientById(params.id);
                if (!cancelled) setCurrentPatient(data);
            } catch {
                try {
                    const rawData = await clientApi.get<RawPatientApiResponse>(
                        `/virtual-patient/api/virtual-patients/${params.id}`
                    );
                    if (!cancelled) {
                        const safeVitalSigns = {
                            bp: rawData.vitalSigns?.bp || 'N/A',
                            hr: rawData.vitalSigns?.hr || 0,
                            spo2: rawData.vitalSigns?.spo2 || 'N/A',
                            rr: rawData.vitalSigns?.rr || 0,
                            temp: rawData.vitalSigns?.temp || 'N/A'
                        };

                        setCurrentPatient({
                            id: rawData.patientId,
                            caseId: rawData.caseId,
                            name: rawData.name,
                            age: rawData.age,
                            gender: rawData.gender,
                            pronouns: 'N/A',
                            ethnicity: 'N/A',
                            occupation: 'N/A',
                            setting: 'Clinic',
                            img: rawData.avatarImage || '/images/VP7.jpeg',
                            level: rawData.level,
                            time: `${rawData.timeSetting || 30} min`,
                            timeSetting: rawData.timeSetting || 30,
                            argumentTime: rawData.argumentTime || 15,
                            date: rawData.createdAt ? new Date(rawData.createdAt).toLocaleDateString() : 'N/A',
                            feedback: 0,
                            timesPracticed: 0,
                            description: rawData.medicalHistory || '',
                            chiefConcern: rawData.chiefConcern || '',
                            vitalSigns: safeVitalSigns,
                            instructions: {
                                role: rawData.instructions?.role || 'Medical Learner',
                                task: rawData.instructions?.task || 'Take a focused clinical history.',
                                tone: rawData.instructions?.tone || 'Professional',
                                procedure: rawData.instructions?.procedure || [],
                            },
                            caseRules: { rules: [], totalTime: '45 min', timeBreakdown: [] },
                            learningObjectives: rawData.learningObjectives || [],
                            experts: [],
                        });
                    }
                } catch (fallbackErr) {
                    console.error('Fallback patient fetch failed:', fallbackErr);
                }
            }
        };
        void fetchPatientDetails();
        return () => {
            cancelled = true;
        };
    }, [params.id]);

    const resolvedAvatar = useMemo(() => {
        if (!currentPatient) return '/images/VirtualPatient/ava1.jpg';
        return resolvePatientAvatar(
            currentPatient.img,
            currentPatient.id,
            currentPatient.age,
            currentPatient.gender
        );
    }, [currentPatient]);

    const timerRef = useRef(timer);
    useEffect(() => {
        timerRef.current = timer;
    }, [timer]);

    const resumeTimer = useCallback(() => {
        timerRef.current.resume();
    }, []);

    const stopTimer = useCallback(() => {
        return timerRef.current.stop();
    }, []);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const setupSession = async () => {
            if (sessionIdFromQuery) {
                initSession(sessionIdFromQuery, 'EPA_STANDARD_V1');
                resumeTimer();
                setSessionId((prev) => prev !== sessionIdFromQuery ? sessionIdFromQuery : prev);
                return;
            }

            const learnerId = getCookie('userId') || 'USR001';
            try {
                const active = await practiceSessionService.getActive(learnerId, params.id);
                if (active?.sessionId && active.status !== 'Completed') {
                    initSession(active.sessionId, 'EPA_STANDARD_V1');
                    resumeTimer();
                    setSessionId((prev) => prev !== active.sessionId ? active.sessionId : prev);
                    return;
                }

                const newId = `SESS_${params.id}_${Date.now()}`;
                await practiceSessionService.create({
                    id: newId,
                    learnerId,
                    patientId: params.id,
                    moduleId: 'EPA_STANDARD_V1',
                    discussionType: 'Message Type',
                    guidelinesId: null,
                    status: 'Practicing',
                });
                initSession(newId, 'EPA_STANDARD_V1');
                resumeTimer();
                setSessionId(newId);
            } catch (error) {
                console.error('[TakePracticePage] Session orchestration failed:', error);
                router.push(`/practice/${params.id}`);
            }
        };

        void setupSession();
    }, [params.id, sessionIdFromQuery, initSession, resumeTimer, router]);

    const handleProceedToReasoning = async (): Promise<void> => {
        const vpDuration = stopTimer();
        if (sessionId) {
            await practiceSessionService.patchStatus(sessionId, 'VpCompleted');
        }
        router.push(
            `/practice/${params.id}/reasoning?sessionId=${sessionId}&vpDuration=${vpDuration}`
        );
    };

    const handleConfirmExit = async (): Promise<void> => {
        setIsExiting(true);
        try {
            stopTimer();
        } catch (timerErr) {
            console.error('[TakePracticePage] Failed to stop timer:', timerErr);
        }

        if (sessionId) {
            try {
                await practiceSessionService.patchStatus(sessionId, 'Abandoned');
            } catch (apiErr) {
                console.warn('[TakePracticePage] Backend session sync skipped or failed (404/500):', apiErr);
            }
        }
        setIsExiting(false);
        router.push('/practice');
    };

    if (!currentPatient) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-[#235697] font-semibold animate-pulse">
                    Loading medical case data...
                </div>
            </div>
        );
    }

    const parsedMaxTime = currentPatient.timeSetting ? currentPatient.timeSetting * 60 : 1800;

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen((prev) => !prev)}
                onRequestExit={() => setIsExitModalOpen(true)}
                sessionId={sessionId}
                patientId={params.id}
            />

            <div className="flex flex-1 overflow-hidden">
                <PatientSidebar
                    id={params.id}
                    sessionId={sessionId}
                    timerFormatted={timer.formatted}
                    elapsed={timer.elapsed}
                    maxTime={parsedMaxTime}
                    avatarUrl={resolvedAvatar}
                />

                <ChatArea
                    patientData={{ ...currentPatient, img: resolvedAvatar }}
                    sessionId={sessionId}
                    vpElapsed={timer.elapsed}
                    onProceedToReasoning={() => void handleProceedToReasoning()}
                />

                {isAiSidebarOpen && <AiAssistantSidebar sessionId={sessionId} />}
            </div>

            <ExitConfirmModal
                isOpen={isExitModalOpen}
                isProcessing={isExiting}
                onConfirm={handleConfirmExit}
                onCancel={() => setIsExitModalOpen(false)}
            />
        </div>
    );
};

export default TakePracticePage;