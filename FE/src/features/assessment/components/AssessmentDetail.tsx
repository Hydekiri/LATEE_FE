// src/features/assessment/components/AssessmentDetail.tsx
'use client';

import { useState } from 'react';
import { AssessmentData } from '@/src/types/assessment';
import { AssessmentAbout } from "./subComponents/tabs/AssessmentAbout";
import { CaseOverview } from "./subComponents/CaseOverview";
import { CaseInfo } from "./subComponents/CaseInfo";
import Evaluation from "@/src/features/assessment/components/subComponents/tabs/Evaluation";
import Experts from "@/src/features/assessment/components/subComponents/tabs/Expert";
import Results from "@/src/features/assessment/components/subComponents/tabs/Results";
import FQA from "@/src/features/assessment/components/subComponents/tabs/FQA";

export default function AssessmentDetail({ data }: { data: AssessmentData }) {
    const [activeTab, setActiveTab] = useState('About Assessment');
    const tabs = ['About Assessment', 'Experts', 'Evaluation', 'Result', 'FQA'];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'About Assessment': return <AssessmentAbout data={data} />;
            case 'Experts': return <Experts />;
            case 'Evaluation': return <Evaluation />;
            case 'Result': return <Results />;
            // Pass AssessmentData to FQA component
            case 'FQA': return <FQA data={data} />; 
            default: return <AssessmentAbout data={data} />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-screen">
            {/* TABS HEADER NAVIGATION */}
            <div className="border-b border-gray-200 px-12 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 flex justify-between gap-2.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 flex-1 text-base font-bold transition-all relative whitespace-nowrap ${
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
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="px-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <CaseInfo data={data} />
                        <div className="mt-8 animate-fadeIn">
                            {renderTabContent()}
                        </div>
                    </div>
                    
                    {/* RIGHT COLUMN OVERVIEW */}
                    <div className="lg:col-span-4">
                        <CaseOverview data={data} /> 
                    </div>
                </div>
            </div>
        </div>
    );
}