"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AssessmentFullDetails } from "@/src/types/assessment";
import QuestionCard from "@/src/features/assessment/takeAssessment/components/QuestionCard";
import SidebarOverview from "@/src/features/assessment/takeAssessment/components/SidebarOverview";
import AssessmentNavbar from "@/src/components/layout/AssessmentNavbar";

interface Props {
    assessmentData: AssessmentFullDetails;
}

export default function TakeAssessmentFeature({ assessmentData }: Props) {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(assessmentData.timeLimitMinutes * 60);
    const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

    const QUESTIONS_PER_PAGE = 3;
    const totalQuestions = assessmentData.questions.length;
    const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSelect = (questionId: string, choiceId: string, globalIdx: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
        setActiveQuestionIdx(globalIdx);
    };

    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const currentQuestions = assessmentData.questions.slice(
        startIndex,
        startIndex + QUESTIONS_PER_PAGE
    );

    const onJumpToQuestion = (idx: number) => {
        setActiveQuestionIdx(idx);
        const targetPage = Math.floor(idx / QUESTIONS_PER_PAGE);
        
        setCurrentPage(targetPage);

        setTimeout(() => {
            const element = document.getElementById(`question-${idx}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150); 
    };

    const answeredCount = Object.keys(answers).length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    return (
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
            <AssessmentNavbar />

            <div className="flex flex-1 relative">
                <main className="flex-1 py-10 px-4 mr-40 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                            <span>Assessment</span>
                            <ChevronRight size={14} />
                            <span className="text-[#235697]">#{assessmentData.assessmentId}</span>
                            <ChevronRight size={14} />
                            <span className="italic text-slate-300">Doing</span>
                        </div>

                        <h1 className="text-3xl font-bold text-[#235697] mb-8 leading-snug">
                            {assessmentData.title}
                        </h1>

                        <div className="mb-12">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-[#235697]">
                                    Completed: {answeredCount} / {totalQuestions} Questions
                                </span>
                                <span className="text-sm font-bold text-[#235697]">{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-[#235697] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            {currentQuestions.map((q, idx) => {
                                const globalIdx = startIndex + idx;
                                return (
                                    <QuestionCard
                                        key={q.questionId}
                                        index={globalIdx}
                                        question={q}
                                        selectedAnswer={answers[q.questionId]}
                                        onSelect={(choiceId) => handleSelect(q.questionId, choiceId, globalIdx)}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex justify-between mt-12 mb-20 items-center">
                            <button
                                disabled={currentPage === 0}
                                onClick={() => {
                                    setCurrentPage((prev) => prev - 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-2 py-2 text-[#235697] font-bold disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-all"
                            >
                                <ChevronLeft /> Previous Page
                            </button>

                            <div className="text-slate-400 font-medium">
                                Page {currentPage + 1} of {totalPages}
                            </div>

                            <button
                                disabled={currentPage === totalPages - 1}
                                onClick={() => {
                                    setCurrentPage((prev) => prev + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-2 py-2 text-[#235697] font-bold disabled:opacity-20 hover:bg-slate-100 rounded-lg transition-all"
                            >
                                Next Page <ChevronRight />
                            </button>
                        </div>
                    </div>
                </main>

                <SidebarOverview
                    timeLeft={timeLeft}
                    totalQuestions={totalQuestions}
                    currentIdx={activeQuestionIdx} 
                    answers={answers}
                    questionIds={assessmentData.questions.map((q) => q.questionId)}
                    onJumpToQuestion={onJumpToQuestion}
                    assessmentId={assessmentData.assessmentId}
                />
            </div>
        </div>
    );
}