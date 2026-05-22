// src/features/practice/components/subComponents/tabs/Results.tsx

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
    DocumentTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    PlusCircleIcon,
    MinusCircleIcon,
} from '@heroicons/react/24/solid';
import { PlayIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { evaluationService } from '@/src/services/evaluation-service';
import {
    PracticeHistoryItem,
    EvaluationReportResponse,
    ResultsEpaScore,
    DiagnosisMatchType,
    AdjustmentItem,
} from '@/src/types/evaluation';
import { getLearnerId } from '@/src/utils/cookies';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const EPA_TITLES: Record<string, string> = {
    EPA_1: 'Information Gathering',
    EPA_2: 'Differential Diagnosis Quality',
    EPA_3: 'Clinical Reasoning Interaction',
    EPA_4: 'Critical Thinking and Ruling Out',
    EPA_5: 'Interaction Efficiency and Professionalism',
    'EPA-001': 'Information Gathering',
};

function getEpaTitle(epaId: string): string {
    const cleanId = epaId.replace('-', '_');
    const title = EPA_TITLES[cleanId] ?? EPA_TITLES[epaId] ?? '';
    if (title) return `${epaId}: ${title}`;
    return epaId;
}

interface DiagnosisStyle {
    textClass: string;
    Icon: React.FC<{ className?: string }>;
    label: string;
}

function getDiagnosisStyle(matchType: DiagnosisMatchType): DiagnosisStyle {
    const upper = String(matchType).toUpperCase();

    if (upper.includes('EXACT') || upper === 'MATCH' || upper === 'CORRECT') {
        return {
            textClass: 'text-emerald-600',
            Icon: ({ className }) => <CheckCircleIcon className={className} />,
            label: 'Correct',
        };
    }

    if (upper.includes('PARTIAL') || upper === 'CLOSE') {
        return {
            textClass: 'text-amber-600',
            Icon: ({ className }) => (
                <ExclamationCircleIcon className={className} />
            ),
            label: 'Partial Match',
        };
    }

    return {
        textClass: 'text-red-500',
        Icon: ({ className }) => <XCircleIcon className={className} />,
        label: 'Incorrect',
    };
}

function formatDuration(minutes: number): string {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);

    if (s === 0) return `${m} min`;

    return `${m} min ${s} sec`;
}

/**
 * Trả về ordinal suffix đúng cho mọi số nguyên dương.
 * Xử lý đặc biệt các số tận cùng 11, 12, 13 → "th".
 */
