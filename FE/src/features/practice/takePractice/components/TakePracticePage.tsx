'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { usePracticeTimer } from '@/src/hooks/usePracticeTimer';
import { usePracticeSession } from '@/src/hooks/usePracticeSession';
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import { PatientData } from '@/src/types/practice';
import { getPatientById } from '@/src/services/patient-servvice'; 
import { getAvatarByAge } from '@/src/utils/patient-assets'; // Import hàm sinh ảnh tĩnh lâm sàng

interface TakePracticePageProps {
    params: { id: string };
}

interface ActiveSessionResponse {
    sessionId: string;
    status: string;
    startTime: string;
    patientId: string;
}

interface RawPatientApiResponse {
    patientId: string;
    caseId: string;
    name: string;
    age: number;
    gender: string;
    avatarImage: string | null;
    level: string;
    timeSetting: number;
    createdAt: string;
    medicalHistory: string;
    chiefConcern: string;
    vitalSigns: { bp: string; hr: number; temp?: number; spo2?: string; rr?: number };
    instructions: { role: string; task: string; tone: string; procedure: string[] } | null;
    learningObjectives: string[];
}

export const TakePracticePage = ({ params }: TakePracticePageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionIdFromQuery = searchParams.get('sessionId') ?? '';

    const hasInitialized = useRef<boolean>(false);
    const [sessionId, setSessionId] = useState<string>(sessionIdFromQuery);
    const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(true);

    const { initSession } = usePracticeSession(params.id);
    const timer = usePracticeTimer({
        autoStart: false,
        storageKey: `vp_timer_${sessionIdFromQuery || params.id}`,
    });

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const data = await getPatientById(params.id);
                setCurrentPatient(data);
            } catch (error) {
                console.error("Error fetching patient via service, trying direct fallback:", error);
                try {
                    const accessToken = getCookie('accessToken');
                    const res = await fetch(`${API_BASE_URL}/virtual-patient/api/virtual-patients/${params.id}`, {
                        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                    });
                    if (res.ok) {
                        const rawData = (await res.json()) as RawPatientApiResponse;
                        const mockMappedData: PatientData = {
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
                            date: new Date(rawData.createdAt).toLocaleDateString(),
                            feedback: 0,
                            timesPracticed: 0,
                            description: rawData.medicalHistory || '',
                            chiefConcern: rawData.chiefConcern || '',
                            vitalSigns: rawData.vitalSigns,
                            instructions: rawData.instructions ?? {
                                role: 'Medical Learner',
                                task: 'Take history',
                                tone: 'Professional',
                                procedure: []
                            },
                            caseRules: { rules: [], totalTime: '45 min', timeBreakdown: [] },
                            learningObjectives: rawData.learningObjectives || [],
                            experts: []
                        };
                        setCurrentPatient(mockMappedData);
                    }
                } catch (fallbackErr) {
                    console.error("Direct fallback fetch failed too:", fallbackErr);
                }
            }
        };

        void fetchPatientDetails();
    }, [params.id]);

    // TÍNH TOÁN ẢNH ĐỒNG BỘ SIDEBAR: Bảo đảm giống hệt logic xử lý trong useVpChat
    const synchronizedAvatar = useMemo(() => {
        if (!currentPatient) return '/images/VirtualPatient/VP5.jpeg';

        if (currentPatient.img && currentPatient.img.startsWith('http') && !currentPatient.img.includes("VP7.jpeg")) {
            return currentPatient.img;
        }
        
        if (currentPatient.img && currentPatient.img.startsWith('/images') && !currentPatient.img.includes("VP7.jpeg")) {
            return currentPatient.img;
        }
        
        const safeId = currentPatient.id || "default";
        const safeAge = currentPatient.age ?? 30;
        const safeGender = currentPatient.gender ?? "Unknown";

        return getAvatarByAge(String(safeId), safeAge, safeGender);
    }, [currentPatient]);

    const patchStatus = async (sid: string, status: string): Promise<void> => {
        try {
            const accessToken = getCookie('accessToken');
            await fetch(
                `${API_BASE_URL}/practice-session/api/practice-sessions/${sid}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                    body: JSON.stringify({ status }),
                }
            );
        } catch (e) {
            console.error('[TakePracticePage] patchStatus error:', e);
        }
    };

    useEffect(() => {
        if (hasInitialized.current || !sessionIdFromQuery) return;
        hasInitialized.current = true;

        const setup = async () => {
            await Promise.resolve();
            initSession(sessionIdFromQuery, 'EPA_STANDARD_V1');
            timer.resume();
            setSessionId(sessionIdFromQuery);
        };
        void setup();
    }, [sessionIdFromQuery, initSession, timer]);

    useEffect(() => {
        if (sessionIdFromQuery || hasInitialized.current) return;
        hasInitialized.current = true;

        const recoverOrCreate = async () => {
            const accessToken = getCookie('accessToken');
            const learnerId = getCookie('userId') || 'USR001';
            const authHeader: Record<string, string> = accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {};

            try {
                const activeRes = await fetch(
                    `${API_BASE_URL}/practice-session/api/practice-sessions/active?learnerId=${learnerId}&patientId=${params.id}`,
                    { headers: authHeader }
                );
                if (activeRes.ok) {
                    const active = (await activeRes.json()) as ActiveSessionResponse;
                    if (active.sessionId && active.status !== 'Completed') {
                        initSession(active.sessionId, 'EPA_STANDARD_V1');
                        timer.resume();
                        setSessionId(active.sessionId);
                        return;
                    }
                }
            } catch (e) {
                console.error('[TakePracticePage] Active session recovery failed:', e);
            }

            const newId = `SESS_${params.id}_${Date.now()}`;
            try {
                await fetch(`${API_BASE_URL}/practice-session/api/practice-sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...authHeader },
                    body: JSON.stringify({
                        id: newId,
                        learnerId,
                        patientId: params.id,
                        moduleId: 'EPA_STANDARD_V1',
                        discussionType: 'Message Type',
                        guidelinesId: null,
                        status: 'Practicing',
                    }),
                });
                initSession(newId, 'EPA_STANDARD_V1');
                timer.resume();
                setSessionId(newId);
            } catch (error) {
                console.error('[TakePracticePage] Fallback session creation failed:', error);
                router.push(`/practice/${params.id}`);
            }
        };

        void recoverOrCreate();
    }, [params.id, sessionIdFromQuery, initSession, timer, router]);

    const handleProceedToReasoning = async () => {
        const vpDuration = timer.stop();
        if (sessionId) {
            await patchStatus(sessionId, 'VpCompleted'); 
        }
        router.push(
            `/practice/${params.id}/reasoning?sessionId=${sessionId}&vpDuration=${vpDuration}`
        );
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

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen((prev) => !prev)}
                sessionId={sessionId}
                patientId={params.id}
            />
            
            <div className="flex flex-1 overflow-hidden">
                {/* ĐÃ ĐỒNG BỘ: Truyền avatar Url đã được chuẩn hóa lâm sàng xuống Sidebar */}
                <PatientSidebar 
                    id={params.id} 
                    sessionId={sessionId} 
                    timerFormatted={timer.formatted} 
                    elapsed={timer.elapsed} 
                    maxTime={currentPatient.time ? (parseInt(currentPatient.time) * 60) : 1800} 
                    avatarUrl={synchronizedAvatar} 
                />
                
                <ChatArea
                    patientData={currentPatient}
                    sessionId={sessionId}
                    vpElapsed={timer.elapsed}
                    onProceedToReasoning={() => void handleProceedToReasoning()}
                />
                
                {isAiSidebarOpen && <AiAssistantSidebar sessionId={sessionId} />}
            </div>
        </div>
    );
};

export default TakePracticePage;