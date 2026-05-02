import { useState } from 'react';
import { 
    ClockIcon, 
    PauseIcon, 
    Squares2X2Icon, 
    PaperAirplaneIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

import ActionModal from "@/src/features/assessment/takeAssessment/components/subComponents/ActionModal";
import { PauseModalContent }  from "@/src/features/assessment/takeAssessment/components/subComponents/PauseModal";
import { SubmitModalContent } from "@/src/features/assessment/takeAssessment/components/subComponents/SubmitModal";
interface SidebarOverviewProps {
    timeLeft: number;
    totalQuestions: number;
    currentIdx: number;
    answers: Record<string, string>; 
    onJumpToQuestion: (index: number) => void;
    questionIds: string[]; 
    assessmentId: string;
}

export default function SidebarOverview({ 
    timeLeft, 
    totalQuestions = 0, 
    currentIdx, 
    answers, 
    onJumpToQuestion,
    questionIds = [],
    assessmentId
}: SidebarOverviewProps) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const [modalType, setModalType] = useState<'pause' | 'submit' | null>(null);

    const answeredCount = Object.keys(answers).length;

    const handleCloseModal = () => setModalType(null);

    return (
        <aside className="fixed top-[72px] right-0 w-80 h-[calc(100vh-72px)] bg-[#F6F6F6] border-l border-slate-200 z-40 flex flex-col p-6 shadow-sm">
            
            {/* Timer Section */}
            <div className="bg-white rounded-2xl p-6 mb-8 text-center border border-slate-100 shadow-sm shrink-0">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-2 font-bold uppercase tracking-tighter">
                    <ClockIcon className="w-6 h-6 text-[#235697]" /> 
                    <span>Time Remaining</span>
                </div>
                <div className="text-4xl font-black text-[#235697] tabular-nums tracking-tight">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            {/* Questions Overview */}
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                <h4 className="flex items-center gap-2 font-black text-[#235697] mb-6 text-xl uppercase tracking-[0.2em]">
                    <SparklesIcon className="w-8 h-8 text-[#235697]" /> 
                    <span>Overview</span>
                </h4>
                
                <div className="grid grid-cols-5 gap-3 pb-6">
                    {Array.from({ length: totalQuestions }).map((_, i) => {
                        const isActive = i === currentIdx; 
                        const qId = questionIds[i];
                        const isAnswered = qId ? !!answers[qId] : false;

                        return (
                            <button
                                key={i}
                                onClick={() => onJumpToQuestion(i)}
                                className={`h-11 rounded-xl font-bold transition-all border-2 text-sm flex items-center justify-center 
                                ${
                                    isActive 
                                    ? "border-[#1BA7D9] bg-[#1BA7D9] text-white shadow-md scale-105 z-10" 
                                    : isAnswered 
                                        ? "bg-[#235697] border-[#235697] text-white" 
                                        : "bg-white text-slate-400 border-transparent hover:border-slate-200"
                                }`}
                            >
                                {i + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-slate-100 shrink-0">
                <button 
                    onClick={() => setModalType('pause')}
                    className="group w-full py-3.5 bg-[#235697] border-slate-200 text-white rounded-xl font-regular flex items-center justify-center gap-2 hover:bg-[#1BA7D9] transition-all active:scale-95"
                >
                    <PauseIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                    Pause Assessment
                </button>
                
                <button 
                    onClick={() => setModalType('submit')}
                    className="w-full py-3.5 bg-linear-to-r from-[#1BA7D9] to-[#235697] text-white rounded-xl font-regular flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                    <PaperAirplaneIcon className="w-5 h-5" /> 
                    Finish & Submit
                </button>
            </div>

            {/* Tích hợp Modals */}
            <ActionModal isOpen={modalType === 'pause'} onClose={handleCloseModal}>
                <PauseModalContent 
                    onConfirm={() => {
                        console.log("Xử lý logic tạm dừng...");
                        handleCloseModal();
                    }} 
                    onCancel={handleCloseModal} 
                />
            </ActionModal>

            <ActionModal isOpen={modalType === 'submit'} onClose={handleCloseModal}>
                <SubmitModalContent 
                    answeredCount={answeredCount}
                    totalQuestions={totalQuestions}
                    assessmentId={assessmentId} 
                    onConfirm={() => {
                        console.log("Submitting to server...");
                    }} 
                    onCancel={handleCloseModal}
                />
            </ActionModal>
        </aside>
    );
}