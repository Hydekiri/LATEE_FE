'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayIcon, DocumentTextIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { evaluationService } from '@/src/services/evaluation-service';
import { EvaluationTabData } from '@/src/types/evaluation';

interface EvaluationProps {
    sessionId: string;
}

export default function Evaluation({ sessionId }: EvaluationProps) {
    const [currentAttempt, setCurrentAttempt] = useState(2);
    const maxTotalAttempts = 3;
    const [evalData, setEvalData] = useState<EvaluationTabData | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePrevAttempt = () => {
        if (currentAttempt > 1) setCurrentAttempt((prev) => Math.max(1, prev - 2));
    };
    const handleNextAttempt = () => {
        setCurrentAttempt((prev) => prev + 2);
    };

    const handleGetFeedback = async () => {
        if (!sessionId) {
            setError('No session ID found. Please complete a practice session first.');
            return;
        }
        setGenerating(true);
        setError(null);
        try {
            const feedback = await evaluationService.generatePracticeFeedback(sessionId);
            setEvalData((prev) => ({
                ...(prev || {}),
                overallAttempt: feedback.feedbackDetail,
                overallLabel: 'Generated',
                strength: feedback.strengths.join('\n'),
                improvements: feedback.improvements.join('\n'),
                epaScores: prev?.epaScores || [],
            }));
        } catch (err) {
            console.error(err);
            setError('Failed to generate feedback. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        if (!sessionId) return;
        let cancelled = false;

        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const feedback = await evaluationService.generatePracticeFeedback(sessionId);
                if (cancelled) return;
                setEvalData({
                    overallAttempt: feedback.feedbackDetail,
                    overallLabel: 'Pending',
                    strength: feedback.strengths.join('\n'),
                    improvements: feedback.improvements.join('\n'),
                    epaScores: [],
                });
            } catch (err) {
                if (cancelled) return;
                console.error(err);
                setError('Failed to load evaluation data.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void run();
        return () => { cancelled = true; };
    }, [sessionId]);

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="pt-2 mb-2 relative w-full">
                <div className="flex items-center w-full">
                    <button
                        onClick={handlePrevAttempt}
                        className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                        disabled={currentAttempt <= 2}
                    >
                        <PlayIcon className="w-6 h-6 rotate-180" />
                    </button>

                    <div className="flex flex-1 items-center gap-2">
                        {(() => {
                            const startPair = currentAttempt % 2 === 0 ? currentAttempt - 1 : currentAttempt;
                            const pair = [startPair, startPair + 1];
                            return pair.map((num) => {
                                const isActive = num === currentAttempt;
                                const isAvailable = num <= maxTotalAttempts;
                                const label = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
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
                                                <span className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-[#235697] z-20' : 'bg-gray-300'}`} />
                                            </button>
                                        ) : (
                                            <button className="pb-4 w-full text-base font-bold text-gray-300 hover:text-[#1BA7D9] transition-colors relative text-center whitespace-nowrap group">
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

                    <button onClick={handleNextAttempt} className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30">
                        <PlayIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
                <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF]">
                    <Image src="/images/Robot2.png" alt="AI" fill className="object-cover" />
                </div>

                <div className="col-span-7 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <DocumentTextIcon className="w-6 h-6 text-[#235697]" />
                            <h3 className="text-[#235697] text-2xl font-bold tracking-tight">Detailed Feedback</h3>
                        </div>
                        <button
                            onClick={() => void handleGetFeedback()}
                            disabled={generating}
                            className="flex items-center gap-4 bg-[#1BA7D9] hover:bg-[#158ebc] text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm"
                        >
                            {generating ? 'Generating...' : 'Get feedback'}
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-[#235697] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {!loading && !evalData && (
                        error ? (
                            <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-12 text-center text-red-600 font-bold">
                                {error}
                            </div>
                        ) : (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
                                Click &ldquo;Get feedback&rdquo; to generate your evaluation.
                            </div>
                        )
                    )}

                    {evalData && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#F99A00]/10 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[#333333] text-2xl font-bold">Overall Attempt</h4>
                                    <span className="bg-[#F99A00] text-white px-4 py-2 rounded-lg font-bold text-sm">
                                        {evalData.overallLabel || 'Not yet qualified'}
                                    </span>
                                </div>
                                <p className="text-[#0E2A46] leading-relaxed text-[15px]">{evalData.overallAttempt}</p>
                            </div>

                            <div className="bg-[#00BC10]/10 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[#299723] text-2xl font-bold">Strength</h4>
                                    <span className="bg-[#00BC10] text-white px-4 py-2 rounded-lg font-bold text-sm">Very good</span>
                                </div>
                                <p className="text-[#0E2A46] leading-relaxed text-[15px] whitespace-pre-line">{evalData.strength}</p>
                            </div>

                            <div className="bg-[#D90000]/10 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-[#B42424] text-2xl font-bold">Areas for Improvement</h4>
                                    <span className="bg-[#D90000] text-white px-4 py-2 rounded-lg font-bold text-sm">Needs improvement</span>
                                </div>
                                <p className="text-[#0E2A46] leading-relaxed text-[15px] whitespace-pre-line">{evalData.improvements}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}