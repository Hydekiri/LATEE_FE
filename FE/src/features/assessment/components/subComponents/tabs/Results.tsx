'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    PlayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    DocumentTextIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';
import { getCookie } from '@/src/utils/cookies';
import { AssessmentData } from '@/src/types/assessment';

interface OptionResult {
    id: string;
    content: string;
    isCorrect: boolean;
}

interface QuestionResult {
    questionId: string;
    content: string;
    userAnswerId: string;
    correctAnswerId: string;
    isCorrect: boolean;
    explanation: string;
    options: OptionResult[];
}

interface AttemptDetail {
    attemptId: string;
    score: number;
    isPassed: boolean;
    correctCount: number;
    questions: QuestionResult[];
}

interface AttemptOverview {
    attemptId: string;
    attemptNo: number;
    score: number;
    maxScore: number;
    isPassed: boolean;
    correctCount: number;
    duration: number;
    passingScorePercentage: number;
}

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} mins${secs > 0 ? ` ${secs} secs` : ''}`;
};

const getAttemptLabel = (num: number) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
};

function ResultsContent({ data }: { data: AssessmentData }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryAttemptId = searchParams.get('attemptId');

    const [loadingAttempts, setLoadingAttempts] = useState<boolean>(true);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [listAttempt, setListAttempt] = useState<AttemptOverview[]>([]);
    const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(queryAttemptId);
    const [detailedAttempt, setDetailedAttempt] = useState<AttemptDetail | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const selectedAttemptIndex = Math.max(
        listAttempt.findIndex((item) => item.attemptId === selectedAttemptId),
        0
    );
    const canGoPrev = selectedAttemptIndex > 0;
    const canGoNext = selectedAttemptIndex >= 0 && selectedAttemptIndex < listAttempt.length - 1;

    useEffect(() => {
        const fetchAllAttempt = async () => {
            setLoadingAttempts(true);
            try {
                const accessToken = getCookie('accessToken');
                const learnerId = getCookie('userId');
                const response = await fetch(
                    `http://localhost:5000/assessment/api/assessments/${data.assessmentId}/learner/${learnerId}/attempts`,
                    {
                        headers: { accept: '*/*', Authorization: `Bearer ${accessToken}` }
                    }
                );

                if (!response.ok) throw new Error('Cannot fetch attempts.');

                const result = await response.json();
                const attempts: AttemptOverview[] = result?.data || [];
                setListAttempt(attempts);

                if (attempts.length === 0) {
                    setSelectedAttemptId(null);
                    return;
                }

                const hasQueryAttempt = queryAttemptId && attempts.some((item) => item.attemptId === queryAttemptId);
                setSelectedAttemptId(hasQueryAttempt ? queryAttemptId : attempts[0].attemptId);
            } catch (error) {
                console.error('Fetch error:', error);
                setListAttempt([]);
                setSelectedAttemptId(null);
            } finally {
                setLoadingAttempts(false);
            }
        };

        fetchAllAttempt();
    }, [data.assessmentId, queryAttemptId]);

    useEffect(() => {
        const fetchAttemptDetails = async () => {
            if (!selectedAttemptId) {
                setDetailedAttempt(null);
                return;
            }

            setLoadingDetail(true);
            setExpandedIndex(null);
            try {
                const accessToken = getCookie('accessToken');
                const response = await fetch(
                    `http://localhost:5000/assessment/api/assessments/attempts/${selectedAttemptId}`,
                    {
                        headers: { accept: '*/*', Authorization: `Bearer ${accessToken}` }
                    }
                );

                if (!response.ok) throw new Error('Cannot fetch attempt details.');

                const result = await response.json();
                setDetailedAttempt(result?.data || null);
            } catch (error) {
                console.error('Fetch error:', error);
                setDetailedAttempt(null);
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchAttemptDetails();
    }, [selectedAttemptId]);

    const selectedAttemptOverview = listAttempt.find((item) => item.attemptId === selectedAttemptId) || null;

    const handlePrevAttempt = () => {
        if (!canGoPrev) return;

        const nextAttempt = listAttempt[selectedAttemptIndex - 1];
        if (!nextAttempt) return;

        setSelectedAttemptId(nextAttempt.attemptId);
        router.replace(`/assessment/${data.assessmentId}?tab=results&attemptId=${nextAttempt.attemptId}`, { scroll: false });
    };

    const handleNextAttempt = () => {
        if (!canGoNext) return;

        const nextAttempt = listAttempt[selectedAttemptIndex + 1];
        if (!nextAttempt) return;

        setSelectedAttemptId(nextAttempt.attemptId);
        router.replace(`/assessment/${data.assessmentId}?tab=results&attemptId=${nextAttempt.attemptId}`, { scroll: false });
    };

    if (loadingAttempts || loadingDetail) {
        setTimeout(() => {
            if (!loadingAttempts && !loadingDetail) return;
            return (
                <div className="flex flex-col items-center py-20 text-slate-400">
                    <Loader2 className="animate-spin mb-4 w-10 h-10 text-[#235697]" />
                    <p>Loading...</p>
                </div>
            );
        }, 1000);
    }

    if (listAttempt.length === 0) {
        return <div className="py-20 text-center text-slate-500">No attempts found for this assessment.</div>;
    }

    if (!detailedAttempt || !selectedAttemptOverview) {
        return <div className="py-20 text-center text-slate-500">No attempt detail available.</div>;
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="pt-2 mb-2 relative w-full">
                <div className="flex items-center w-full">
                    <button
                        onClick={handlePrevAttempt}
                        className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                        disabled={!canGoPrev}
                    >
                        <PlayIcon className="w-6 h-6 rotate-180" />
                    </button>

                    <div className="flex flex-1 items-center gap-2">
                        {(() => {
                            const activeIndex = Math.max(selectedAttemptIndex, 0);
                            const startPair = activeIndex % 2 === 0 ? activeIndex : activeIndex - 1;
                            const pair = [startPair, startPair + 1];

                            return pair.map((idx) => {
                                const attempt = listAttempt[idx];

                                if (!attempt) {
                                    return (
                                        <div key={`empty-${idx}`} className="flex-1 relative">
                                            <button className="pb-4 w-full text-base font-bold text-gray-300 hover:text-[#1BA7D9] transition-colors relative text-center whitespace-nowrap group">
                                                Practice More
                                                <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                                <span className="absolute -bottom-px left-0 w-full h-1 rounded-full bg-gray-200" />
                                            </button>
                                        </div>
                                    );
                                }

                                const order = idx + 1;
                                const isActive = attempt.attemptId === selectedAttemptId;

                                return (
                                    <div key={attempt.attemptId} className="flex-1 relative">
                                        <button
                                            onClick={() => {
                                                setSelectedAttemptId(attempt.attemptId);
                                                router.replace(`/assessment/${data.assessmentId}?tab=results&attemptId=${attempt.attemptId}`, { scroll: false });
                                            }}
                                            className={`pb-4 w-full text-base font-bold transition-colors relative text-center whitespace-nowrap ${isActive ? 'text-[#235697]' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {order}{getAttemptLabel(order)} attempt result
                                            <span className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${isActive ? 'bg-[#235697] z-20' : 'bg-gray-300'}`} />
                                        </button>
                                    </div>
                                );
                            });
                        })()}
                    </div>

                    <button
                        onClick={handleNextAttempt}
                        className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                        disabled={!canGoNext}
                    >
                        <PlayIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-10 gap-8 bg-white rounded-xl">
                <div className="col-span-3 relative w-full h-52 md:h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF]">
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
                            <span className="text-[#0E2A46] ml-1">{Math.round(selectedAttemptOverview.score)} / 100</span>
                        </li>

                        <li className="flex items-center gap-1">
                            <span className="font-bold text-[#235697]">Status:</span>
                            <span className={`ml-1 font-bold ${selectedAttemptOverview.isPassed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                {selectedAttemptOverview.isPassed ? 'PASSED' : 'FAILED'}
                            </span>
                        </li>

                        <li className="flex items-center gap-1">
                            <span className="font-bold text-[#235697]">Correct Answer:</span>
                            <span className="text-[#0E2A46] ml-1">
                                {selectedAttemptOverview.correctCount} / {detailedAttempt.questions.length}
                            </span>
                            <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
                        </li>

                        <li>
                            <span className="font-bold text-[#235697]">Duration:</span>
                            <span className="text-[#0E2A46] ml-1">{formatDuration(selectedAttemptOverview.duration)}</span>
                        </li>

                        <li>
                            <span className="font-bold text-[#235697]">Passing Goal:</span>
                            <span className="text-[#0E2A46] ml-1">{selectedAttemptOverview.passingScorePercentage}%</span>
                        </li>

                        <li>
                            <span className="font-bold text-[#235697]">Attempt ID:</span>
                            <span className="text-[#0E2A46] ml-1 font-mono">#{selectedAttemptOverview.attemptId.substring(0, 8)}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#235697] flex items-center gap-2 mb-2">
                    <DocumentTextIcon className="w-6 h-6" /> Detailed Question Review
                </h3>
                {detailedAttempt.questions.map((q, idx) => (
                    <div key={q.questionId} className={`bg-white rounded-xl border transition-all ${q.isCorrect ? 'border-slate-200' : 'border-red-100 shadow-sm'}`}>
                        <div
                            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                            className={`p-6 cursor-pointer flex items-start gap-4 ${!q.isCorrect && 'bg-red-50/10'}`}
                        >
                            {q.isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                            <div className="flex-1 text-left">
                                <p className="font-bold text-[#235697]">Question {idx + 1}: <span className="font-normal text-slate-700">{q.content}</span></p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className={q.isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>Your Answer: {q.userAnswerId || 'N/A'}</span>
                                    {!q.isCorrect && <span className="text-green-600 font-bold">Correct Answer: {q.correctAnswerId}</span>}
                                </div>
                            </div>
                            {expandedIndex === idx ? <ChevronUpIcon className="w-5 h-5 text-slate-400" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
                        </div>

                        {expandedIndex === idx && (
                            <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="h-px bg-slate-100 mb-6" />
                                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-left">
                                    <div className="flex items-center gap-2 mb-2 text-[#235697] font-bold text-xs uppercase tracking-widest">
                                        <InformationCircleIcon className="w-5 h-5" /> Clinical Explanation
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Results({ data }: { data: AssessmentData }) {
    return (
        <Suspense fallback={<div className="p-20 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" /> Loading Results...</div>}>
            <ResultsContent data={data} />
        </Suspense>
    );
}