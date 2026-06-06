'use client';

import { useState, useCallback } from 'react';
import { PatientData } from '@/src/types/practice';
import {
    BookmarkIcon,
    ComputerDesktopIcon,
    ChatBubbleLeftRightIcon,
    ChartBarIcon,
    ClockIcon,
} from '@heroicons/react/24/solid';
import { History, AlertTriangle } from 'lucide-react';
import { getLearnerId } from '@/src/utils/cookies';
import { resolvePatientAvatar } from '@/src/utils/patient-assets';
import {
    getAttemptList,
    getSessionDetail,
} from '@/src/services/session-replay-service';
import { AttemptSelectorModal } from '@/src/features/practice/components/sessionReplay/AttemptSelectorModal';
import { SessionReplayDrawer } from '@/src/features/practice/components/sessionReplay/SessionReplayDrawer';
import type {
    AttemptListItem,
    PracticeSessionDetail,
} from '@/src/features/practice/components/sessionReplay/types';

export const CaseOverview = ({ data }: { data: PatientData }) => {
    const items = [
        {
            icon: BookmarkIcon,
            title: 'Chief Concern',
            desc: 'Understand the main reason the patient seeks care and identify key symptoms.',
        },
        {
            icon: ComputerDesktopIcon,
            title: 'Interactive Case',
            desc: 'Engage with a realistic clinical scenario designed to train your diagnostic reasoning.',
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: 'AI Feedback',
            desc: 'Receive instant feedback and insights from the AI system to refine your thought process.',
        },
        {
            icon: ChartBarIcon,
            title: 'Skill Level',
            desc: 'Suitable for medical students and early clinical learners.',
        },
        {
            icon: ClockIcon,
            title: data.time,
            desc: '30 minutes for patient interaction, plus 15 minutes for explanation and reasoning.',
        },
    ];
    const [modalOpen, setModalOpen] = useState(false);
    const [attempts, setAttempts] = useState<readonly AttemptListItem[]>([]);
    const [attemptsLoading, setAttemptsLoading] = useState(false);
    const [attemptsError, setAttemptsError] = useState<string | null>(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedAttempt, setSelectedAttempt] = useState<AttemptListItem | null>(null);
    const [sessionDetail, setSessionDetail] = useState<PracticeSessionDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const patientAvatar = resolvePatientAvatar(
        data.img ?? null,
        data.id,
        data.age,
        data.gender
    );

    const handleOpenModal = useCallback(async () => {
        setModalOpen(true);
        setAttemptsError(null);
        setAttemptsLoading(true);
        try {
            const learnerId = getLearnerId();
            const list = await getAttemptList(learnerId, data.id);
            setAttempts(list);
        } catch (err) {
            setAttemptsError(
                err instanceof Error ? err.message : 'Failed to load attempts.'
            );
        } finally {
            setAttemptsLoading(false);
        }
    }, [data.id]);

    const handleSelectAttempt = useCallback(
        async (attempt: AttemptListItem) => {
            setModalOpen(false);
            setSelectedAttempt(attempt);
            setDetailError(null);
            setDetailLoading(true);
            setDrawerOpen(true);
            try {
                const detail = await getSessionDetail(attempt.sessionId);
                setSessionDetail(detail);
            } catch (err) {
                setDetailError(
                    err instanceof Error ? err.message : 'Failed to load session detail.'
                );
                setSessionDetail(null);
            } finally {
                setDetailLoading(false);
            }
        },
        []
    );

    const handleCloseDrawer = useCallback(() => {
        setDrawerOpen(false);
        setSelectedAttempt(null);
        setSessionDetail(null);
        setDetailError(null);
    }, []);

    return (
        <div className="pl-4 h-full border-l border-gray-200">
            {/* TITLE */}
            <h3 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
                Case Overview
            </h3>

            {/* ITEMS */}
            <div className="space-y-8">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="flex gap-4 items-start">
                            <div className="mt-1 text-[#235697] shrink-0">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-base">{item.title}</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View Previous Attempts Button */}
            <div className="mt-10">
                <button
                    type="button"
                    onClick={() => void handleOpenModal()}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3
                    rounded-lg font-bold text-sm text-white
                    bg-linear-to-l from-[#1BA7D9] to-[#235697]
                    hover:opacity-90 transition-opacity shadow-md
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#235697] focus-visible:ring-offset-2"
                    aria-label="View previous practice attempts"
                >
                    <History className="w-4 h-4 shrink-0" />
                    View Previous Attempts
                </button>
            </div>

            {/* Attempt Selector Modal */}
            {modalOpen && (
                <AttemptSelectorModal
                    attempts={attempts}
                    isLoading={attemptsLoading}
                    error={attemptsError}
                    onSelect={(attempt) => void handleSelectAttempt(attempt)}
                    onClose={() => setModalOpen(false)}
                />
            )}

            {/* Session Replay Modal */}
            {drawerOpen && !detailLoading && !detailError && sessionDetail && selectedAttempt && (
                <SessionReplayDrawer
                    attempt={selectedAttempt}
                    session={sessionDetail}
                    patientAvatarUrl={patientAvatar}
                    patientName={data.name}   
                    onClose={handleCloseDrawer}
                />
            )}

            {/* Loading state */}
            {drawerOpen && detailLoading && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs"
                    onClick={handleCloseDrawer}
                >
                    <div className="bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl border border-gray-100">
                        <div className="w-9 h-9 border-4 border-[#235697] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-semibold text-[#235697]">Loading session…</p>
                    </div>
                </div>
            )}

            {/* Error state  */}
            {drawerOpen && !detailLoading && detailError && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
                    onClick={handleCloseDrawer}
                >
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl mx-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className="text-gray-700 font-medium mb-4 text-sm">{detailError}</p>
                        <button
                            type="button"
                            onClick={handleCloseDrawer}
                            className="w-full py-2.5 rounded-lg bg-[#235697] text-white text-sm font-bold hover:opacity-95 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};