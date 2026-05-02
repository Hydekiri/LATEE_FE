import { useState } from "react";
import { AssessmentQuestion } from "@/src/types/assessment";
import { FlagIcon as FlagOutline } from "@heroicons/react/24/outline";
import { FlagIcon as FlagSolid } from "@heroicons/react/24/solid";

interface QuestionCardProps {
    question: AssessmentQuestion;
    selectedAnswer: string | undefined;
    onSelect: (choiceId: string) => void;
    index: number;
}

export default function QuestionCard({ question, selectedAnswer, onSelect, index }: QuestionCardProps) {
    const [isFlagged, setIsFlagged] = useState(false);

    return (
        <div id={`question-${index}`} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm animate-fadeIn">
            {/* Header Section */}
            <div className="relative mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-[#235697]">
                        Question {index + 1}:
                    </h3>
                
                    <button
                        type="button"
                        onClick={() => setIsFlagged(!isFlagged)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                            isFlagged 
                            ? " text-[#235697] shadow-sm" 
                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                        }`}
                    >
                        {isFlagged ? (
                            <FlagSolid className="w-5 h-5" />
                        ) : (
                            <FlagOutline className="w-5 h-5" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {isFlagged ? "Flagged" : "Flag"}
                        </span>
                    </button>
                </div>
                <div className="h-1 w-full bg-[#235697] rounded-full mt-4"></div>
            </div>

            {/* Question Content */}
            <p className="text-slate-800 text-[1.1rem] mb-10 leading-relaxed font-normal">
                {question.content}
            </p>

            {/* Options Section */}
            <div className="space-y-4">
                {question.options.map((opt) => {
                    const isSelected = selectedAnswer === opt.id;
                    
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => onSelect(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                isSelected 
                                ? "border-[#00B7FF]/50 bg-[#00B7FF]/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                        >
                            <span className={`w-10 h-10 flex shrink-0 items-center justify-center rounded-lg font-bold text-lg border transition-colors ${
                                isSelected 
                                ? "bg-[#235697] border-[#235697] text-white" 
                                : "bg-white border-slate-200 text-slate-800"
                            }`}>
                                {opt.id}
                            </span>
                            
                            <span className={`text-lg font-semibold transition-colors ${
                                isSelected ? "text-[#235697]" : "text-slate-800"
                            }`}>
                                {opt.content}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}