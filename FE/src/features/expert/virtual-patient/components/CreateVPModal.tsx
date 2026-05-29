"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Loader2, Search, Check } from "lucide-react";
import { useClinicalCaseSearch } from "@/src/hooks/useClinicalCaseSearch";
import type { CreateVPFormState, ClinicalCaseSummary } from "@/src/types/virtual-patient-expert";
import { VPStatus, VPLevel, VPGender, DEFAULT_VP_FORM } from "@/src/types/virtual-patient-expert";

interface CreateVPModalProps {
    readonly isOpen: boolean;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly onSubmit: (form: CreateVPFormState) => void;
    readonly onClose: () => void;
}

export function CreateVPModal({ isOpen, isLoading, error, onSubmit, onClose }: CreateVPModalProps) {
    const [form, setForm] = useState<CreateVPFormState>(DEFAULT_VP_FORM);
    const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);
    const [selectedCaseTitle, setSelectedCaseTitle] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { query, results, searching, setQuery, clearSearch } = useClinicalCaseSearch(350);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCaseDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setForm(DEFAULT_VP_FORM);
                clearSearch();
                setSelectedCaseTitle("");
            }, 0);
        }
    }, [isOpen, clearSearch]);

    const handleCaseSelect = useCallback((c: ClinicalCaseSummary) => {
        setForm((prev) => ({ ...prev, caseId: c.caseId }));
        setSelectedCaseTitle(c.title);
        setCaseDropdownOpen(false);
        clearSearch();
    }, [clearSearch]);

    const setField = useCallback(<K extends keyof CreateVPFormState>(
        key: K, value: CreateVPFormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        setForm(DEFAULT_VP_FORM);
        clearSearch();
        setSelectedCaseTitle("");
        onClose();
    }, [isLoading, onClose, clearSearch]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    }, [form, onSubmit]);

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

                    {/* Clinical Case — Searchable Autocomplete */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                            Clinical Case <span className="text-red-400">*</span>
                        </label>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-[#235697] focus-within:border-[#235697] focus-within:ring-2 focus-within:ring-[#235697]/10 transition-all"
                                onClick={() => setCaseDropdownOpen(true)}
                            >
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    value={caseDropdownOpen ? query : selectedCaseTitle || form.caseId}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (!caseDropdownOpen) setCaseDropdownOpen(true);
                                    }}
                                    onFocus={() => setCaseDropdownOpen(true)}
                                    placeholder="Search clinical cases by title or ID..."
                                    className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                                />
                                {searching && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
                                {form.caseId && !caseDropdownOpen && (
                                    <span className="text-xs text-slate-400 font-mono shrink-0">#{form.caseId}</span>
                                )}
                            </div>

                            {caseDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                                    {results.length === 0 && !searching && query.trim() && (
                                        <div className="px-4 py-3 text-sm text-slate-400 text-center">
                                            No cases found for &ldquo;{query}&rdquo;
                                        </div>
                                    )}
                                    {results.length === 0 && !searching && !query.trim() && (
                                        <div className="px-4 py-3 text-sm text-slate-400 text-center">
                                            Type to search clinical cases...
                                        </div>
                                    )}
                                    {results.map((c: ClinicalCaseSummary) => (
                                        <button
                                            key={c.caseId}
                                            type="button"
                                            onClick={() => handleCaseSelect(c)}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#F4F7FB] transition-colors border-b border-slate-50 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{c.title}</p>
                                                <p className="text-xs text-slate-400 font-mono">#{c.caseId} · {c.type} · {c.status}</p>
                                            </div>
                                            {form.caseId === c.caseId && (
                                                <Check className="w-4 h-4 text-[#235697] shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row: Name */}
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
                                {/* <option value={VPStatus.Active}>Active</option> */}
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