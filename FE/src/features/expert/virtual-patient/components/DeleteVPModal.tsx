"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteVPModalProps {
    readonly isOpen:     boolean;
    readonly isLoading:  boolean;
    readonly patientId:  string;
    readonly patientName: string;
    readonly onConfirm:  () => void;
    readonly onClose:    () => void;
}

export function DeleteVPModal({
    isOpen, isLoading, patientId, patientName, onConfirm, onClose,
}: DeleteVPModalProps) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => { if (!isLoading) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-base">Delete Virtual Patient</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-bold text-slate-700">{patientName}</span>{" "}
                            <span className="font-mono text-xs text-slate-400">({patientId})</span>?
                            This action cannot be undone and will remove all associated simulation data.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? "Deleting..." : "Delete Patient"}
                    </button>
                </div>
            </div>
        </div>
    );
}