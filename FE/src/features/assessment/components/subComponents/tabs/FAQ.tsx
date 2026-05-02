// src/features/practice/takePractice/components/FAQ.tsx
'use client';

import { useState } from 'react';
import { 
    PlusIcon, 
    MinusIcon, 
    ExclamationTriangleIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
    CalendarDaysIcon,
    UserCircleIcon
} from '@heroicons/react/24/solid';
import { AssessmentData } from '@/src/types/assessment';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

// Dữ liệu giả lập các báo cáo từ người học khác về case này
const LEARNER_ISSUES = [
    {
        id: 101,
        user: "Dr. Smith",
        date: "March 12, 2026",
        category: "Clinical Logic",
        content: "The recommended dosage for Lisinopril in this elderly patient seems high given the decreased GFR. Is the AI considering renal adjustment?",
        status: "Reviewed",
        expert_reply: "Good catch. The case parameters reflect a specific guideline-directed therapy, but we are refining the renal adjustment logic."
    },
    {
        id: 102,
        user: "Medical_Intern_NY",
        date: "Feb 28, 2026",
        category: "Scoring",
        content: "I didn't receive points for ordering a Chest X-ray even though the patient had acute shortness of breath.",
        status: "Pending",
        expert_reply: null
    }
];

const FAQ_DATA: FAQItem[] = [
    {
        id: 1,
        question: "How is my final score calculated?",
        answer: "Your final score is a weighted average of four key Entrustable Professional Activities (EPAs): Information Gathering, Diagnostic Reasoning, Testing, and Management Planning. Each section is evaluated based on the accuracy and clinical relevance of your decisions."
    },
    {
        id: 2,
        question: "Can I retake a specific clinical case?",
        answer: "Yes, you can practice each case multiple times. We encourage retaking cases where you received 'Needs Improvement' feedback to refine your clinical reasoning."
    },
    {
        id: 3,
        question: "What should I do if the AI doesn't understand my diagnosis?",
        answer: "Ensure you are using standard medical terminology. If you believe your answer was correct but not recognized, use the 'Report Issue' button."
    }
];

export default function FAQ({ data }: { data: AssessmentData }) {
    const [openId, setOpenId] = useState<number | null>(1);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [caseId] = useState(data?.assessmentId ?? 'N/A');

    return (
        <div className="flex flex-col gap-10 pb-10 animate-fadeIn max-w-5xl mx-auto font-sans">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <h3 className="text-[#235697] text-2xl font-bold uppercase tracking-wide">Support & Case Insights</h3>
                    <p className="text-gray-500 text-sm">Review previous learner reports or find general help.</p>
                </div>
                
                <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 bg-[#E90000]/10 text-red-600 hover:bg-[#E90000] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
                >
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    Report an Issue
                </button>
            </div>

            {/* --- SECTION 1: LEARNER ISSUES (CASE-SPECIFIC) --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#235697]">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    <h4 className="font-bold text-lg tracking-tight">Recent Reports for this Case ({LEARNER_ISSUES.length})</h4>
                </div>
                
                <div className="grid gap-6">
                    {LEARNER_ISSUES.map((issue) => (
                        <div key={issue.id} className="bg-white border border-gray-100 rounded-lg p-6 shadow-md hover:border-blue-200 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <UserCircleIcon className="w-10 h-10 text-gray-300" />
                                    <div>
                                        <p className="font-bold text-[#0E2A46] text-[15px]">{issue.user}</p>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                                            {issue.date}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-[inset_0_2px_6px_rgba(0,0,0,0.05)] ${
                                    issue.status === 'Reviewed' ? 'bg-[#00BC10] text-white' : 'bg-[#F99A00] text-white'
                                }`}>
                                    {issue.status}
                                </span>
                            </div>
                            
                            <div className="space-y-3 pl-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-blue-50 text-[#235697] px-2 py-0.5 rounded font-extrabold uppercase tracking-tighter border border-blue-100">
                                        {issue.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 text-[14px] bg-[#E2E8F0]/40 rounded-lg leading-relaxed italic border-l-4 border-[#235697] pl-4 py-2">
                                    &ldquo;{issue.content}&rdquo;
                                </p>
                                
                                {issue.expert_reply && (
                                    <div className="mt-4 bg-[#00B7FF]/10 rounded-lg p-4 border-r-4 border-[#1BA7D9]">
                                        <p className="text-[#235697] text-[13px] font-bold mb-1 flex items-center gap-1.5">
                                            <PaperAirplaneIcon className="w-3.5 h-3.5 rotate-180" /> Expert Reply:
                                        </p>
                                        <p className="text-gray-600 text-[13px] leading-relaxed">{issue.expert_reply}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* --- SECTION 2: FREQUENTLY ASKED QUESTIONS --- */}
            <div className="space-y-6">
                <h4 className="font-bold text-lg text-[#235697]">Frequently Asked Questions</h4>
                <div className="grid gap-4">
                    {FAQ_DATA.map((item) => {
                        const isOpen = openId === item.id;
                        return (
                            <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300">
                                <button 
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className={`w-full flex items-center justify-between p-5 text-left transition-all ${
                                        isOpen ? 'bg-[#235697] text-white' : 'hover:bg-gray-50 text-[#0E2A46]'
                                    }`}
                                >
                                    <span className="font-bold text-md leading-tight">{item.question}</span>
                                    {isOpen ? (
                                        <MinusIcon className="w-5 h-5" />
                                    ) : (
                                        <PlusIcon className="w-5 h-5 text-gray-300" />
                                    )}
                                </button>
                                
                                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="p-6 text-gray-600 leading-relaxed text-[15px] border-t border-gray-50 bg-white">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MODAL REPORT ISSUE --- */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
                        <div className="flex items-center justify-between p-8 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                                </div>
                                <h4 className="text-[#235697] text-xl font-extrabold tracking-tight">Report Clinical Issue</h4>
                            </div>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                <XMarkIcon className="w-7 h-7" />
                            </button>
                        </div>

                        <form className="p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); setIsReportModalOpen(false); }}>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-2 pl-1">Case Identifier</label>
                                <input 
                                    type="text" 
                                    value={caseId} 
                                    disabled 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-400 font-mono text-xs cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[#235697] uppercase tracking-[0.1em] pl-1">Issue Category</label>
                                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#235697] focus:border-transparent outline-none bg-white appearance-none cursor-pointer transition-all">
                                    <option>Incorrect Clinical Logic</option>
                                    <option>Technical Bug (Chat/UI)</option>
                                    <option>Scoring Discrepancy</option>
                                    <option>Guideline Mismatch</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-[#235697] uppercase tracking-[0.1em] pl-1">Detailed Description</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Explain why this case logic or score is incorrect..."
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#235697] outline-none resize-none transition-all"
                                />
                            </div>

                            <button type="submit" className="w-full bg-[#235697] hover:bg-[#1a3f6e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 mt-4">
                                Submit Feedback
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 mb-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}