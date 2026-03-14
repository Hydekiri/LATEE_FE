// src/features/assessment/components/subComponents/CaseOverview.tsx
import { 
    BookmarkIcon, 
    ComputerDesktopIcon, 
    ChartBarIcon, 
    ClockIcon,
    ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { AssessmentData } from '@/src/types/assessment';

export const CaseOverview = ({ data }: { data: AssessmentData }) => {
    const router = useRouter();
    const items = [
        { icon: BookmarkIcon, title: "Chief Concern", desc: "Understand the main reason the patient seeks care and identify key symptoms." },
        { icon: ComputerDesktopIcon, title: "Interactive Case", desc: "Engage with a realistic clinical scenario designed to train your diagnostic reasoning." },
        { icon: ChatBubbleLeftRightIcon, title: "AI Feedback", desc: "Receive instant feedback and insights from the AI system to refine your thought process." },
        { icon: ChartBarIcon, title: "Skill Level", desc: `Suitable for Level ${data.level} medical learners.` },
        { icon: ClockIcon, title: data.timeRequired, desc: "Estimated time for patient interaction and reasoning." }
    ];

    return (
        <div className="pl-4 h-full border-l border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
                Case Overview
            </h3>
            <div className="space-y-8">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start group">
                        <div className="mt-1 text-[#235697] shrink-0 transition-transform group-hover:scale-110">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-base leading-tight">{item.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => router.back()} 
                className="mt-20 w-full bg-linear-to-r from-[#1AB2D9] to-[#235697] hover:from-[#235697] hover:to-[#235697] text-white py-4 rounded-xl font-bold text-xl transition-all shadow-lg active:scale-95 shadow-[#235697]/20"
            >
                Return
            </button>
        </div>
    );
};