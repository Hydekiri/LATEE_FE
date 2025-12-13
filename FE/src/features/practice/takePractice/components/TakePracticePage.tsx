'use client';

import { useState } from 'react';
import { Header } from './Header';
import { PatientSidebar } from './PatientSidebar';
import { ChatArea } from './ChatArea';
import { AiAssistantSidebar } from './AiAssistantSidebar';
import { ChatMessage } from '../types';

export const TakePracticePage = () => {
    const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);

    const chatHistory: ChatMessage[] = [
        { id: 1, role: 'patient', message: 'Good morning, doctor. My name is Abigail Park', avatar: '/LVP1.jpeg' },
        { id: 2, role: 'doctor', message: 'Good morning, Ms. Park. Why are you going here today?', avatar: '/VirtualPatient/VP3.jpeg' },
        // ... rest of your mock data
    ];

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans overflow-hidden">
        <Header 
            isAiSidebarOpen={isAiSidebarOpen} 
            onToggleAi={() => setIsAiSidebarOpen(!isAiSidebarOpen)} 
        />

        <div className="flex flex-1 overflow-hidden">
            <PatientSidebar />
            <ChatArea history={chatHistory} />
            {isAiSidebarOpen && <AiAssistantSidebar />}
        </div>
        </div>
    );
};