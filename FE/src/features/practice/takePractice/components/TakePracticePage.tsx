'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ChatMessage } from '../types';
import { getCookie } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';

export const TakePracticePage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const hasCreatedSession = useRef(false);
    const [sessionId, setSessionId] = useState("");

    useEffect(() => {

        if (hasCreatedSession.current) return;

        hasCreatedSession.current = true;

        const createSession = async () => {

            const randomId = crypto.randomUUID();

            const storedSessionId = `SESS_${params.id}_${randomId}`;

            try {

                const accessToken = getCookie("accessToken");

                await fetch(
                    `${API_BASE_URL}/practice-session/api/practice-sessions`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            id: storedSessionId,
                            learnerId: getCookie("userId") || "USR001",
                            patientId: "10070247",
                            moduleId: "Modul SMART3220",
                            discussionType: "Message Type",
                            guidelinesId: null,
                            status: "Practicing",
                        }),
                    }
                );

                setSessionId(storedSessionId);

            } catch (error) {

                alert(
                    "Error creating practice session: " +
                    (error instanceof Error
                        ? error.message
                        : "Unknown error")
                );
                router.push(`/practice/${params.id}`);
            }
        };

        createSession();

    }, [sessionId, params.id, router]);

    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [history, setHistory] = useState<ChatMessage[]>(() => [
        {
            id: 1706,
            role: 'patient',
            message: 'Hello, doctor.',
            avatar: '/images/LVP1.jpeg'
        }
    ]);

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
            />
            <div className="flex flex-1 overflow-hidden">
                <PatientSidebar id={params.id} sessionId={sessionId} />
                <ChatArea
                    history={history}
                    setHistory={setHistory}
                    patientId={params.id}
                />
                {isAiSidebarOpen && <AiAssistantSidebar />}
            </div>
        </div>
    );
};