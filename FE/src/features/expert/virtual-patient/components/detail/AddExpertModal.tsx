"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { X, Search, Loader2, UserPlus, Check } from "lucide-react";
import { useExpertSearch } from "@/src/hooks/useExpertSearch";
import type { ExpertSearchResult } from "@/src/types/virtual-patient-expert";

interface AddExpertModalProps {
    readonly isOpen: boolean;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly existingExpertIds: string[];
    readonly onConfirm: (expertIds: string[]) => void;
    readonly onClose: () => void;
}

export function AddExpertModal({
    isOpen,
    isLoading,
    error,
    existingExpertIds,
    onConfirm,
    onClose,
}: AddExpertModalProps) {
    const { query, results, searching, setQuery, clearSearch } = useExpertSearch(300);
    const [selected, setSelected] = useState<ExpertSearchResult[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timerId = setTimeout(() => {
                setSelected([]);
                clearSearch();
                inputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timerId);
        }
    }, [isOpen, clearSearch]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                clearSearch();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        onClose();
    }, [isLoading, onClose]);

    const toggleExpert = useCallback((expert: ExpertSearchResult) => {
        setSelected((prev) => {
            const alreadySelected = prev.some((e) => e.expertId === expert.expertId);
            if (alreadySelected) {
                return prev.filter((e) => e.expertId !== expert.expertId);
            }
            return [...prev, expert];
        });
    }, []);

    const removeSelected = useCallback((expertId: string) => {
        setSelected((prev) => prev.filter((e) => e.expertId !== expertId));
    }, []);

    const handleConfirm = useCallback(() => {
        if (selected.length === 0) return;
        onConfirm(selected.map((e) => e.expertId));
    }, [selected, onConfirm]);

    if (!isOpen) return null;

    const filteredResults = results.filter(
        (r) =>
            !existingExpertIds.includes(r.expertId) &&
            !selected.some((s) => s.expertId === r.expertId)
    );

    const showDropdown = query.trim().length > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Add expert to virtual patient"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-black text-slate-800">Add Expert</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Search and assign experts to this virtual patient</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Search Input */}
                    <div ref={dropdownRef} className="relative">
                        <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                            Search Expert
                        </label>
                        <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 focus-within:border-[#235697] focus-within:ring-2 focus-within:ring-[#235697]/10 transition-all">
                            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type expert name or ID..."
                                className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                                aria-label="Search expert"
                            />
                            {searching && (
                                <Loader2 className="w-4 h-4 text-slate-400 animate-spin ml-2 shrink-0" />
                            )}
                        </div>

                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                                {searching && (
                                    <div className="flex items-center justify-center py-6 gap-2 text-slate-400 text-sm">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Searching...
                                    </div>
                                )}

                                {!searching && filteredResults.length === 0 && (
                                    <div className="px-4 py-4 text-sm text-slate-400 text-center">
                                        {results.length > 0
                                            ? "All matching experts are already assigned"
                                            : `No experts found for "${query}"`}
                                    </div>
                                )}

                                {!searching && filteredResults.map((expert) => (
                                    <button
                                        key={expert.expertId}
                                        type="button"
                                        onClick={() => toggleExpert(expert)}
                                        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#F4F7FB] transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#235697]/10 flex items-center justify-center text-[11px] font-black text-[#235697] shrink-0">
                                            {expert.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{expert.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{expert.expertId}</p>
                                        </div>
                                        <UserPlus className="w-4 h-4 text-[#235697] shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected experts */}
                    {selected.length > 0 && (
                        <div>
                            <p className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">
                                Selected ({selected.length})
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {selected.map((expert) => (
                                    <div
                                        key={expert.expertId}
                                        className="flex items-center gap-3 bg-[#F0F8FF] border border-blue-100 rounded-lg px-3 py-2"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-[#235697]/10 flex items-center justify-center text-[10px] font-black text-[#235697] shrink-0">
                                            {expert.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">{expert.name}</p>
                                            <p className="text-xs text-slate-400 font-mono">{expert.expertId}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSelected(expert.expertId)}
                                            disabled={isLoading}
                                            className="p-1 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50"
                                            aria-label={`Remove ${expert.name}`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading || selected.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {isLoading ? "Adding..." : `Add ${selected.length > 0 ? selected.length : ""} Expert${selected.length !== 1 ? "s" : ""}`}
                    </button>
                </div>
            </div>
        </div>
    );
}