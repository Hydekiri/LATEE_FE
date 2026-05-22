'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    buildSessionSubmitPayload,
    submitPracticeSession,
    getPracticeSessionById,
    submitEvaluation,
    EvaluationSubmitPayload,
} from '@/src/hooks/submition-practice-session';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import {
    ClinicalReasoningChatMessageTable,
    ClinicalReasoningDimensionTable,
} from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { AIAssistantChatMessageTable } from '@/src/hooks/dexieConfigurations/AIAssistantChatMessages.table';
import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { practiceSessionStore } from '@/src/stores/practiceSessionStore';
import { getCookie } from '@/src/utils/cookies';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    sessionId: string;
    vpDuration?: number;
    timerStop?: () => number;
}

type SubmitPhase =
    | 'idle'
    | 'submitting_session'
    | 'fetching_session_details'
    | 'submitting_evaluation'
    | 'clearing_cache'
    | 'done'
    | 'error';

/**
 * Xóa toàn bộ dữ liệu IndexedDB liên quan đến session.
 * Dùng clearBySession để đúng scope — tránh xóa nhầm session khác.
 * Dùng Promise.allSettled để đảm bảo mọi table đều được clear
 * kể cả khi một trong số chúng bị lỗi.
 */
async function clearSessionCache(sessionId: string): Promise<void> {
    const results = await Promise.allSettled([
        VPChatMessageTable.clearBySession(sessionId),
        ClinicalReasoningChatMessageTable.clearBySession(sessionId),
        ClinicalReasoningDimensionTable.clearBySession(sessionId),
        ValidationNoteTable.clearBySession(sessionId),
        AIAssistantChatMessageTable.clearBySession(sessionId),
    ]);

    // Log lỗi nếu có table nào fail — không throw để tránh block navigation
    results.forEach((result, idx) => {
        if (result.status === 'rejected') {
            console.warn(`[clearSessionCache] Table ${idx} failed to clear:`, result.reason);
        }
    });
}

export const SubmitModal = ({
    isOpen,
    onClose,
    patientId,
    sessionId,
    vpDuration = 0,
    timerStop,
}: SubmitModalProps) => {
    const router = useRouter();
    const [diagnosis, setDiagnosis] = useState<string>('');
    const [moduleId, setModuleId] = useState<string>('EPA_STANDARD_V1');
    const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!isOpen) return null;

    const isSubmitting =
        submitPhase === 'submitting_session' ||
        submitPhase === 'fetching_session_details' ||
        submitPhase === 'submitting_evaluation' ||
        submitPhase === 'clearing_cache';

    const submitLabel = (() => {
        if (submitPhase === 'submitting_session') return 'Submitting session...';
        if (submitPhase === 'fetching_session_details') return 'Syncing data...';
        if (submitPhase === 'submitting_evaluation') return 'Evaluating clinical reasoning...';
        if (submitPhase === 'clearing_cache') return 'Finalizing...';
        return 'Confirm Submit';
    })();

    const handleConfirm = async () => {
        if (!diagnosis.trim()) {
            alert('Please enter your final diagnosis.');
            return;
        }
        if (isSubmitting) return;

        setSubmitError(null);
        const learnerId = getCookie('userId') ?? 'USR001';
        const reasoningDuration = timerStop ? timerStop() : 0;
        const totalDuration = Math.round((vpDuration + reasoningDuration) / 60);

        let evaluationId: string | null = null;

        try {
            // ── Step 1: Submit practice session ────────────────────────────
            setSubmitPhase('submitting_session');
            const sessionPayload = await buildSessionSubmitPayload({
                sessionId,
                learnerId,
                diagnosis: diagnosis.trim(),
                moduleId,
            });
            await submitPracticeSession(sessionPayload);

            // ── Step 2: Fetch official session details ──────────────────────
            setSubmitPhase('fetching_session_details');
            const officialSessionDetails = await getPracticeSessionById(sessionId);

            // ── Step 3: Submit evaluation ───────────────────────────────────
            setSubmitPhase('submitting_evaluation');
            const evaluationPayload: EvaluationSubmitPayload = {
                practiceSessionId: officialSessionDetails.sessionId,
                learnerId: officialSessionDetails.learnerId,
                epaId: officialSessionDetails.moduleId,
                finalDiagnosis: officialSessionDetails.finalDiagnosis,
                vpConversationLog: officialSessionDetails.vpConversationLog,
                aiReasoningLog: officialSessionDetails.aiReasoningLog,
                moduleId: officialSessionDetails.moduleId,
                discussionType: officialSessionDetails.discussionType,
                duration: totalDuration,
                warnings: officialSessionDetails.warnings,
            };

            const evalResult = await submitEvaluation(evaluationPayload);
            evaluationId = evalResult.data.evaluationId;

            // Cập nhật store với evaluationId
            const stored = practiceSessionStore.load();
            if (stored) {
                practiceSessionStore.save({
                    ...stored,
                    phase: 'evaluated',
                    evaluationId,
                    reasoningEndedAt: Date.now(),
                });
            }

            // ── Step 4: Clear IndexedDB cache của session này ───────────────
            // Luôn clear ngay sau khi evaluation thành công,
            // dùng allSettled nên sẽ không throw kể cả khi một table lỗi.
            setSubmitPhase('clearing_cache');
            await clearSessionCache(sessionId);

            setSubmitPhase('done');
            onClose();
            router.push(`/practice/${patientId}?tab=results&resultId=${evaluationId}`);
        } catch (err) {
            console.error('[Submit Workflow Error]:', err);

            // Nếu evaluation đã xong nhưng clear cache lỗi → vẫn navigate được,
            // clearSessionCache dùng allSettled nên không bao giờ throw.
            // Chỉ vào đây khi step 1-3 thực sự lỗi.

            // Dù lỗi ở step nào, vẫn cố clear cache để tránh dirty data lần sau.
            // Fire-and-forget — không await để không block error UI.
            void clearSessionCache(sessionId);

            setSubmitPhase('error');
            setSubmitError(
                err instanceof Error
                    ? err.message
                    : 'An error occurred during submission. Please try again.'
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-8 w-130 shadow-2xl animate-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-[#0E2A46] text-center mb-8">
                    Submit Practice
                </h2>

                <div className="mb-6">
                    <label className="block text-[#2A5DA8] text-sm font-bold uppercase mb-2">
                        Final diagnosis
                    </label>
                    <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="What is your final diagnosis?"
                        rows={3}
                        disabled={isSubmitting}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A5DA8] resize-none disabled:opacity-50"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-[#2A5DA8] text-sm font-bold uppercase mb-2">
                        Evaluation Module
                    </label>
                    <select
                        value={moduleId}
                        onChange={(e) => setModuleId(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-[#2A5DA8] disabled:opacity-50"
                    >
                        <option value="EPA_STANDARD_V1">EPA Standard 1.0</option>
                        <option value="Modul SMART3220">Modul SMART3220</option>
                    </select>
                </div>

                {submitPhase === 'error' && submitError && (
                    <p className="text-red-500 text-sm mb-4 text-center">{submitError}</p>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => void handleConfirm()}
                        disabled={isSubmitting || !diagnosis.trim()}
                        className="flex-2 px-6 py-3 rounded-2xl bg-[#235697] text-white font-bold hover:bg-[#1a4175] transition flex justify-center items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {submitLabel}
                            </>
                        ) : (
                            submitLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};