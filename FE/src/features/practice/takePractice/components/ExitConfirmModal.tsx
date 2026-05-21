'use client';

import { useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ExitConfirmModalProps {
    readonly isOpen: boolean;
    readonly isProcessing: boolean;
    readonly onConfirm: () => Promise<void>;
    readonly onCancel: () => void;
}

export function ExitConfirmModal({
    isOpen,
    isProcessing,
    onConfirm,
    onCancel,
}: ExitConfirmModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isProcessing) onCancel();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, isProcessing, onCancel]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirmClick = () => {
        void onConfirm();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isProcessing ? onCancel : undefined}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="exit-modal-title"
            >
                {/* Header */}
                <div className="flex items-start gap-4 px-6 pt-6 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <h2
                            id="exit-modal-title"
                            className="text-gray-900 text-lg font-bold leading-snug"
                        >
                            Stop Practice Session?
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                            Are you sure you want to stop this clinical practice session?
                            Your current progress will be saved as abandoned.
                        </p>
                    </div>
                    {!isProcessing && (
                        <button
                            onClick={onCancel}
                            className="shrink-0 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    )}
                </div>

                {/* Warning */}
                <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-amber-700 text-xs font-semibold leading-relaxed">
                        Leaving mid-session will mark this attempt as{' '}
                        <span className="font-bold">Abandoned</span>. This still counts
                        toward your maximum attempts.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl
                        font-semibold text-sm hover:bg-gray-50 transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Stay in Session
                    </button>
                    <button
                        onClick={handleConfirmClick}
                        disabled={isProcessing}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm
                        hover:bg-red-700 transition-all disabled:opacity-60
                        disabled:cursor-not-allowed flex items-center justify-center
                        gap-2 shadow-md"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Stopping...
                            </>
                        ) : (
                            'Stop & Exit'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}