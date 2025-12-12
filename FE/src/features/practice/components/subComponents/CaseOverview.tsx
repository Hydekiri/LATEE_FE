// src/features/practice/components/sub-components/CaseOverview.tsx
import { BookOpen, Activity, Cpu, BarChart, Clock } from 'lucide-react';

export const CaseOverview = () => {
    return (
        <div className="pl-4 h-full border-l border-gray-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-100">Case Overview</h3>

            <div className="space-y-8">
                <OverviewItem 
                    icon={<BookOpen className="w-6 h-6" />} 
                    title="Chief Concern" 
                    desc="Understand the main reason the patient seeks care and identify key symptoms." 
                />
                <OverviewItem 
                    icon={<Activity className="w-6 h-6" />} 
                    title="Interactive Case" 
                    desc="Engage with a realistic clinical scenario designed to train your diagnostic reasoning." 
                />
                <OverviewItem 
                    icon={<Cpu className="w-6 h-6" />} 
                    title="AI Feedback" 
                    desc="Receive instant feedback and insights from the AI system to refine your thought process." 
                />
                <OverviewItem 
                    icon={<BarChart className="w-6 h-6" />} 
                    title="Skill Level" 
                    desc="Suitable for medical students and early clinical learners." 
                />
                <OverviewItem 
                    icon={<Clock className="w-6 h-6" />} 
                    title="30/15 minutes" 
                    desc="30 minutes for patient interaction, plus 15 minutes for explanation and reasoning." 
                />
            </div>
        </div>
    );
};

// Component nhỏ hỗ trợ hiển thị item
const OverviewItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="mt-1 text-[#235697]">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800 text-base">{title}</h4>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);