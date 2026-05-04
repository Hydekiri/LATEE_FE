'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    CheckCircleIcon, 
    PlayIcon,
    DocumentTextIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/solid';


const EPA_RESULTS = [
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
    }
];

export default function Evaluation() {
    const [currentAttempt, setCurrentAttempt] = useState(2);
    const maxTotalAttempts = 3; 
    const handlePrevAttempt = () => {
        if (currentAttempt > 1) setCurrentAttempt(prev => Math.max(1, prev - 2));
    };
    const handleNextAttempt = () => {
    setCurrentAttempt(prev => prev + 2);
    };
    return (
        <div className="flex flex-col gap-8 pb-10">
            
            {/* --- Section 1: Result Selection (Attempts) --- */}
        <div className="pt-2 mb-2 relative w-full">
            <div className="flex items-center w-full"> 
                <button 
                    onClick={() => handlePrevAttempt()}
                    className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                    disabled={currentAttempt <= 2}
                >
                    <PlayIcon className="w-6 h-6 rotate-180" />
                </button>
                
                <div className="flex flex-1 items-center gap-2">
                    {(() => {
                        const startPair = currentAttempt % 2 === 0 ? currentAttempt - 1 : currentAttempt;
                        const pair = [startPair, startPair + 1];
                        
                        const totalAttemptsData = maxTotalAttempts; 

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
        
                                            <span className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${
                                                isActive ? 'bg-[#235697] z-20' : 'bg-gray-300'
                                            }`} />
                                        </button>
                                    ) : (
                                        <button 
                                            className="pb-4 w-full text-base font-bold text-gray-300 hover:text-[#1BA7D9] transition-colors relative text-center whitespace-nowrap group"
                                        >
                                            Practice More 
                                            <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                            <span className="absolute -bottom-px left-0 w-full h-1 rounded-full bg-gray-200" />
                                        </button>
                                    )}
                                </div>
                            );
                        });
                    })()}
                </div>

                <button 
                    onClick={() => handleNextAttempt()}
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

            {/* --- Section 3: Detailed Feedback (Chia 3 khối màu theo ảnh) --- */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-6 h-6 text-[#235697]" />
                        <h3 className="text-[#235697] text-2xl font-bold tracking-tight">Detailed Feedback</h3>
                    </div>
                    
                    <button className="flex items-center gap-4 bg-[#1BA7D9] hover:bg-[#158ebc] text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm">
                        Get feedback
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Overall Attempt - Cam */}
                    <div className="bg-[#F99A00]/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[#333333] text-2xl font-bold">Overall Attempt</h4>
                            <span className="bg-[#F99A00] text-white px-4 py-2 rounded-lg font-bold text-sm">Not yet qualified</span>
                        </div>
                        <p className="text-[#0E2A46] leading-relaxed text-[15px]">Student performance in this clinical simulation was unsatisfactory, as they failed to gather sufficient information, consider appropriate differential diagnoses, or request relevant diagnostic tests...</p>
                    </div>

                    {/* Strength - Xanh Lá */}
                    <div className="bg-[#00BC10]/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[#299723] text-2xl font-bold">Strength</h4>
                            <span className="bg-[#00BC10] text-white px-4 py-2 rounded-lg font-bold text-sm">Very good</span>
                        </div>
                        <p className="text-[#0E2A46] leading-relaxed text-[15px]">The student demonstrated an initial attempt to engage with the patient&apos;s symptoms by ordering tests, although these were not the most relevant for the case.</p>
                    </div>

                    {/* Areas for Improvement - Hồng */}
                    <div className="bg-[#D90000]/10 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[#B42424] text-2xl font-bold">Areas for Improvement</h4>
                            <span className="bg-[#D90000] text-white px-4 py-2 rounded-lg font-bold text-sm">Needs improvement</span>
                        </div>
                        <div className="space-y-4 text-[#0E2A46]">
                            {EPA_RESULTS.map((epa) => (
                                <div key={epa.id}>
                                    <p className="font-bold italic">EPA {epa.id}: {epa.title}</p>
                                    <p className="text-[15px]">{epa.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}