// src/features/practice/takePractice/components/ConfirmModal.tsx
'use client';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm }: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl animate-in fade-in zoom-in duration-200">
                <h2 className="text-3xl font-bold text-[#0E2A46] text-center mb-4">Confirm</h2>
                <p className="text-xl text-gray-600 text-center mb-10 leading-relaxed">
                    Are you sure you want to end this conversation?
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="px-10 py-3 rounded-2xl bg-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-10 py-3 rounded-2xl bg-[#235697] text-white font-bold text-lg hover:bg-[#1a4175] transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};