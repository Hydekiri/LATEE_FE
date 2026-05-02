import { ReactNode } from 'react';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function ActionModal({ isOpen, onClose, children }: ActionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
                {children}
            </div>
        </div>
    );
}