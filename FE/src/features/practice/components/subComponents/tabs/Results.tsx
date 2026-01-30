'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    CheckCircleIcon, 
    PlayIcon,
    ArrowUturnLeftIcon,
    DocumentTextIcon
} from '@heroicons/react/24/solid';

interface EPAData {
    id: number;
    title: string;
    score: number;
    maxScore: number;
    content: string;
}

const EPA_RESULTS: EPAData[] = [
    {
        id: 1,
        title: "Information Gathering",
        score: 12,
        maxScore: 20,
        content: "Learner gathered the main symptom (progressive bilateral leg swelling) and asked about relevant associated features (shortness of breath, jaundice, pain). However, could further explore past medical history, medication use, and dietary habits to strengthen data collection."
    },
    {
        id: 2,
        title: "Diagnosis Reasoning & Differential Diagnosis",
        score: 10,
        maxScore: 20,
        content: "Excellent logical reasoning. Learner linked symptoms to the pathophysiology of nephrotic syndrome and systematically ruled out heart failure, liver disease, and DVT. Could improve by mentioning specific subtypes or causes of nephrotic syndrome (e.g., minimal change disease, diabetic nephropathy)."
    },
    {
        id: 3,
        title: "Diagnosis Testing",
        score: 10,
        maxScore: 20,
        content: "Selected appropriate tests (urinalysis, albumin, renal function, lipid profile, ultrasound). Could improve by indicating quantitative protein measurement (24-hour urine) and possible kidney biopsy as confirmation steps."
    },
    {
        id: 4,
        title: "Management Plan & Safe Order Entry",
        score: 10,
        maxScore: 20,
        content: "Learner proposed reasonable management: salt restriction, diuretics, and referral to nephrology. Could expand by including monitoring plans, patient education on diet and fluid balance, and criteria for hospitalization."
    },
    {
        id: 5,
        title: "Patient Education, Shared Decision-Making & Follow-Up",
        score: 10,
        maxScore: 20,
        content: "Demonstrated awareness of patient counseling but limited emphasis on shared decision-making and follow-up schedule. Should add communication strategies for explaining the diagnosis and long-term care plan to the patient in lay terms."
    }
];

