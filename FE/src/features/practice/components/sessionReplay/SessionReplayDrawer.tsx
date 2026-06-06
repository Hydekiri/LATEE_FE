'use client';

import { useEffect, useRef } from 'react';
import {
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    CpuChipIcon,
    ClipboardDocumentCheckIcon,
    XMarkIcon
} from '@heroicons/react/24/solid';
import type { PracticeSessionDetail, AttemptListItem } from './types';
import { ConversationReplay } from './ConversationReplay';
import { ReasoningReplay } from './ReasoningReplay';
import { WarningsReplay } from './WarningsReplay';
import { FinalSubmissionReplay } from './FinalSubmissionReplay';

interface SessionReplayDrawerProps {
    readonly attempt: AttemptListItem;
    readonly session: PracticeSessionDetail;
    readonly patientAvatarUrl: string;
    readonly patientName?: string;
    readonly onClose: () => void;
}

interface SectionProps {
    readonly icon: React.ComponentType<React.ComponentProps<'svg'>>;
    readonly title: string;
    readonly colorClass: string;
    readonly children: React.ReactNode;
}

function Section({ icon: Icon, title, colorClass, children }: SectionProps) {
    return (
        <section className="flex flex-col gap-3">
            <div className={`flex items-center gap-2 pb-2 border-b border-gray-100 ${colorClass}`}>
                <Icon className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base">{title}</h3>
            </div>
            {children}
        </section>
    );
}

export function SessionReplayDrawer({
    attempt,
    session,
    patientAvatarUrl,
    patientName,
    onClose,
}: SessionReplayDrawerProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        const prevPosition = document.body.style.position;
        
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.position = prevPosition;
        };
    }, []);

    const messages = session.vpConversationLog?.messages ?? [];
    const steps    = session.aiReasoningLog?.steps ?? [];
    const warnings = session.warnings ?? [];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-hidden="false"
        >
            {/* Modal Container */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={`Session Replay — Attempt #${attempt.attemptNumber}`}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col mt-24 mb-12 max-h-[calc(100vh-140px)] scale-100 transition-transform duration-200 ease-out overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div>
                        <h2 className="font-bold text-[#235697] text-lg">
                            Session Replay
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Attempt #{attempt.attemptNumber} ·{' '}
                            {new Date(attempt.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-gray-200"
                        aria-label="Close session replay"
                    >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Scrollable content ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-8 scroll-smooth min-h-0">
                    <Section
                        icon={ChatBubbleLeftRightIcon}
                        title="Virtual Patient Conversation"
                        colorClass="text-[#1BA7D9]"
                    >
                        <ConversationReplay
                            messages={messages}
                            patientAvatarUrl={patientAvatarUrl}
                            patientName={patientName}
                        />
                    </Section>

                    {warnings.length > 0 && (
                        <Section
                            icon={ExclamationTriangleIcon}
                            title="Warnings"
                            colorClass="text-red-500"
                        >
                            <WarningsReplay warnings={warnings} />
                        </Section>
                    )}

                    <Section
                        icon={CpuChipIcon}
                        title="Clinical Reasoning"
                        colorClass="text-[#235697]"
                    >
                        <ReasoningReplay steps={steps} />
                    </Section>

                    <Section
                        icon={ClipboardDocumentCheckIcon}
                        title="Final Submission"
                        colorClass="text-green-600"
                    >
                        <FinalSubmissionReplay session={session} />
                    </Section>
                </div>
            </div>
        </div>
    );
}