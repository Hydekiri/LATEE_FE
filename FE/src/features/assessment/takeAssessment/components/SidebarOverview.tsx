import { useState } from 'react';
import { ClockIcon, PauseIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/solid';
import ActionModal from "@/src/features/assessment/takeAssessment/components/subComponents/ActionModal";
import { PauseModalContent } from "@/src/features/assessment/takeAssessment/components/subComponents/PauseModal";
import { SubmitModalContent } from "@/src/features/assessment/takeAssessment/components/subComponents/SubmitModal";

interface SidebarOverviewProps {
    timeLeft: number;
    durationSeconds: number;
    totalQuestions: number;
    currentIdx: number;
    answers: Record<string, string>;
    onJumpToQuestion: (index: number) => void;
    questionIds: string[];
    assessmentId: string;
    onPause: () => void;
}

export default function SidebarOverview({
    timeLeft, durationSeconds, totalQuestions, currentIdx, answers, onJumpToQuestion, questionIds, assessmentId, onPause
}: SidebarOverviewProps) {
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isSubmitModalOpen = showSubmitModal || timeLeft === 0;

    return (
        <aside className="fixed top-[72px] right-0 w-80 h-[calc(100vh-72px)] bg-[#F6F6F6] border-l p-6 flex flex-col z-40">
            <div className="bg-white rounded-2xl p-6 mb-8 text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-2 font-bold uppercase">
                    <ClockIcon className="w-6 h-6 text-[#235697]" />
                    <span>Time Remaining</span>
                </div>
                <div className="text-4xl font-black text-[#235697] tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <h4 className="flex items-center gap-2 font-black text-[#235697] mb-6 text-xl uppercase tracking-widest">
                    <SparklesIcon className="w-8 h-8" /> Overview
                </h4>
                <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => onJumpToQuestion(i)}
                            className={`h-11 rounded-xl font-bold border-2 transition-all ${i === currentIdx ? "bg-[#1BA7D9] text-white border-[#1BA7D9]" :
                                    answers[questionIds[i]] ? "bg-[#235697] text-white border-[#235697]" : "bg-white text-slate-400 border-transparent"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto pt-6">
                <button
                    onClick={() => setShowPauseModal(true)}
                    className="w-full py-3.5 bg-[#235697] text-white rounded-xl flex items-center justify-center gap-2"
                >
                    <PauseIcon className="w-5 h-5" /> Pause
                </button>
                <button
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-3.5 bg-linear-to-r from-[#1BA7D9] to-[#235697] text-white rounded-xl font-bold flex items-center justify-center gap-2"
                >
                    <PaperAirplaneIcon className="w-5 h-5" /> Submit
                </button>
            </div>

            <ActionModal isOpen={isSubmitModalOpen} onClose={() => setShowSubmitModal(false)}>
                <SubmitModalContent
                    answeredCount={Object.keys(answers).length}
                    totalQuestions={totalQuestions}
                    assessmentId={assessmentId}
                    answers={answers}
                    durationSeconds={durationSeconds}
                    autoSubmit={timeLeft === 0}
                    onCancel={() => setShowSubmitModal(false)}
                />
            </ActionModal>

            <ActionModal isOpen={showPauseModal} onClose={() => setShowPauseModal(false)}>
                <PauseModalContent
                    onConfirm={() => {
                        setShowPauseModal(false);
                        onPause();
                    }}
                    onCancel={() => setShowPauseModal(false)}
                />
            </ActionModal>
        </aside>
    );
}