"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ClinicalCaseStatus } from "@/src/types/clinical-case";
import type { CreateClinicalCaseRequest } from "@/src/types/clinical-case";

interface CreateCaseModalProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateClinicalCaseRequest) => void;
}

const INITIAL_FORM: CreateClinicalCaseRequest = {
    title: "",
    description: "",
    type: "",
    status: ClinicalCaseStatus.Draft,
    pe: "",
    symptom: "",
    medicalhistory: "",
    eccid: "",
};

const LABEL = "text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider block mb-1";
const INPUT =
    "w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2 px-3 text-xs text-[#173B67] outline-none focus:border-[#1BA7D9] focus:bg-white transition-all";

export function CreateCaseModal({ open, loading, onClose, onSubmit }: CreateCaseModalProps) {
    const [form, setForm] = useState<CreateClinicalCaseRequest>(INITIAL_FORM);

    if (!open) return null;

    const set = (key: keyof CreateClinicalCaseRequest, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = () => {
        if (!form.title.trim() || !form.type.trim()) return;
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE7F0] w-full max-w-2xl mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE7F0]">
                    <div>
                        <h2 className="text-base font-bold text-[#173B67]">Create Clinical Case</h2>
                        <p className="text-xs text-[#7F96AD] mt-0.5">Define a new clinical scenario for expert review</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-[#EDF6FB] rounded-lg text-[#7F96AD] transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={LABEL}>Case Title *</label>
                            <input
                                className={INPUT}
                                placeholder="e.g. Acute Appendicitis Presentation"
                                value={form.title}
                                onChange={(e) => set("title", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={LABEL}>Case Type *</label>
                            <input
                                className={INPUT}
                                placeholder="e.g. APPENDICITIS"
                                value={form.type}
                                onChange={(e) => set("type", e.target.value.toUpperCase())}
                            />
                        </div>
                        <div>
                            <label className={LABEL}>Evaluation Criteria ID (eccid)</label>
                            <input
                                className={INPUT}
                                placeholder="e.g. CRIT-001"
                                value={form.eccid}
                                onChange={(e) => set("eccid", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={LABEL}>Description</label>
                            <textarea
                                className={INPUT}
                                rows={2}
                                placeholder="Brief description of the clinical case..."
                                value={form.description}
                                onChange={(e) => set("description", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={LABEL}>Symptoms</label>
                            <textarea
                                className={INPUT}
                                rows={2}
                                placeholder="Patient presents with..."
                                value={form.symptom}
                                onChange={(e) => set("symptom", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={LABEL}>Medical History</label>
                            <textarea
                                className={INPUT}
                                rows={2}
                                placeholder="Past Medical History: ..."
                                value={form.medicalhistory}
                                onChange={(e) => set("medicalhistory", e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={LABEL}>Physical Exam (PE)</label>
                            <textarea
                                className={INPUT}
                                rows={3}
                                placeholder="Admission Vitals: Temp: 98 HR: 112 Resp: 16..."
                                value={form.pe}
                                onChange={(e) => set("pe", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#DDE7F0] bg-[#F7FAFC]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[#DDE7F0] rounded-[10px] text-xs font-semibold text-[#4F6F94] hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.title.trim() || !form.type.trim()}
                        className="flex items-center gap-1.5 bg-[#1BA7D9] hover:bg-[#1487AE] disabled:opacity-50 text-white px-4 py-2 rounded-[10px] text-xs font-bold shadow-sm transition-all"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Create Case
                    </button>
                </div>
            </div>
        </div>
    );
}