'use client';

import { useState, ChangeEvent } from 'react';
import {
    XMarkIcon,
    ArrowsUpDownIcon,
    DocumentArrowDownIcon,
} from '@heroicons/react/24/solid';
import {
    FetchCasesFormState,
    DEFAULT_FETCH_CASES_FORM,
} from '@/src/types/discovery';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

const GENDER_OPTIONS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
] as const;

interface FetchCasesModalProps {
    readonly isOpen: boolean;
    readonly isLoading: boolean;
    readonly errorMessage: string | null;
    readonly onSubmit: (form: FetchCasesFormState) => Promise<void>;
    readonly onClose: () => void;
}

export function FetchCasesModal({
    isOpen,
    isLoading,
    errorMessage,
    onSubmit,
    onClose,
}: FetchCasesModalProps) {
    const [draft, setDraft] = useState<FetchCasesFormState>(DEFAULT_FETCH_CASES_FORM);

    if (!isOpen) return null;

    const handleChange = <K extends keyof FetchCasesFormState>(
        key: K,
        value: FetchCasesFormState[K]
    ): void => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    };

    const handleFetchCountChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 1 && val <= 20) {
            handleChange('fetchCount', val);
        }
    };

    const handleSubmit = async (): Promise<void> => {
        await onSubmit(draft);
    };

    const handleReset = (): void => {
        setDraft(DEFAULT_FETCH_CASES_FORM);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) onClose();
            }}
        >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8
                        border border-gray-100 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#235697]">
                            Pull New Cases
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Choose filters and how many cases to add to your personal pool.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                        transition-colors disabled:opacity-40"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Error banner */}
                {errorMessage && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                        {errorMessage}
                    </div>
                )}

                {/* Fields */}
                <div className="flex flex-col gap-5">
                    {/* Level */}
                    <div>
                        <label className="block text-sm font-semibold text-[#235697] mb-2">
                            Filter by Difficulty Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleChange('level', '')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                    draft.level === ''
                                        ? 'bg-[#235697] text-white border-[#235697]'
                                        : 'bg-white text-[#235697] border-[#235697]/40 hover:border-[#235697]'
                                }`}
                            >
                                All Levels
                            </button>
                            {LEVEL_OPTIONS.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleChange('level', l)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                        draft.level === l
                                            ? 'bg-[#235697] text-white border-[#235697]'
                                            : 'bg-white text-[#235697] border-[#235697]/40 hover:border-[#235697]'
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-[#235697] mb-2">
                            Filter by Patient Gender
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleChange('gender', '')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                    draft.gender === ''
                                        ? 'bg-[#235697] text-white border-[#235697]'
                                        : 'bg-white text-[#235697] border-[#235697]/40 hover:border-[#235697]'
                                }`}
                            >
                                Any Gender
                            </button>
                            {GENDER_OPTIONS.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => handleChange('gender', value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                        draft.gender === value
                                            ? 'bg-[#235697] text-white border-[#235697]'
                                            : 'bg-white text-[#235697] border-[#235697]/40 hover:border-[#235697]'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fetch count */}
                    <div className="max-w-xs">
                        <label className="block text-sm font-semibold text-[#235697] mb-2">
                            Number of Cases to Fetch
                        </label>
                        <div className="relative flex items-center">
                            <DocumentArrowDownIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                            <select
                                value={draft.fetchCount}
                                onChange={handleFetchCountChange}
                                className="w-full border border-[#235697]/40 pl-9 pr-4 py-2.5 rounded-lg
                                bg-white text-[#235697] font-semibold text-sm
                                focus:outline-none focus:border-[#235697] appearance-none cursor-pointer"
                            >
                                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        +{num} {num === 1 ? 'New Case' : 'New Cases'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="text-sm text-gray-400 hover:text-red-500 font-semibold
                        transition-colors disabled:opacity-40"
                    >
                        Reset Defaults
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-500
                            font-semibold text-sm hover:border-gray-300 transition-all
                            disabled:opacity-40"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => void handleSubmit()}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#235697]
                            text-white font-bold text-sm hover:bg-[#1BA7D9] transition-all
                            shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            {isLoading ? 'Fetching...' : `Fetch ${draft.fetchCount} Cases`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}