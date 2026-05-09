'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ChevronDownIcon, 
    ChevronUpIcon,
    DocumentTextIcon,
    InformationCircleIcon
} from '@heroicons/react/24/solid';
import { Loader2 } from 'lucide-react';

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

function ResultsContent() {
    const searchParams = useSearchParams();
    const attemptId = searchParams.get('attemptId');
    
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<AttemptDetail | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchAttemptDetails = async () => {
            if (!attemptId) return;
            
            setLoading(true);
            try {
                // Sử dụng endpoint từ API V1 bạn cung cấp
                const response = await fetch(`http://localhost:5000/assessment/api/assessments/attempts/${attemptId}`, {
                    headers: { 'accept': '*/*' }
                });
                
                if (!response.ok) throw new Error("Không thể lấy dữ liệu kết quả.");
                
                const result = await response.json();
                setData(result.data); 
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttemptDetails();
    }, [attemptId]);

    if (loading) return (
        <div className="flex flex-col items-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 w-10 h-10 text-[#235697]" />
            <p>Đang tải kết quả bài thi...</p>
        </div>
    );

    if (!data) return <div className="py-20 text-center text-slate-500">Không tìm thấy dữ liệu lượt thi.</div>;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Tóm tắt kết quả tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="md:col-span-3 relative w-full h-48 md:h-full rounded-2xl overflow-hidden bg-[#A7E6FF]">
                    <Image 
                        src="/images/Robot2.png" 
                        alt="AI Assistant Result" 
                        fill
                        className="object-cover" 
                    />
                </div>
                
                <div className="md:col-span-7 flex flex-col justify-center">
                    <h3 className="text-[#235697] font-black text-3xl mb-4 uppercase tracking-tight">Case Evaluation</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Final Score</p>
                            <p className="text-4xl font-black text-[#235697]">{Math.round(data.score)}<span className="text-xl text-slate-400">/100</span></p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Status</p>
                            <p className={`text-2xl font-black ${data.isPassed ? 'text-green-500' : 'text-red-500'}`}>
                                {data.isPassed ? 'PASSED' : 'FAILED'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            <span className="text-slate-700 font-bold">{data.correctCount} / {data.questions.length} Correct</span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            Attempt ID: <span className="font-mono">#{data.attemptId.substring(0, 8)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách câu hỏi chi tiết */}
            <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#235697] flex items-center gap-2 mb-2">
                    <DocumentTextIcon className="w-6 h-6" /> Review chi tiết
                </h3>
                {data.questions.map((q, idx) => (
                    <div key={q.questionId} className={`bg-white rounded-xl border transition-all ${q.isCorrect ? 'border-slate-200' : 'border-red-100 shadow-sm'}`}>
                        <div 
                            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                            className={`p-6 cursor-pointer flex items-start gap-4 ${!q.isCorrect && 'bg-red-50/10'}`}
                        >
                            {q.isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
                            <div className="flex-1 text-left">
                                <p className="font-bold text-[#235697]">Câu {idx + 1}: <span className="font-normal text-slate-700">{q.content}</span></p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className={q.isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>Bạn chọn: {q.userAnswerId || "N/A"}</span>
                                    {!q.isCorrect && <span className="text-green-600 font-bold">Đáp án đúng: {q.correctAnswerId}</span>}
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

export default function Results() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-slate-400"><Loader2 className="animate-spin mx-auto mb-2" /> Loading Results...</div>}>
            <ResultsContent />
        </Suspense>
    );
}