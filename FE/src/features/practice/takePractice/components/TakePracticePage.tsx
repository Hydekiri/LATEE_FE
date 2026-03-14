'use client';

import { useState } from 'react';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ChatMessage } from '../types';

export const TakePracticePage = ({ params }: { params: { id: string } }) => {
    
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
                <PatientSidebar />
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