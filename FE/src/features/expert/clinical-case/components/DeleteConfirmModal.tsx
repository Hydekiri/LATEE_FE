"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
    open: boolean;
    caseId: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmModal({
    open,
    caseId,
    loading,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE7F0] w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-rose-50 rounded-2xl">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-[#173B67]">Delete Clinical Case</h3>
                        <p className="text-sm text-[#7F96AD] mt-1">
                            This will permanently delete case{" "}
                            <span className="font-mono font-bold text-[#235697]">#{caseId}</span>.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-6 pb-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-[#DDE7F0] rounded-[10px] text-sm font-semibold text-[#4F6F94] hover:bg-[#F7FAFC] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white px-4 py-2 rounded-[10px] text-sm font-bold transition-all"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}