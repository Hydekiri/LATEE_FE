"use client";

import React, { useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import type { CreateVPFormState } from "@/src/types/virtual-patient-expert";
import { VPStatus, VPLevel, VPGender, DEFAULT_VP_FORM } from "@/src/types/virtual-patient-expert";

interface CreateVPModalProps {
    readonly isOpen:    boolean;
    readonly isLoading: boolean;
    readonly error:     string | null;
    readonly onSubmit:  (form: CreateVPFormState) => Promise<void>;
    readonly onClose:   () => void;
}

export function CreateVPModal({ isOpen, isLoading, error, onSubmit, onClose }: CreateVPModalProps) {
    const [form, setForm] = useState<CreateVPFormState>(DEFAULT_VP_FORM);

    const setField = useCallback(<K extends keyof CreateVPFormState>(
        key: K, value: CreateVPFormState[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
    }, [form, onSubmit]);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        setForm(DEFAULT_VP_FORM);
        onClose();
    }, [isLoading, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Create virtual patient"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">New Virtual Patient</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Create a new AI simulation persona</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Row: Name + Case ID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                                Patient Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                required
                                placeholder="e.g. Richard Anderson"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                                Clinical Case ID <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.caseId}
                                onChange={(e) => setField("caseId", e.target.value)}
                                required
                                placeholder="e.g. 27892518"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Row: Age + Gender + Level */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Age</label>
                            <input
                                type="number"
                                value={form.age}
                                onChange={(e) => setField("age", e.target.value === "" ? "" : Number(e.target.value))}
                                min={1} max={120}
                                placeholder="43"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => setField("gender", e.target.value as VPGender | "")}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value="">Select</option>
                                <option value={VPGender.Male}>Male</option>
                                <option value={VPGender.Female}>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Level</label>
                            <select
                                value={form.level}
                                onChange={(e) => setField("level", e.target.value as VPLevel | "")}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value="">Select</option>
                                <option value={VPLevel.Beginner}>Beginner</option>
                                <option value={VPLevel.Intermediate}>Intermediate</option>
                                <option value={VPLevel.Advanced}>Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Row: Occupation + Ethnicity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Occupation</label>
                            <input
                                type="text"
                                value={form.occupation}
                                onChange={(e) => setField("occupation", e.target.value)}
                                placeholder="e.g. Warehouse worker"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Ethnicity</label>
                            <input
                                type="text"
                                value={form.ethnicity}
                                onChange={(e) => setField("ethnicity", e.target.value)}
                                placeholder="e.g. Hispanic"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                    </div>

                    {/* Chief Concern */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                            Chief Concern <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.chiefConcern}
                            onChange={(e) => setField("chiefConcern", e.target.value)}
                            required
                            placeholder="e.g. Abdominal pain"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                        />
                    </div>

                    {/* Symptom */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Symptom</label>
                        <input
                            type="text"
                            value={form.symptom}
                            onChange={(e) => setField("symptom", e.target.value)}
                            placeholder="e.g. Right lower quadrant pain"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                        />
                    </div>

                    {/* Medical History */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Medical History</label>
                        <textarea
                            value={form.medicalHistory}
                            onChange={(e) => setField("medicalHistory", e.target.value)}
                            rows={3}
                            placeholder="Past medical history..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all resize-none"
                        />
                    </div>

                    {/* Row: Time Settings + Status */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">VP Time (min)</label>
                            <input
                                type="number"
                                value={form.timeSetting}
                                onChange={(e) => setField("timeSetting", e.target.value === "" ? "" : Number(e.target.value))}
                                min={5} max={120}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Reasoning (min)</label>
                            <input
                                type="number"
                                value={form.argumentTime}
                                onChange={(e) => setField("argumentTime", e.target.value === "" ? "" : Number(e.target.value))}
                                min={5} max={60}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setField("status", e.target.value as VPStatus)}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value={VPStatus.Draft}>Draft</option>
                                <option value={VPStatus.Active}>Active</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? "Creating..." : "Create Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}