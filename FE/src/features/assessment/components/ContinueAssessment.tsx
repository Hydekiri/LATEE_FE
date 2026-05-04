"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChartBarIcon,
    ClockIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    PlayIcon
} from "@heroicons/react/24/solid";

const CONTINUE_DATA = [
    {
        id: "#AS52252",
        title: "Clinical Reasoning Practice: Diagnostic Thinking",
        date: "8/11/2025",
        feedback: "06",
        level: "Level 1",
        time: "45 mins",
        progress: 65,
        lastAttempt: "2 days ago",
        img: "/images/quizz1.jpeg" 
    },
    {
        id: "#AS52253",
        title: "Advanced Cardiovascular Diagnosis",
        date: "9/11/2025",
        feedback: "12",
        level: "Level 2",
        time: "60 mins",
        progress: 40,
        lastAttempt: "1 day ago",
        img: "/images/quizz2.jpeg"
    },
    {
        id: "#AS52254",
        title: "Respiratory System: Acute Care Simulations",
        date: "10/11/2025",
        feedback: "08",
        level: "Level 1",
        time: "30 mins",
        progress: 90,
        lastAttempt: "3 hours ago",
        img: "/images/quizz3.jpeg"
    }
];

export default function ContinueAssessment() {
    const router = useRouter();

    return (
        <section className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[28px] font-lato-bold text-[#235697]">Continue Assessment</h2>
                    <p className="text-[#0E2A46] text-sm mt-1 opacity-80">
                        Test your knowledge with interactive assessments designed for medical learners. Each assessment covers key organ systems and case-based reasoning !
                    </p>
                </div>
                <Link href="/assessment/all" className="text-[#235697] font-lato-bold hover:underline text-sm border-b-2 border-[#235697]">
                    View All Assessment
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONTINUE_DATA.map((item, index) => (
                    /* --- LỚP 1: BASE CONTAINER (Kế thừa từ Practice_Card) --- */
                    <div key={index} className="group relative w-full h-112.5 xl:h-120 bg-white rounded-[15px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#235697]/30 hover:-translate-y-1">
                        
                        {/* --- LỚP 2: IMAGE LAYER --- */}
                        <div className="absolute top-0 left-0 w-full h-[45%] bg-gray-50 overflow-hidden">
                            <Image
                                src={item.img}
                                alt={item.id}
                                fill
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Overlay nhẹ */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent"></div>
                        </div>

                        {/* --- LỚP 3: CONTENT LAYER (Bo góc phía trên giống ảnh) --- */}
                        <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-[20px] px-5 py-5 xl:px-6 xl:py-6 flex flex-col shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
                            
                            {/* Row 1: ID & Badges */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[#235697] font-lato-bold text-[16px] xl:text-[18px]">{item.id}</span>
                                <div className="flex items-center gap-2 text-[11px] xl:text-[12px] font-lato-r text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <ChartBarIcon className="w-3.5 h-3.5 text-[#235697]" />
                                        <span>{item.level}</span>
                                    </div>
                                    <div className="w-px h-3 bg-gray-300"></div>
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="w-3.5 h-3.5 text-[#235697]" />
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Metadata */}
                            <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-4 font-lato-r">
                                <div className="flex items-center gap-1.5">
                                    <CalendarDaysIcon className="w-4 h-4 text-[#235697]/70" />
                                    <span>DL: {item.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#235697]/70" />
                                    <span>Feedback ({item.feedback})</span>
                                </div>
                            </div>

                            {/* Row 3: Title */}
                            <h3 className="text-[#235697] font-lato-bold text-base xl:text-lg leading-tight mb-2 line-clamp-2">
                                {item.title}
                            </h3>
                            
                            <p className="text-gray-500 text-[13px] mb-4">
                                {item.progress}% completed • Last attempted {item.lastAttempt}
                            </p>

                            {/* Progress Section (Mới cho trang Assessment) */}
                            <div className="mt-auto mb-5">
                                <div className="flex justify-between text-[13px] font-lato-bold text-[#235697] mb-2">
                                    <span>Progress</span>
                                    <span>{item.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#E8F2FF] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#235697] transition-all duration-1000 ease-out"
                                        style={{ width: `${item.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Button Resume */}
                            <button
                                onClick={() => router.push(`/assessment/${item.id}`)}
                                className="
                                    group/btn w-full
                                    bg-[#00B7FF]/15 text-[#235697]
                                    py-3 rounded-xl font-lato-bold text-sm
                                    hover:bg-[#235697] hover:text-white
                                    transition-all duration-300 flex items-center justify-center gap-3 shadow-sm
                                "
                            >
                                Resume
                                <PlayIcon className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}



