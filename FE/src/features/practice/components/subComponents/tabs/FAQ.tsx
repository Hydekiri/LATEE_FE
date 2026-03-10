'use client';

import { useState } from 'react';
import { 
    PlusIcon, 
    MinusIcon, 
    ExclamationTriangleIcon,
    XMarkIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/solid';
import { PatientData } from '@/src/types/practice';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: 1,
        question: "How is my final score calculated?",
        answer: "Your final score is a weighted average of four key Entrustable Professional Activities (EPAs): Information Gathering, Diagnostic Reasoning, Testing, and Management Planning. Each section is evaluated based on the accuracy and clinical relevance of your decisions."
    },
    {
        id: 2,
        question: "Can I retake a specific clinical case?",
        answer: "Yes, you can practice each case multiple times. We encourage retaking cases where you received 'Needs Improvement' feedback to refine your clinical reasoning and improve your score."
    },
    {
        id: 3,
        question: "What should I do if the AI doesn't understand my diagnosis?",
        answer: "Ensure you are using standard medical terminology. If you believe your answer was correct but not recognized, you can use the 'Report Issue' button below to provide feedback to our medical experts."
    },
    {
        id: 4,
        question: "How do I access expert feedback for my attempts?",
        answer: "After completing an attempt, go to the 'Evaluation' tab. You will find detailed feedback for each EPA, including strengths and specific areas for improvement provided by our clinical instructors."
    }
];

export default function FAQ({ data }: { data: PatientData }) {
    const [openId, setOpenId] = useState<number | null>(1); // Mở câu đầu tiên mặc định
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [caseId, setCaseId] = useState(data?.id ?? 'N/A');

    return (
        <div className="flex flex-col gap-8 pb-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-[#235697] text-2xl font-bold uppercase">Frequently Asked Questions</h3>
                
                {/* Nút Report Issue */}
                <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 bg-[#E90000]/10 text-red-500 hover:bg-[#E90000] hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-all "
                >
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    Report an Issue
                </button>
            </div>

            {/* --- FAQ Accordion List --- */}
            <div className="flex flex-col gap-4">
                {FAQ_DATA.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                        <div 
                            key={item.id} 
                            className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
                        >
                            <button 
                                onClick={() => setOpenId(isOpen ? null : item.id)}
                                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${
                                    isOpen ? 'bg-[#235697] text-white' : 'hover:bg-gray-50 text-[#0E2A46]'
                                }`}
                            >
                                <span className="font-bold text-lg">{item.question}</span>
                                {isOpen ? (
                                    <MinusIcon className="w-6 h-6" />
                                ) : (
                                    <PlusIcon className="w-6 h-6 text-gray-400" />
                                )}
                            </button>
                            
                            {isOpen && (
                                <div className="p-6 text-gray-600 leading-relaxed text-[15px] animate-slideDown">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- Modal Report Issue --- */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scaleIn">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h4 className="text-[#235697] text-xl font-bold">Report Clinical Issue</h4>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setIsReportModalOpen(false); }}>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Current Case ID</label>
                                <input 
                                    type="text" 
                                    value={caseId} 
                                    disabled 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#235697] uppercase mb-1">Issue Category</label>
                                <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#235697] focus:border-transparent outline-none">
                                    <option>Incorrect Clinical Logic</option>
                                    <option>Technical Bug (Chat/UI)</option>
                                    <option>Scoring Discrepancy</option>
                                    <option>Content Suggestion</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#235697] uppercase mb-1">Description</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Describe the issue you encountered in detail..."
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#235697] focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            <button className="w-full bg-[#1BA7D9] hover:bg-[#235697] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md mt-2">
                                Submit Issues
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}