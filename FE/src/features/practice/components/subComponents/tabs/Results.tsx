'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircleIcon, PlayIcon } from '@heroicons/react/24/solid';
import { evaluationService, mapEvaluationReportToResultsData } from '@/src/services/evaluation-service';
import { ResultsTabData } from '@/src/types/evaluation';

export default function Results() {
    const searchParams = useSearchParams();
    const resultId = searchParams.get('resultId');

    const [evalData, setEvalData] = useState<ResultsTabData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentAttempt, setCurrentAttempt] = useState(1);

    useEffect(() => {
        const fetchResult = async () => {
        if (!resultId) return;
        setLoading(true);
        setError(null);
        try {
            const report = await evaluationService.getReport(resultId);
            setEvalData(mapEvaluationReportToResultsData(report));
        } catch (err) {
            console.error('[Results] Error loading results:', err);
            setError('Failed to load evaluation results. Please try again.');
        } finally {
            setLoading(false);
        }
        };
        void fetchResult();
    }, [resultId]);

    const handlePrevAttempt = () => {
        if (currentAttempt > 1) setCurrentAttempt((prev) => Math.max(1, prev - 2));
    };
    const handleNextAttempt = () => {
        setCurrentAttempt((prev) => prev + 2);
    };

    if (loading) {
        return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#235697] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#235697] font-medium animate-pulse text-lg">Loading review results...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-600 font-medium">
            {error}
        </div>
        );
    }

    if (!evalData || !evalData.epaScores) {
        return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center text-gray-500 font-medium">
            {resultId
            ? 'No results found for this evaluation.'
            : 'Please complete the practice session to see the results.'}
        </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
        {/* Section 1: Attempt selector */}
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
                const totalAttemptsData = 1;
                return pair.map((num) => {
                    const isActive = num === currentAttempt;
                    const isAvailable = num <= totalAttemptsData;
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
                            <span
                            className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${
                                isActive ? 'bg-[#235697] z-20' : 'bg-gray-300'
                            }`}
                            />
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

            <button
                onClick={handleNextAttempt}
                className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30"
            >
                <PlayIcon className="w-6 h-6" />
            </button>
            </div>
        </div>

        {/* Section 2: Case Result Summary */}
        <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
            <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF] min-h-50">
            <Image src="/images/Robot2.png" alt="AI Assistant Result" fill className="object-cover" />
            </div>

            <div className="col-span-7 flex flex-col justify-center">
            <h3 className="text-[#235697] font-bold text-2xl mb-2 text-left">Case Result</h3>
            <ul className="space-y-1 text-md text-left">
                <li>
                <span className="font-bold text-[#235697]">Final Score:</span>
                <span className="text-[#0E2A46] ml-1">{evalData.finalScore}/100</span>
                </li>
                <li className="flex items-center gap-1">
                <span className="font-bold text-[#235697]">Final Diagnosis:</span>
                <span className="text-[#10B981] font-bold ml-1">{evalData.finalDiagnosis}</span>
                <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
                </li>
                <li>
                <span className="font-bold text-[#235697]">Discussion Type:</span>
                <span className="text-[#0E2A46] ml-1">{evalData.discussionType}</span>
                </li>
                <li>
                <span className="font-bold text-[#235697]">Duration:</span>
                <span className="text-[#0E2A46] ml-1">{evalData.duration}</span>
                </li>
                <li>
                <span className="font-bold text-[#235697]">Entrustment Level:</span>
                <span className="text-[#0E2A46] ml-1">{evalData.entrustmentLevel} / 5</span>
                </li>
                <li>
                <span className="font-bold text-[#235697]">Evaluation:</span>
                <span className="text-[#0E2A46] ml-1 line-clamp-2">{evalData.evaluation}</span>
                </li>
            </ul>
            </div>
        </div>

        {/* Section 3: EPA Score list */}
        <div className="flex flex-col gap-5">
            {evalData.epaScores
            .sort((a, b) => {
                const numA = parseInt(a.epaId.replace(/\D/g, '')) || 0;
                const numB = parseInt(b.epaId.replace(/\D/g, '')) || 0;
                return numA - numB;
            })
            .map((epa) => (
                <div
                key={epa.epaId}
                className="bg-[#F1F9FF] rounded-xl p-6 border border-transparent hover:border-[#235697]/10 transition-all duration-300 text-left"
                >
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[#235697] text-[20px] font-bold leading-tight max-w-[80%]">
                    {epa.epaId}: {epa.title}
                    </h4>
                    <div className="bg-[#1BA7D9] text-white px-3 py-1.5 rounded-lg font-bold text-[13px] whitespace-nowrap shadow-sm">
                    Score: {epa.numericalScore}/{epa.maxScore}
                    </div>
                </div>
                <p className="text-[#0E2A46] leading-relaxed text-[15px] opacity-85">
                    {epa.feedbackDetail}
                </p>
                </div>
            ))}
        </div>
        </div>
    );
}