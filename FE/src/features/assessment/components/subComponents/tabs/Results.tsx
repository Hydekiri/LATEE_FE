'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ChevronDownIcon, 
    ChevronUpIcon,
    DocumentTextIcon,
    PlayIcon,
    InformationCircleIcon // Dùng cho phần Explanation
} from '@heroicons/react/24/solid';
import { MOCK_FULL_ASSESSMENT } from "@/src/data/mockAssessment";

export default function Results() {
    const [currentAttempt, setCurrentAttempt] = useState(1);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handlePrevAttempt = () => {
        if (currentAttempt > 1) setCurrentAttempt(prev => prev - 1);
    };

    const handleNextAttempt = () => {
        if (currentAttempt < MOCK_FULL_ASSESSMENT.maxAttempts) setCurrentAttempt(prev => prev + 1);
    };

    // Giả lập kết quả và bổ sung trường Explanation
    const userResults = MOCK_FULL_ASSESSMENT.questions.map((q, idx) => {
        const userChoice = idx % 2 === 0 ? "C" : "A";
        const correctChoice = q.options[2].id;
        return {
            ...q,
            userAnswerId: userChoice,
            correctAnswerId: correctChoice,
            isCorrect: userChoice === correctChoice,
            // Thêm giải thích giả lập cho từng câu hỏi
            explanation: `The clinical presentation of ${q.content.split('presents with')[1]?.split('.')[0] || "this condition"} points toward ${q.options[2].content}. Diagnostic criteria and pathophysiology support this choice over other differentials.`
        };
    });

    const score = userResults.filter(r => r.isCorrect).length;

    return (
        <div className="flex flex-col gap-8 pb-10">
            
            {/* --- Section 1: Attempt Selection --- */}
            <div className="pt-2 mb-2 relative w-full">
                <div className="flex items-center w-full"> 
                    <button 
                        onClick={handlePrevAttempt}
                        className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                        disabled={currentAttempt <= 1}
                    >
                        <PlayIcon className="w-6 h-6 rotate-180" />
                    </button>
                    
                    <div className="flex flex-1 items-center gap-2">
                        {Array.from({ length: MOCK_FULL_ASSESSMENT.maxAttempts }).map((_, i) => {
                            const num = i + 1;
                            const isActive = num === currentAttempt;
                            const label = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th";

                            return (
                                <div key={num} className="flex-1 relative">
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
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        onClick={handleNextAttempt}
                        className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                        disabled={currentAttempt >= MOCK_FULL_ASSESSMENT.maxAttempts}
                    >
                        <PlayIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* --- Section 2: Case Result Summary Card --- */}
            <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
                <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF] min-h-[200px]">
                    <Image 
                        src="/images/Robot2.png" 
                        alt="AI Assistant Result" 
                        fill
                        className="object-cover" 
                    />
                </div>
                
                <div className="col-span-7 flex flex-col justify-center">
                    <h3 className="text-[#235697] font-bold text-2xl mb-2">Case Result</h3>
                    <ul className="space-y-1 text-md">
                        <li>
                            <span className="font-bold text-[#235697]">Final Score:</span> 
                            <span className="text-[#0E2A46] ml-1">{score * 10} / 100</span>
                        </li>
                        <li className="flex items-center gap-1">
                            <span className="font-bold text-[#235697]">Accuracy:</span>
                            <span className="text-[#10B981] font-bold ml-1">
                                {Math.round((score / userResults.length) * 100)}%
                            </span>
                            <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
                        </li>
                        <li>
                            <span className="font-bold text-[#235697]">Difficulty:</span> 
                            <span className="text-[#0E2A46] ml-1">{MOCK_FULL_ASSESSMENT.difficultyLevel}</span>
                        </li>
                        <li>
                            <span className="font-bold text-[#235697]">Topic:</span> 
                            <span className="text-[#0E2A46] ml-1">{MOCK_FULL_ASSESSMENT.topic}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* --- Section 3: Detailed Question Review --- */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <DocumentTextIcon className="w-5 h-5 text-[#235697]" />
                    <h3 className="text-[#235697] text-2xl font-bold tracking-tight">
                        Detailed Results Review
                    </h3>
                </div>

                <div className="flex flex-col gap-4">
                    {userResults.map((item, index) => {
                        const isExpanded = expandedIndex === index;
                        const isCorrect = item.isCorrect;

                        return (
                            <div key={item.questionId} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all">
                                {/* Header Toggle */}
                                <div 
                                    onClick={() => toggleExpand(index)} 
                                    className="p-6 cursor-pointer hover:bg-slate-50 transition flex items-start gap-4"
                                >
                                    <div className="mt-1 shrink-0">
                                        {isCorrect ? (
                                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="w-6 h-6 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#235697] text-lg mb-1">
                                            Question {index + 1}: <span className="font-normal text-slate-600 ml-1">{item.content}</span>
                                        </h3>
                                        <div className="flex gap-4 text-sm mt-2">
                                            <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                                Your Answer: {item.userAnswerId}
                                            </span>
                                            {!isCorrect && (
                                                <span className="text-green-600 font-bold">
                                                    Correct Answer: {item.correctAnswerId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-slate-400">
                                        {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-6 pb-6 pt-0 animate-fadeIn">
                                        <div className="border-t border-slate-100 my-4"></div>
                                        
                                        {/* Options List */}
                                        <div className="space-y-3 mb-6">
                                            {item.options.map((opt) => {
                                                const isUserChoice = opt.id === item.userAnswerId;
                                                const isCorrectChoice = opt.id === item.correctAnswerId;

                                                let styleClass = "border-slate-100 bg-white";
                                                let badgeClass = "bg-white border-slate-200 text-slate-800";
                                                let Icon = null;

                                                if (isUserChoice && isCorrectChoice) {
                                                    styleClass = "border-green-500 bg-green-50 text-green-800";
                                                    badgeClass = "bg-green-500 border-green-500 text-white";
                                                    Icon = <CheckCircleIcon className="w-5 h-5 text-green-600" />;
                                                } else if (isUserChoice && !isCorrectChoice) {
                                                    styleClass = "border-red-500 bg-red-50 text-red-800";
                                                    badgeClass = "bg-red-500 border-red-500 text-white";
                                                    Icon = <XCircleIcon className="w-5 h-5 text-red-600" />;
                                                } else if (isCorrectChoice) {
                                                    styleClass = "border-green-500 bg-white text-green-700";
                                                    badgeClass = "bg-green-500 border-green-500 text-white";
                                                    Icon = <CheckCircleIcon className="w-5 h-5 text-green-600" />;
                                                }

                                                return (
                                                    <div key={opt.id} className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${styleClass}`}>
                                                        <div className="flex gap-4 items-center">
                                                            <span className={`w-9 h-9 flex shrink-0 items-center justify-center rounded-lg font-bold border ${badgeClass}`}>
                                                                {opt.id}
                                                            </span>
                                                            <span className="font-semibold">{opt.content}</span>
                                                        </div>
                                                        {Icon}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation Section */}
                                        {item.explanation && (
                                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2 text-[#235697] font-bold text-xs uppercase tracking-wider">
                                                    <InformationCircleIcon className="w-5 h-5" /> 
                                                    Explanation
                                                </div>
                                                <p className="text-slate-700 text-sm leading-relaxed">
                                                    {item.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}