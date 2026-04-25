'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ChatMessage } from '../types';

export const TakePracticePage = ({ params }: { params: { id: string } }) => {
    const [sessionId] = useState(() => `SESS_${params.id}_${Date.now()}`);

    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [history, setHistory] = useState<ChatMessage[]>(() => [
        {
            id: Date.now(), 
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