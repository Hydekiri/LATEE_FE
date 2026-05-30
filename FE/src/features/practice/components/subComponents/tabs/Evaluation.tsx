'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
    PlayIcon,
    DocumentTextIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { evaluationService } from '@/src/services/evaluation-service';
import {
    EvaluationTabData,
    PracticeHistoryItem,
} from '@/src/types/evaluation';
import { getLearnerId } from '@/src/utils/cookies';
import { usePathname } from 'next/navigation';
import { patientService } from '@/src/services/patient-servvice';

export const metadata = {
    title: "Evaluation - Lavender Teeducation",
    description: "Enhance your diagnostic skills with virtual patients.",
};

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
 * Lọc & sắp xếp các attempt hợp lệ theo thứ tự thời gian tăng dần (cũ → mới).
 * Attempt hợp lệ: status === 'Completed' VÀ có evaluationId.
 * Không slice theo maxAttempts — tabs cần biết tổng số attempt thực tế.
 */
function buildOrderedAttempts(
    items: readonly PracticeHistoryItem[]
): PracticeHistoryItem[] {
    return [...items]
        .filter(
            (item) =>
                item.status === 'Completed' &&
                item.evaluationId != null
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
    readonly attempts: readonly PracticeHistoryItem[];
    readonly maxAttempts: number;
    readonly selectedIndex: number;
    readonly pairStart: number;
    readonly onSelect: (index: number) => void;
    readonly onPrev: () => void;
    readonly onNext: () => void;
}

/**
 * Tabs hiển thị tối đa 2 slot mỗi lần:
 * - Slot đã có attempt → clickable, hiển thị "Nth attempt feedback"
 * - Slot chưa có attempt nhưng còn trong maxAttempts → "Practice More"
 * - Điều hướng Prev/Next theo từng cặp
 */
function AttemptTabs({
    attempts,
    maxAttempts,
    selectedIndex,
    pairStart,
    onSelect,
    onPrev,
    onNext,
}: AttemptTabsProps) {
    // Render 2 slot trong pair
    const slotIndices = [pairStart, pairStart + 1].filter(
        (idx) => idx < maxAttempts
    );

    const canPrev = pairStart > 0;
    const canNext = pairStart + 2 < maxAttempts;

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
                        const hasAttempt =
                            slotIdx < attempts.length;

                        const isActive =
                            slotIdx === selectedIndex;

                        const suffix =
                            ordinalSuffix(attemptNumber);

                        return (
                            <div
                                key={slotIdx}
                                className="flex-1 relative"
                            >
                                {hasAttempt ? (
                                    <button
                                        onClick={() =>
                                            onSelect(slotIdx)
                                        }
                                        className={`pb-4 w-full text-base font-bold transition-colors relative text-center whitespace-nowrap ${
                                            isActive
                                                ? 'text-[#235697]'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        {attemptNumber}
                                        {suffix} attempt feedback

                                        <span
                                            className={`absolute -bottom-px left-0 w-full h-1 rounded-full transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-[#235697] z-20'
                                                    : 'bg-gray-300'
                                            }`}
                                        />
                                    </button>
                                ) : (
                                    <div className="pb-4 w-full text-base font-bold text-gray-300 relative text-center whitespace-nowrap">
                                        Practice More
                                        <span className="inline-block ml-1">
                                            →
                                        </span>

                                        <span className="absolute -bottom-px left-0 w-full h-1 rounded-full bg-gray-200" />
                                    </div>
                                )}
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

function EvaluationSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-pulse">
            <div className="h-12 bg-gray-100 rounded-xl w-full" />

            <div className="grid grid-cols-10 gap-8">
                <div className="col-span-3 h-48 bg-gray-100 rounded-2xl" />

                <div className="col-span-7 flex flex-col gap-3 justify-center">
                    {[1, 2, 3].map((i) => (
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

interface EvaluationProps {
    readonly sessionId: string;
}

export default function Evaluation({
    sessionId,
}: EvaluationProps) {
    const pathname = usePathname();
    const learnerId = getLearnerId();

    const patientId = useMemo(() => {
        const segments = pathname.split('/');
        const practiceIdx =
            segments.indexOf('practice');

        return practiceIdx !== -1
            ? (segments[practiceIdx + 1] ?? '')
            : '';
    }, [pathname]);

    // maxAttempts: tổng số slot tab cho phép
    const [maxAttempts, setMaxAttempts] =
        useState<number>(3);

    // attempts: danh sách attempt hợp lệ đã sort chronological
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

    const [evalData, setEvalData] =
        useState<EvaluationTabData | null>(null);

    const [feedbackLoading, setFeedbackLoading] =
        useState<boolean>(false);

    const [generating, setGenerating] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string | null>(null);

    // Tránh re-fetch feedback cho cùng practiceSessionId
    const prevSessionIdRef = useRef<string | null>(
        null
    );

    // ── Load feedback từ report khi đổi tab ──────────────────────────────
    // - feedbackId == null  → hiện empty state ngay, không fetch
    // - feedbackId != null  → GET report → đọc practiceFeedback

    const loadFeedbackForAttempt = useCallback(
        async (attempt: PracticeHistoryItem) => {
            const key = attempt.practiceSessionId;

            if (prevSessionIdRef.current === key) return;
            prevSessionIdRef.current = key;

            setEvalData(null);
            setError(null);

            // Không có feedbackId → chưa từng generate → hiện empty state
            if (!attempt.feedbackId || !attempt.evaluationId) {
                return;
            }

            setFeedbackLoading(true);

            try {
                const feedback =
                    await evaluationService.getFeedbackFromReport(
                        attempt.evaluationId
                    );

                if (feedback) {
                    setEvalData({
                        overallAttempt: feedback.overallAttempt ?? '',
                        overallLabel: feedback.overallLabel ?? 'Solid reasoning',
                        strength:
                            feedback.strength ??
                            (feedback.strengths ? feedback.strengths.join('\n') : ''),
                        improvements:
                            feedback.improvement ??
                            (feedback.improvements ? feedback.improvements.join('\n') : ''),
                        epaScores: [],
                    });
                }
                // feedback null (edge case) → vẫn hiện empty state
            } catch {
                setEvalData(null);
            } finally {
                setFeedbackLoading(false);
            }
        },
        []
    );

    // ── Load attempt list ─────────────────────────────────────────────────

    useEffect(() => {
        if (!patientId || !learnerId) return;

        let cancelled = false;

        const loadHistory = async () => {
            setAttemptsLoading(true);
            setAttemptsError(null);

            try {
                // 1. Lấy maxAttempts
                let resolvedMaxAttempts = 3;

                try {
                    const attemptData =
                        await patientService.getAttemptCount(
                            learnerId,
                            patientId
                        );

                    resolvedMaxAttempts =
                        attemptData.maxAttempts ?? 3;
                } catch (e) {
                    console.warn(
                        'Failed to fetch attempt-count, defaulting to 3',
                        e
                    );
                }

                if (cancelled) return;

                setMaxAttempts(
                    resolvedMaxAttempts
                );

                // 2. Lấy practice history
                const result =
                    await evaluationService.getPracticeHistory(
                        learnerId,
                        patientId
                    );

                if (cancelled) return;

                // 3. Build chronological attempts
                const ordered =
                    buildOrderedAttempts(
                        result.items ?? []
                    );

                setAttempts(ordered);

                if (ordered.length > 0) {
                    // Ưu tiên attempt khớp sessionId
                    const matchIdx = sessionId
                        ? ordered.findIndex(
                              (item) =>
                                  item.practiceSessionId ===
                                  sessionId
                          )
                        : -1;

                    const targetIdx =
                        matchIdx !== -1
                            ? matchIdx
                            : ordered.length - 1;

                    const targetAttempt =
                        ordered[targetIdx];

                    setSelectedIndex(targetIdx);

                    setPairStart(
                        Math.floor(targetIdx / 2) * 2
                    );

                    // Load feedback cho attempt được chọn khi khởi tạo
                    void loadFeedbackForAttempt(targetAttempt);
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

        void loadHistory();

        return () => {
            cancelled = true;
        };
    }, [
        patientId,
        learnerId,
        sessionId,
        loadFeedbackForAttempt,
    ]);

    // ── Generate feedback on demand ──────────────────────────────────────

    const handleGetFeedback = async () => {
        const current = attempts[selectedIndex];
        const activeSessionId = current?.practiceSessionId ?? sessionId;

        if (!activeSessionId) {
            setError('No valid practice session found to generate feedback.');
            return;
        }

        // Giữ nguyên evalData cũ (nếu có) trong khi gọi — không clear
        setGenerating(true);
        setError(null);
        prevSessionIdRef.current = null;

        try {
            // POST: backend tự quyết generate mới hay trả cached
            const generated =
                await evaluationService.generatePracticeFeedback(activeSessionId);

            if (generated) {
                prevSessionIdRef.current = activeSessionId;
                setEvalData({
                    overallAttempt:
                        generated.overallAttempt ?? generated.feedbackDetail ?? '',
                    overallLabel: generated.overallLabel ?? 'Solid reasoning',
                    strength:
                        generated.strength ??
                        (generated.strengths ? generated.strengths.join('\n') : ''),
                    improvements:
                        generated.improvement ??
                        (generated.improvements
                            ? generated.improvements.join('\n')
                            : ''),
                    epaScores: [],
                });
            } else {
                throw new Error("Feedback couldn't be retrieved.");
            }
        } catch (err) {
            console.error('[GetFeedback] Error:', err);
            setError('Failed to generate feedback. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    // ── Tab navigation ───────────────────────────────────────────────────

    const handleSelectAttempt = (
        index: number
    ) => {
        if (
            index < 0 ||
            index >= attempts.length
        ) {
            return;
        }

        const attempt = attempts[index];

        if (!attempt) return;

        // Đổi tab → load feedback. feedbackId null → empty state, có → fetch report
        prevSessionIdRef.current = null;
        setSelectedIndex(index);
        void loadFeedbackForAttempt(attempt);
    };

    const handlePrev = () => {
        if (pairStart === 0) return;

        const next = pairStart - 2;

        setPairStart(next);

        // Chọn tab đầu của pair mới nếu có attempt
        if (next < attempts.length) {
            handleSelectAttempt(next);
        }
    };

    const handleNext = () => {
        const next = pairStart + 2;

        if (next >= maxAttempts) return;

        setPairStart(next);

        // Chọn tab đầu của pair mới nếu có attempt
        if (next < attempts.length) {
            handleSelectAttempt(next);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────

    if (attemptsLoading) {
        return <EvaluationSkeleton />;
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
                    Complete a practice session
                    to see your evaluation
                    feedback here.
                </p>
            </div>
        );
    }

    const currentAttempt =
        attempts[selectedIndex];

    const attemptNumber =
        selectedIndex + 1;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* ── Attempt tabs ── */}
            <AttemptTabs
                attempts={attempts}
                maxAttempts={maxAttempts}
                selectedIndex={selectedIndex}
                pairStart={pairStart}
                onSelect={handleSelectAttempt}
                onPrev={handlePrev}
                onNext={handleNext}
            />

            {/* ── Loading ── */}
            {feedbackLoading && (
                <EvaluationSkeleton />
            )}

            {/* ── Error ── */}
            {error && !feedbackLoading && (
                <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-xl p-12 text-center text-red-600 font-bold">
                    {error}
                </div>
            )}

            {/* ── Content ── */}
            {currentAttempt &&
                !feedbackLoading && (
                    <>
                        {/* Summary card */}
                        <div className="grid grid-cols-10 gap-8 bg-white rounded-xl">
                            <div className="col-span-3 relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-[#A7E6FF] min-h-45">
                                <Image
                                    src="/images/Robot2.png"
                                    alt="AI Assistant Result"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="col-span-7 flex flex-col justify-center">
                                <h3 className="text-[#235697] font-bold text-2xl mb-2">
                                    Attempt #
                                    {
                                        attemptNumber
                                    }{' '}
                                    — Case
                                    Feedback
                                </h3>

                                <ul className="space-y-1 text-md">
                                    {currentAttempt.score !=
                                        null && (
                                        <li>
                                            <span className="font-bold text-[#235697]">
                                                Final
                                                Score:
                                            </span>

                                            <span className="text-[#0E2A46] ml-1">
                                                {currentAttempt.score.toFixed(
                                                    1
                                                )}
                                                /100
                                            </span>
                                        </li>
                                    )}

                                    <li>
                                        <span className="font-bold text-[#235697]">
                                            Your
                                            Diagnosis:
                                        </span>

                                        <span className="text-[#0E2A46] ml-1">
                                            {currentAttempt.finalDiagnosis ||
                                                'N/A'}
                                        </span>
                                    </li>

                                    {currentAttempt.duration !=
                                        null && (
                                        <li>
                                            <span className="font-bold text-[#235697]">
                                                Duration:
                                            </span>

                                            <span className="text-[#0E2A46] ml-1">
                                                {formatDuration(
                                                    currentAttempt.duration
                                                )}
                                            </span>
                                        </li>
                                    )}

                                    {currentAttempt.entrustmentLevel !=
                                        null && (
                                        <li>
                                            <span className="font-bold text-[#235697]">
                                                Entrustment
                                                Level:
                                            </span>

                                            <span className="text-[#0E2A46] ml-1">
                                                {
                                                    currentAttempt.entrustmentLevel
                                                }
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Feedback section */}
                        <div className="flex flex-col gap-5 mt-2">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-[#235697]" />

                                    <h3 className="text-[#235697] text-2xl font-bold tracking-tight">
                                        Evaluation
                                        Feedback
                                    </h3>
                                </div>

                                <button
                                    onClick={() =>
                                        void handleGetFeedback()
                                    }
                                    disabled={
                                        generating ||
                                        feedbackLoading
                                    }
                                    className="flex items-center gap-4 bg-[#1BA7D9] hover:bg-[#158ebc] text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm disabled:opacity-50"
                                >
                                    {generating
                                        ? evalData
                                            ? 'Regenerating...'
                                            : 'Generating...'
                                        : 'Get feedback'}

                                    <PaperAirplaneIcon className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Empty state */}
                            {!evalData &&
                                !generating &&
                                !error && (
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
                                        Click
                                        &ldquo;Get
                                        feedback&rdquo;
                                        to analyze
                                        your session
                                        conversation
                                        logs.
                                    </div>
                                )}

                            {/* Loading */}
                            {generating && (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-[#235697] border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Feedback */}
                            {evalData &&
                                !generating && (
                                    <div className="flex flex-col gap-6 animate-[fadeIn_0.2s_ease-out]">
                                        <div className="bg-[#F99A00]/10 rounded-xl p-6 border border-amber-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-[#333333] text-2xl font-bold">
                                                    Overall
                                                    Attempt
                                                </h4>

                                                <span className="bg-[#F99A00] text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm">
                                                    {evalData.overallLabel ||
                                                        'Solid reasoning'}
                                                </span>
                                            </div>

                                            <p className="text-[#0E2A46] leading-relaxed text-[15px]">
                                                {
                                                    evalData.overallAttempt
                                                }
                                            </p>
                                        </div>

                                        {evalData.strength && (
                                            <div className="bg-[#00BC10]/10 rounded-xl p-6 border border-emerald-100">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-[#299723] text-2xl font-bold">
                                                        Clinical
                                                        Strengths
                                                    </h4>

                                                    <span className="bg-[#00BC10] text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm">
                                                        Very
                                                        good
                                                    </span>
                                                </div>

                                                <p className="text-[#0E2A46] leading-relaxed text-[15px] whitespace-pre-line">
                                                    {
                                                        evalData.strength
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {evalData.improvements && (
                                            <div className="bg-[#D90000]/10 rounded-xl p-6 border border-red-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-[#B42424] text-2xl font-bold">
                                                        Areas
                                                        for
                                                        Improvement
                                                    </h4>

                                                    <span className="bg-[#D90000] text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm">
                                                        Needs
                                                        improvement
                                                    </span>
                                                </div>

                                                <p className="text-[#0E2A46] leading-relaxed text-[15px] whitespace-pre-line">
                                                    {
                                                        evalData.improvements
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                    </>
                )}
        </div>
    );
}