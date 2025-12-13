import { PatientData } from "@/src/types/practice";
import {
    BookmarkIcon,
    ComputerDesktopIcon,
    ChatBubbleLeftRightIcon,
    ChartBarIcon,
    ClockIcon
} from "@heroicons/react/24/solid";

export const CaseOverview = ({ data }: { data: PatientData }) => {
    const items = [
        {
            icon: BookmarkIcon,
            title: "Chief Concern",
            desc: "Understand the main reason the patient seeks care and identify key symptoms."
        },
        {
            icon: ComputerDesktopIcon,
            title: "Interactive Case",
            desc: "Engage with a realistic clinical scenario designed to train your diagnostic reasoning."
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: "AI Feedback",
            desc: "Receive instant feedback and insights from the AI system to refine your thought process."
        },
        {
            icon: ChartBarIcon,
            title: "Skill Level",
            desc: "Suitable for medical students and early clinical learners."
        },
        {
            icon: ClockIcon,
            title: data.time,
            desc: "30 minutes for patient interaction, plus 15 minutes for explanation and reasoning."
        }
    ];

    return (
        <div className="pl-4 h-full border-l border-gray-200">

            {/* TITLE */}
            <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
                Case Overview
            </h3>

            {/* ITEMS */}
            <div className="space-y-8">
                {items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div key={index} className="flex gap-4 items-start">
                            {/* ICON */}
                            <div className="mt-1 text-[#235697] shrink-0">
                                <Icon className="w-6 h-6" />
                            </div>

                            {/* CONTENT */}
                            <div>
                                <h4 className="font-bold text-gray-800 text-base">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
