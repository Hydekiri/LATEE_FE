'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ConfirmModal } from './ConfirmModal';
import { ChatMessage } from '../types';

interface TakePracticePageProps {
    id: string;
}

export const TakePracticePage = ({ id }: TakePracticePageProps) => {
    console.log('Rendering TakePracticePage with ID:', id);
    const router = useRouter();
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const chatHistory: ChatMessage[] = [
        { id: 1, role: 'patient', message: 'Good morning, doctor. My name is Abigail Park', avatar: '/FE/public/images/LVP1.jpeg' },
        { id: 2, role: 'doctor', message: 'Good morning, Ms. Park. Why are you going here today?', avatar: '/FE/public/images/doctor1.png' },
        // ... rest of your mock data
    ];

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
            <Header
                isAiSidebarOpen={isAiSidebarOpen}
                onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
            />

            <div className="flex flex-1 overflow-hidden">
                <PatientSidebar onEndConversationClick={() => setIsConfirmModalOpen(true)} />
                <ChatArea history={chatHistory} practiceId={id} />
                {isAiSidebarOpen && <AiAssistantSidebar />}
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    setIsConfirmModalOpen(false);
                    router.push(`/practice/${id}/reasoning`);
                }}
            />
        </div>
    );
};

