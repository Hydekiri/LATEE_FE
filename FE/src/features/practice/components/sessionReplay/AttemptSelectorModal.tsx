'use client';

import { X, Clock, ChevronRight } from 'lucide-react';
import type { AttemptListItem } from './types';

interface AttemptSelectorModalProps {
    readonly attempts: readonly AttemptListItem[];
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly onSelect: (attempt: AttemptListItem) => void;
    readonly onClose: () => void;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AttemptSelectorModal({
    attempts,
    isLoading,
    error,
    onSelect,
    onClose,
}: AttemptSelectorModalProps) {
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Select a previous attempt"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-[#235697]">
                        Previous Attempts
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto max-h-96 divide-y divide-gray-100">
                    {isLoading && (
                        <div className="py-12 text-center text-gray-400 text-sm animate-pulse">
                            Loading attempts…
                        </div>
                    )}
                    {!isLoading && error && (
                        <div className="py-8 text-center text-red-500 text-sm px-4">
                            {error}
                        </div>
                    )}
                    {!isLoading && !error && attempts.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No previous attempts found.
                        </div>
                    )}
                    {!isLoading && !error && attempts.map((attempt) => (
                        <button
                            key={attempt.sessionId}
                            type="button"
                            onClick={() => onSelect(attempt)}
                            className="w-full px-6 py-4 flex items-center justify-between gap-4
                hover:bg-[#235697]/5 transition-colors text-left group"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[#235697] text-sm">
                                    Attempt #{attempt.attemptNumber}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(attempt.createdAt)}
                                </span>
                                {attempt.finalDiagnosis && (
                                    <span className="text-xs text-gray-500 italic mt-0.5">
                                        Dx: {attempt.finalDiagnosis}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={[
                                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                                        attempt.status === 'Completed'
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-amber-100 text-amber-600',
                                    ].join(' ')}
                                >
                                    {attempt.status}
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#235697] transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}