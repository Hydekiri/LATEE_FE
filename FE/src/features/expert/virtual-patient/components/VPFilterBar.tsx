"use client";

import React, { useRef, useCallback } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Plus, RotateCcw } from "lucide-react";
import type { VPActiveFilters, VPFiltersAvailable } from "@/src/types/virtual-patient-expert";
import { VPStatus, VPLevel, VPGender, VPSortField, VPSortDir } from "@/src/types/virtual-patient-expert";

const STATUS_OPTIONS: { value: VPStatus | ""; label: string }[] = [
    { value: "", label: "All Status" },
    { value: VPStatus.Active, label: "Active" },
    { value: VPStatus.Draft, label: "Draft" },
    { value: VPStatus.Published, label: "Published" },
    { value: VPStatus.Archived, label: "Archived" },
];

const LEVEL_OPTIONS: { value: VPLevel | ""; label: string }[] = [
    { value: "", label: "All Levels" },
    { value: VPLevel.Beginner, label: "Beginner" },
    { value: VPLevel.Intermediate, label: "Intermediate" },
    { value: VPLevel.Advanced, label: "Advanced" },
];

const GENDER_OPTIONS: { value: VPGender | ""; label: string }[] = [
    { value: "", label: "All Genders" },
    { value: VPGender.Male, label: "Male" },
    { value: VPGender.Female, "label": "Female" },
];

const SORT_OPTIONS: { value: VPSortField; label: string }[] = [
    { value: VPSortField.CreatedAt, label: "Newest First" },
    { value: VPSortField.UpdatedAt, label: "Recently Updated" },
    { value: VPSortField.Name, label: "Name A→Z" },
    { value: VPSortField.Level, label: "Level" },
];

interface VPFilterBarProps {
    readonly filters: VPActiveFilters;
    readonly availableFilters: VPFiltersAvailable | null;
    readonly onSearchChange: (v: string) => void;
    readonly onStatusChange: (v: VPStatus | "") => void;
    readonly onLevelChange: (v: VPLevel | "") => void;
    readonly onGenderChange: (v: VPGender | "") => void;
    readonly onSortByChange: (v: VPSortField) => void;
    readonly onSortDirToggle: () => void;
    readonly onReset: () => void;
    readonly onCreate: () => void;
    readonly hasActiveFilters: boolean;
}

export function VPFilterBar({
    filters, availableFilters,
    onSearchChange, onStatusChange, onLevelChange,
    onGenderChange, onSortByChange, onSortDirToggle,
    onReset, onCreate, hasActiveFilters,
}: VPFilterBarProps) {
    const searchRef = useRef<HTMLInputElement>(null);

    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            onSearchChange("");
            searchRef.current?.blur();
        }
    }, [onSearchChange]);

    return (
        <div className="bg-white border border-[#DDE7F0] rounded-xl px-5 py-4 shadow-sm space-y-3">
            {/* Row 1: Search + Create */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={filters.search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search by name, ID, case, concern..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg
                                text-slate-700 placeholder-slate-400 outline-none
                                focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10
                                transition-all bg-slate-50 hover:bg-white"
                        aria-label="Search virtual patients"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                                    border border-slate-200 rounded-lg text-slate-500
                                    hover:border-red-200 hover:text-red-500 transition-all"
                            aria-label="Reset filters"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={onCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-sm
                                font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm
                                focus:outline-none focus:ring-2 focus:ring-[#235697]/30"
                        aria-label="Create new virtual patient"
                    >
                        <Plus className="w-4 h-4" />
                        New Patient
                    </button>
                </div>
            </div>

            {/* Row 2: Filter chips */}
            <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => onStatusChange(e.target.value as VPStatus | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by status"
                >
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Level */}
                <select
                    value={filters.level}
                    onChange={(e) => onLevelChange(e.target.value as VPLevel | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by level"
                >
                    {LEVEL_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Gender */}
                <select
                    value={filters.gender}
                    onChange={(e) => onGenderChange(e.target.value as VPGender | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by gender"
                >
                    {GENDER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Case filter */}
                {(availableFilters?.availableCaseIds ?? []).length > 0 && (
                    <select
                        value={filters.caseId}
                        onChange={(e) => {
                            
                        }}
                        className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                                text-slate-600 bg-slate-50 hover:bg-white transition-all
                                focus:outline-none focus:border-[#235697] cursor-pointer"
                        aria-label="Filter by clinical case"
                    >
                        <option value="">All Cases</option>
                        {availableFilters?.availableCaseIds.map((id) => (
                            <option key={id} value={id}>Case #{id}</option>
                        ))}
                    </select>
                )}

                {/* Sort */}
                <div className="flex items-center gap-1 ml-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={filters.sortBy}
                        onChange={(e) => onSortByChange(e.target.value as VPSortField)}
                        className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                                text-slate-600 bg-slate-50 hover:bg-white transition-all
                                focus:outline-none focus:border-[#235697] cursor-pointer"
                        aria-label="Sort by"
                    >
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <button
                        onClick={onSortDirToggle}
                        className="p-1.5 border border-slate-200 rounded-lg text-slate-400
                                hover:border-[#235697] hover:text-[#235697] transition-all"
                        aria-label={`Sort direction: ${filters.sortDir}`}
                        title={filters.sortDir === VPSortDir.Desc ? "Descending" : "Ascending"}
                    >
                        <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${filters.sortDir === VPSortDir.Asc ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}