function ordinalSuffix(n: number): string {
    const mod100 = n % 100;

    // 11, 12, 13 luôn là "th"
    if (mod100 >= 11 && mod100 <= 13) return 'th';

    switch (n % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

/**
 * Sắp xếp history theo createdAt tăng dần (cũ → mới).
 * Chỉ lấy các item Completed có evaluationId.
 */
function buildOrderedAttempts(
    items: readonly PracticeHistoryItem[]
): PracticeHistoryItem[] {
    return [...items]
        .filter(
            (item) =>
                item.status === 'Completed' && item.evaluationId != null
        )
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface AttemptTabsProps {
    readonly items: readonly PracticeHistoryItem[];
    readonly selectedIndex: number;
    readonly pairStart: number;
    readonly onSelect: (index: number) => void;
    readonly onPrev: () => void;
    readonly onNext: () => void;
}

function AttemptTabs({
    items,
    selectedIndex,
    pairStart,
    onSelect,
    onPrev,
    onNext,
}: AttemptTabsProps) {
    // Chỉ render những slot thực sự tồn tại (không render slot trống)
    const slotIndices = [pairStart, pairStart + 1].filter(
        (idx) => idx < items.length
    );

    const canPrev = pairStart > 0;
    const canNext = pairStart + 2 < items.length;

    return (
        <div className="pt-2 mb-2 relative w-full">
            <div className="flex items-center w-full">
                <button
                    onClick={onPrev}
                    disabled={!canPrev}
                    className="absolute -left-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all disabled:opacity-20 z-30"
                    aria-label="Previous attempts"
                >
                    <PlayIcon className="w-6 h-6 rotate-180" />
                </button>

                <div className="flex flex-1 items-center gap-2">
                    {slotIndices.map((slotIdx) => {
                        const attemptNumber = slotIdx + 1;
                        const isActive = slotIdx === selectedIndex;
                        const suffix = ordinalSuffix(attemptNumber);

                        return (
                            <div key={slotIdx} className="flex-1 relative">
                                <button
                                    onClick={() => onSelect(slotIdx)}
                                    className={`pb-4 w-full text-base font-bold transition-colors relative text-center whitespace-nowrap ${
                                        isActive
                                            ? 'text-[#235697]'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {attemptNumber}
                                    {suffix} attempt result

                                    <span
                                        className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${
                                            isActive
                                                ? 'bg-[#235697] z-20'
                                                : 'bg-gray-300'
                                        }`}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={onNext}
                    disabled={!canNext}
                    className="absolute -right-12 p-4 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30 disabled:opacity-20"
                    aria-label="Next attempts"
                >
                    <PlayIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

interface ResultSummaryCardProps {
    readonly report: EvaluationReportResponse;
    readonly attemptNumber: number;
}

function ResultSummaryCard({
    report,
    attemptNumber,
}: ResultSummaryCardProps) {
    const diagStyle = getDiagnosisStyle(report.diagnosisMatchType);

    return (
        <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
            <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF] min-h-[180px]">
                <Image
                    src="/images/Robot2.png"
                    alt="AI Assistant Result"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="col-span-7 flex flex-col justify-center">
                <h3 className="text-[#235697] font-bold text-2xl mb-2">
                    Attempt #{attemptNumber} — Case Result
                </h3>

                <ul className="space-y-1 text-md">
                    <li>
                        <span className="font-bold text-[#235697]">
                            Final Score:
                        </span>

                        <span className="text-[#0E2A46] ml-1">
                            {report.score}/100
                        </span>
                    </li>

                    <li className="flex items-center gap-1 flex-wrap">
                        <span className="font-bold text-[#235697]">
                            Your Diagnosis:
                        </span>

                        <span className="text-[#0E2A46] ml-1">
                            {report.finalDiagnosis}
                        </span>

                        <span
                            className={`font-bold ml-2 flex items-center gap-1 ${diagStyle.textClass}`}
                        >
                            <diagStyle.Icon className="w-4 h-4" />
                            {diagStyle.label}
                        </span>
                    </li>

                    {report.discussionType && (
                        <li>
                            <span className="font-bold text-[#235697]">
                                Discussion Type:
                            </span>

                            <span className="text-[#0E2A46] ml-1">
                                {report.discussionType}
                            </span>
                        </li>
                    )}

                    <li>
                        <span className="font-bold text-[#235697]">
                            Duration:
                        </span>

                        <span className="text-[#0E2A46] ml-1">
                            {formatDuration(report.duration)}
                        </span>
                    </li>

                    {report.moduleId && (
                        <li>
                            <span className="font-bold text-[#235697]">
                                Module:
                            </span>

                            <span className="text-[#0E2A46] ml-1">
                                {report.moduleId}
                            </span>
                        </li>
                    )}

                    {typeof report.entrustmentLevel === 'number' && (
                        <li>
                            <span className="font-bold text-[#235697]">
                                Entrustment Level:
                            </span>

                            <span className="text-[#0E2A46] ml-1">
                                {report.entrustmentLevel}
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

interface EpaResultSectionProps {
    readonly epaScores: readonly ResultsEpaScore[];
}

function EpaResultSection({ epaScores }: EpaResultSectionProps) {
    if (epaScores.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <DocumentTextIcon className="w-5 h-5 text-[#235697]" />

                <h3 className="text-[#235697] text-2xl font-bold tracking-tight">
                    Detailed Practice
                </h3>
            </div>

            <div className="flex flex-col gap-5">
                {epaScores.map((epa) => (
                    <div
                        key={epa.scoreId}
                        className="bg-[#F1F9FF] rounded-xl p-6 border border-transparent hover:border-[#235697]/10 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-[#235697] text-[20px] font-bold leading-tight max-w-[80%]">
                                {epa.title}
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

interface AdjustmentSectionProps {
    readonly positive: readonly AdjustmentItem[];
    readonly negative: readonly AdjustmentItem[];
}

function AdjustmentSection({
    positive,
    negative,
}: AdjustmentSectionProps) {
    if (positive.length === 0 && negative.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <PlusCircleIcon className="w-5 h-5 text-[#235697]" />

                <h3 className="text-[#235697] text-2xl font-bold tracking-tight">
                    Score Adjustments
                </h3>
            </div>

            <div className="flex flex-col gap-5">
                {positive.map((item, index) => (
                    <div
                        key={`pos_${item.code}_${index}`}
                        className="bg-emerald-50/60 rounded-xl p-6 border border-emerald-100 hover:border-emerald-500/20 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 max-w-[80%]">
                                <PlusCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />

                                <h4 className="text-emerald-800 text-[20px] font-bold leading-tight">
                                    {item.title}
                                </h4>
                            </div>

                            <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold text-[13px] whitespace-nowrap shadow-sm">
                                +{item.score}
                            </div>
                        </div>

                        <p className="text-emerald-900/85 leading-relaxed text-[15px]">
                            {item.reason}
                        </p>
                    </div>
                ))}

                {negative.map((item, index) => (
                    <div
                        key={`neg_${item.code}_${index}`}
                        className="bg-amber-50/60 rounded-xl p-6 border border-amber-100 hover:border-amber-500/20 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 max-w-[80%]">
                                <MinusCircleIcon className="w-5 h-5 text-amber-600 shrink-0" />

                                <h4 className="text-amber-800 text-[20px] font-bold leading-tight">
                                    {item.title}
                                </h4>
                            </div>

                            <div className="bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold text-[13px] whitespace-nowrap shadow-sm">
                                {item.score}
                            </div>
                        </div>

                        <p className="text-amber-900/85 leading-relaxed text-[15px]">
                            {item.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ResultSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-pulse">
            <div className="h-12 bg-gray-100 rounded-xl w-full" />

            <div className="grid grid-cols-10 gap-8">
                <div className="col-span-3 h-48 bg-gray-100 rounded-2xl" />

                <div className="col-span-7 flex flex-col gap-3 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-5 bg-gray-100 rounded w-3/4"
                        />
                    ))}
                </div>
            </div>

            <div className="h-48 bg-gray-100 rounded-xl" />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function Results() {
    const pathname = usePathname();

    const patientId = useMemo(() => {
        const segments = pathname.split('/');
        const practiceIdx = segments.indexOf('practice');

        return practiceIdx !== -1
            ? (segments[practiceIdx + 1] ?? '')
            : '';
    }, [pathname]);

    const learnerId = getLearnerId();

    const [attempts, setAttempts] = useState<
        readonly PracticeHistoryItem[]
    >([]);

    const [attemptsLoading, setAttemptsLoading] =
        useState<boolean>(true);

    const [attemptsError, setAttemptsError] =
        useState<string | null>(null);

    const [selectedIndex, setSelectedIndex] =
        useState<number>(0);

    const [pairStart, setPairStart] =
        useState<number>(0);

    const [report, setReport] =
        useState<EvaluationReportResponse | null>(null);

    const [reportLoading, setReportLoading] =
        useState<boolean>(false);

    const [reportError, setReportError] =
        useState<string | null>(null);

    const prevEvalIdRef = useRef<string | null>(null);

    // ── Load report ─────────────────────────────────────────────────────────

    const loadReport = useCallback(
        async (attempt: PracticeHistoryItem) => {
            if (!attempt.evaluationId) {
                setReport(null);
                setReportError(
                    'No evaluation available for this attempt yet.'
                );

                prevEvalIdRef.current = null;

                return;
            }

            // Tránh re-fetch cùng evaluation
            if (prevEvalIdRef.current === attempt.evaluationId) return;

            prevEvalIdRef.current = attempt.evaluationId;

            setReportLoading(true);
            setReport(null);
            setReportError(null);

            try {
                const data = await evaluationService.getReport(
                    attempt.evaluationId
                );

                setReport(data);
            } catch (err) {
                prevEvalIdRef.current = null;

                setReport(null);

                setReportError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load evaluation report.'
                );
            } finally {
                setReportLoading(false);
            }
        },
        []
    );

    // ── Load attempts ───────────────────────────────────────────────────────

    useEffect(() => {
        if (!patientId || !learnerId) return;

        let cancelled = false;

        const load = async () => {
            setAttemptsLoading(true);
            setAttemptsError(null);

            try {
                const result =
                    await evaluationService.getPracticeHistory(
                        learnerId,
                        patientId
                    );

                if (cancelled) return;

                // Sắp xếp chronological (cũ → mới),
                // chỉ lấy Completed + có evaluationId
                const ordered = buildOrderedAttempts(
                    result.items ?? []
                );

                setAttempts(ordered);

                if (ordered.length > 0) {
                    // Mặc định chọn attempt mới nhất
                    const lastIdx = ordered.length - 1;
                    const lastAttempt = ordered[lastIdx];

                    setSelectedIndex(lastIdx);

                    // Đặt pairStart về cặp chứa lastIdx
                    setPairStart(
                        Math.floor(lastIdx / 2) * 2
                    );

                    // ✅ load report trực tiếp
                    void loadReport(lastAttempt);
                }
            } catch (err) {
                if (!cancelled) {
                    setAttemptsError(
                        err instanceof Error
                            ? err.message
                            : 'Failed to load attempt history.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setAttemptsLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [patientId, learnerId, loadReport]);

    // ── Tab navigation ──────────────────────────────────────────────────────

    const handleSelectAttempt = (index: number) => {
        if (index < 0 || index >= attempts.length) return;

        const attempt = attempts[index];

        if (!attempt) return;

        prevEvalIdRef.current = null;

        setSelectedIndex(index);

        // ✅ trigger fetch ở event handler
        void loadReport(attempt);
    };

    const handlePrev = () => {
        if (pairStart === 0) return;

        const next = pairStart - 2;

        setPairStart(next);

        // Chọn tab đầu của pair mới nếu tồn tại
        if (next < attempts.length) {
            handleSelectAttempt(next);
        }
    };

    const handleNext = () => {
        const next = pairStart + 2;

        if (next >= attempts.length) return;

        setPairStart(next);

        handleSelectAttempt(next);
    };

    // ── Render ──────────────────────────────────────────────────────────────

    if (attemptsLoading) {
        return <ResultSkeleton />;
    }

    if (attemptsError) {
        return (
            <div className="py-12 text-center text-red-500 font-medium">
                {attemptsError}
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="py-20 text-center text-gray-500">
                <p className="font-semibold mb-1">
                    No completed attempts yet.
                </p>

                <p className="text-sm">
                    Complete a practice session to see your
                    results here.
                </p>
            </div>
        );
    }

    const selectedAttempt = attempts[selectedIndex];
    const attemptNumber = selectedIndex + 1;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* ── Attempt tabs ── */}
            <AttemptTabs
                items={attempts}
                selectedIndex={selectedIndex}
                pairStart={pairStart}
                onSelect={handleSelectAttempt}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            {/* ── Loading ── */}
            {reportLoading && <ResultSkeleton />}

            {/* ── Error ── */}
            {reportError && !reportLoading && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-700 text-sm font-medium">
                    {reportError}

                    {selectedAttempt && (
                        <p className="mt-1 text-xs text-amber-600">
                            Session:{' '}
                            {selectedAttempt.practiceSessionId}
                        </p>
                    )}
                </div>
            )}

            {/* ── Kết quả chi tiết ── */}
            {report && !reportLoading && (
                <>
                    {/* Summary Card */}
                    <ResultSummaryCard
                        report={report}
                        attemptNumber={attemptNumber}
                    />

                    {/* Score Adjustments */}
                    <AdjustmentSection
                        positive={
                            report.adjustments?.positive ?? []
                        }
                        negative={
                            report.adjustments?.negative ?? []
                        }
                    />

                    {/* EPA Scores */}
                    <EpaResultSection
                        epaScores={(report.epaScores ?? []).map(
                            (epa, idx) => ({
                                scoreId:
                                    epa.id ??
                                    `${epa.epaId || 'epa'}_${idx}_score`,

                                epaId: epa.epaId,

                                title: getEpaTitle(epa.epaId),

                                numericalScore:
                                    epa.numericalScore,

                                maxScore: epa.maxScore,

                                feedbackDetail:
                                    epa.feedbackDetail ?? '',

                                evidenceCited:
                                    epa.evidenceCited ??
                                    undefined,

                                failurePatterns:
                                    epa.failurePatterns ??
                                    undefined,

                                safetyFlags:
                                    epa.safetyFlags ??
                                    undefined,
                            })
                        )}
                    />
                </>
            )}
        </div>
    );
}