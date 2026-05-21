'use client';

import { useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onCancel?: () => void;
    onClose?: () => void; 
    onConfirm: (diagnosis?: string) => void;
    isLoading?: boolean;
    requireDiagnosis?: boolean;
}

export const ConfirmModal = ({
    isOpen,
    onCancel,
    onClose,
    onConfirm,
    isLoading = false,
    requireDiagnosis = true,
}: ConfirmModalProps) => {
    const [diagnosis, setDiagnosis] = useState<string>('');

    if (!isOpen) return null;

    const handleClose = () => {
        onCancel?.();
        onClose?.();
    };

    const handleConfirm = () => {
        if (requireDiagnosis && !diagnosis.trim()) return;
        if (isLoading) return;
        onConfirm(requireDiagnosis ? diagnosis.trim() : undefined);
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-125 shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-3xl font-bold text-[#0E2A46] text-center mb-4 font-sans">Confirm</h2>
                <p className="text-xl text-gray-600 text-center mb-10 leading-relaxed font-sans">
                    Are you sure you want to end this conversation?
                </p>

                {requireDiagnosis && (
                    <input
                        type="text"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleConfirm();
                        }}
                        placeholder="Enter your diagnosis..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#235697] mb-6 font-sans"
                        autoFocus
                    />
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-10 py-3 rounded-2xl bg-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-400 transition-colors disabled:opacity-50 font-sans"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={(requireDiagnosis && !diagnosis.trim()) || isLoading}
                        className="px-10 py-3 rounded-2xl bg-[#235697] text-white font-bold text-lg hover:bg-[#1a4175] transition-colors disabled:opacity-50 font-sans"
                    >
                        {isLoading ? 'Saving...' : 'Proceed'}
                    </button>
                </div>
            </div>
        </div>
    );
};