export default function Results() {
    // State để quản lý việc chuyển đổi giữa các attempt
    const [currentAttempt, setCurrentAttempt] = useState(2);

    const handlePrevAttempt = () => {
        if (currentAttempt > 1) setCurrentAttempt(currentAttempt - 1);
    };

    const handleNextAttempt = () => {
        if (currentAttempt < 4) setCurrentAttempt(currentAttempt + 1);
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
        
        {/* --- Section 1: Result Selection (Attempts) --- */}
        <div className="pt-2 mb-2 relative w-full">
            <div className="flex items-center w-full"> 
                <button 
                    onClick={() => setCurrentAttempt(prev => Math.max(1, prev - 2))}
                    className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                    disabled={currentAttempt <= 2}
                >
                    <PlayIcon className="w-6 h-6 rotate-180" />
                </button>
                
                <div className="flex flex-1 items-center gap-2">
                    {(() => {
                        const startPair = currentAttempt % 2 === 0 ? currentAttempt - 1 : currentAttempt;
                        const pair = [startPair, startPair + 1];
                        
                        const totalAttemptsData = 3; 

                        return pair.map((num) => {
                            const isActive = num === currentAttempt;
                            const isAvailable = num <= totalAttemptsData;
                            const label = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";

                            return (
                                <div key={num} className="flex-1 relative">
                                    {isAvailable ? (
                                        <button 
                                            onClick={() => setCurrentAttempt(num)}
                                            className={`pb-4 w-full text-base font-bold transition-colors relative text-center whitespace-nowrap ${
                                                isActive ? 'text-[#235697]' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                        >
                                            {num}{label} attempt result
        
                                            <span className={`absolute bottom-[-1px] left-0 w-full h-1 rounded-full transition-all duration-300 ${
                                                isActive ? 'bg-[#235697] z-20' : 'bg-gray-300'
                                            }`} />
                                        </button>
                                    ) : (
                                        <button 
                                            className="pb-4 w-full text-base font-bold text-gray-300 hover:text-[#1BA7D9] transition-colors relative text-center whitespace-nowrap group"
                                        >
                                            Practice More 
                                            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                            <span className="absolute bottom-[-1px] left-0 w-full h-1 rounded-full bg-gray-200" />
                                        </button>
                                    )}
                                </div>
                            );
                        });
                    })()}
                </div>

                <button 
                    onClick={() => setCurrentAttempt(prev => prev + 2)}
                    className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30"
                >
                    <PlayIcon className="w-6 h-6" />
                </button>
            </div>
        </div>


        {/* --- Section 2: Case Result Summary Card --- */}
        <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
            
            {/* Phần 1: Ảnh Robot - Chiếm 3/10 chiều rộng */}
            <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF]">
                <Image 
                    src="/images/Robot2.png" 
                    alt="AI Assistant Result" 
                    fill
                    className="object-cover" 
                />
            </div>
            
            {/* Phần 2: Content - Chiếm 7/10 chiều rộng */}
            <div className="col-span-7 flex flex-col justify-center">
                <h3 className="text-[#235697] font-bold text-2xl mb-2">
                    Case Result
                </h3>
                
                <ul className="space-y-1 text-md">
                    <li>
                        <span className="font-bold text-[#235697]">Final Score:</span> 
                        <span className="text-[#0E2A46] ml-1">52/100</span>
                    </li>
                    
                    <li className="flex items-center gap-1">
                        <span className="font-bold text-[#235697]">Correct Answer:</span>
                        <span className="text-[#0E2A46] ml-1">Nephrotic Syndrome / </span>
                        <span className="text-[#10B981] font-bold ml-1">Nephrotic Syndrome</span>
                        <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
                    </li>

                    <li>
                        <span className="font-bold text-[#235697]">Case Type:</span> 
                        <span className="text-[#0E2A46] ml-1">Diagnosis</span>
                    </li>
                    
                    <li>
                        <span className="font-bold text-[#235697]">Discussion Type:</span> 
                        <span className="text-[#0E2A46] ml-1">Message Type</span>
                    </li>
                    
                    <li>
                        <span className="font-bold text-[#235697]">Duration:</span> 
                        <span className="text-[#0E2A46] ml-1">30 minutes 25 seconds</span>
                    </li>
                    
                    <li>
                        <span className="font-bold text-[#235697]">Evaluation:</span> 
                        <span className="text-[#0E2A46] ml-1">Module SMART3220</span>
                    </li>
                </ul>
            </div>
        </div>

        {/* --- Section 3: Detailed Assessment List --- */}
        <div className="flex flex-col gap-6">
            {/* Header với icon Document từ HeroIcons */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <DocumentTextIcon className="w-5 h-5 text-[#235697]" />
                <h3 className="text-[#235697] text-lg font-bold tracking-tight">
                    Detailed Assessment
                </h3>
            </div>

            <div className="flex flex-col gap-5">
                {EPA_RESULTS.map((epa) => (
                    <div 
                        key={epa.id} 
                        // Thay đổi: Nền xanh nhạt, bo góc 12px, bỏ border-l
                        className="bg-[#F1F9FF] rounded-xl p-6 border border-transparent hover:border-[#235697]/10 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            {/* Tiêu đề EPA màu xanh đậm đặc trưng */}
                            <h4 className="text-[#235697] text-[20px] font-bold leading-tight max-w-[80%]">
                                EPA {epa.id}: {epa.title}
                            </h4>
                            
                            {/* Badge Score: Nền xanh Cyan sáng, text trắng */}
                            <div className="bg-[#1BA7D9] text-white px-3 py-1.5 rounded-lg font-bold text-[13px] whitespace-nowrap shadow-sm">
                                Score: {epa.score}/{epa.maxScore}
                            </div>
                        </div>
                        
                        {/* Nội dung text: Màu xám đậm, font-size chuẩn 15px */}
                        <p className="text-[#0E2A46] leading-relaxed text-[15px] opacity-85">
                            {epa.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* --- Section 4: Bottom Button --- */}
        {/* <div className="flex justify-end mt-6">
            <button className="flex items-center gap-2 bg-[#235697] hover:bg-[#1a4175] text-white px-12 py-3.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 group">
                <ArrowUturnLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Return
            </button>
        </div> */}
        </div>
    );
}