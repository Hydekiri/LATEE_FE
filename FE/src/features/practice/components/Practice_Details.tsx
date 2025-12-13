// src/features/practice/components/PracticeDetail.tsx
'use client';

import { useState } from 'react';
import { CaseOverview } from './subComponents/CaseOverview';
import { PatientInfo } from './subComponents/PatientInfo';
import { AboutPatient } from './subComponents/tabs/AboutPatient';

interface PracticeDetailProps {
    data: PatientData; 
}


export default function PracticeDetail({ data }: PracticeDetailProps) {
    
    console.log("Đang tải dữ liệu cho bài:", data);
    const [activeTab, setActiveTab] = useState('About Patient');
    const tabs = ['About Patient', 'Experts', 'Evaluation', 'Result', 'FQA'];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'About Patient':
                return <AboutPatient data={data} />;
            case 'Evaluation':
                return <div className="p-8 text-center text-gray-500">Evaluation Content Coming Soon...</div>;
            case 'Result':
                return <div className="p-8 text-center text-gray-500">Result Analysis Content...</div>;
            default:
                return <AboutPatient data={data} />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-200">
            
            {/* --- 1. TABS NAVIGATION (Luôn cố định ở trên cùng) --- */}
            <div className="border-b border-gray-200 px-12 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 flex justify-between gap-2.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 flex-1 text-base font-bold transition-colors relative text-center whitespace-nowrap ${
                                    activeTab === tab ? 'text-[#235697]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                                <span className={`absolute bottom-0 left-0 w-full h-1 rounded-full transition-colors ${
                                    activeTab === tab ? 'bg-[#235697]' : 'bg-gray-300'
                                }`} />
                            </button>
                        ))}
                    </div>
                    <div className="lg:col-span-4 hidden lg:block"></div>
                </div>
            </div>

            <div className="px-13 py-6">
                {/* --- 2. MAIN GRID LAYOUT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-13.5">
                    
                    {/* === CỘT TRÁI (Chiếm 2/3) === */}
                    <div className="lg:col-span-8">
                        
                        {/* A. Phần TĨNH: Header & Profile Summary */}
                        <PatientInfo data={data} />

                        {/* B. Phần ĐỘNG: Thay đổi theo Tab */}
                        <div className="mt-8 animate-fadeIn">
                            {renderTabContent()}
                        </div>

                    </div>

                    {/* === CỘT PHẢI (Chiếm 1/3) - TĨNH === */}
                    <div className="lg:col-span-4">
                        <CaseOverview data={data} />
                    </div>

                </div>
            </div>
        </div>
    );
};