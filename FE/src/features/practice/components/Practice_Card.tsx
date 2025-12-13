// src/features/practice/components/Practice_Card.tsx
"use client";

import { PatientData } from "@/src/types/practice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    ChartBarIcon,
    ClockIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon
} from "@heroicons/react/24/solid";

interface PatientCardProps {
    item: PatientData;
}

export default function PatientCard({ item }: PatientCardProps) {
    const router = useRouter();

    return (
        /* --- LỚP 1: BASE CONTAINER --- */
        <div className="group relative w-full h-[400px] sm:h-[440px] xl:h-[480px] bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#235697]/30 hover:-translate-y-1">

            {/* --- LỚP 2: IMAGE LAYER --- */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gray-50 overflow-hidden">
                <Image
                    src={item.img}
                    alt={item.id}
                    fill
                    className="w-full h-full object-cover object-[0%_50%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </div>

            {/* --- LỚP 3: CONTENT LAYER --- */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-[10px] px-5 py-5 xl:px-6 xl:py-6 flex flex-col justify-between shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
                
                {/* --- PHẦN THÔNG TIN TRÊN --- */}
                <div className="flex flex-col gap-2 xl:gap-3">
                    
                    {/* ID & Badges */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#235697] font-lato-bold text-[18px] xl:text-[20px]">{item.id}</span>

                        <div className="flex items-center gap-2 text-[11px] xl:text-[13px] font-lato-r text-gray-600 bg-gray-50 px-2 py-1 xl:px-3 xl:py-1.5 rounded-full border border-gray-100">
                            <div className="flex items-center gap-1">
                                <ChartBarIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#235697]" />
                                <span>{item.level}</span>
                            </div>
                            <div className="w-[1px] h-3 bg-gray-300"></div>
                            <div className="flex items-center gap-1">
                                <ClockIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#235697]" />
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata (Date & Feedback) */}
                    <div className="flex items-center gap-4 text-[12px] xl:text-[13px] text-gray-500 border-b border-dashed border-gray-200 pb-2 xl:pb-3 font-lato-r">
                        <div className="flex items-center gap-1.5">
                            <CalendarDaysIcon className="w-4 h-4 text-[#235697]/70" />
                            <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#235697]/70" />
                            <span>Feedback ({item.feedback})</span>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div>
                        <p className="text-[#235697] font-lato-bold text-sm xl:text-base mb-[1px]">
                            Introduction
                        </p>
                        <p className="text-[#0E2A46] font-lato-r text-[13px] xl:text-sm leading-relaxed line-clamp-2 truncate text-gray-600">
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* --- PHẦN CHÂN  --- */}
                <div className="text-sm">
                    <p className="text-[#235697] font-lato-bold text-sm xl:text-base mb-[1px]">
                        Chief concern
                    </p>

                    <div className="flex justify-between items-center gap-3">
                        <p className="text-[#0E2A46] font-lato-r text-[13px] xl:text-sm line-clamp-2 truncate flex-1" title={item.chiefConcern}>
                            {item.chiefConcern}
                        </p>

                        <button
                            onClick={() => router.push(`/practice/${item.id}`)}
                            className="
                                group/btn
                                shrink-0
                                bg-[#00B7FF]/20
                                text-[#235697]
                                pl-4 pr-3 py-2 xl:pl-5 xl:pr-4 xl:py-2.5
                                rounded-lg text-[13px] xl:text-[sm] font-lato-bold
                                hover:bg-[#235697] hover:text-white
                                transition-all duration-300 flex items-center gap-2 shadow-sm
                            "
                        >
                            Join Practise
                            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}