"use client";

import React from "react";
import { X, ArrowUpDown } from "lucide-react";
import { ClinicalCaseStatus, SortField, SortDirection } from "@/src/types/clinical-case";
import type { ClinicalCaseFiltersAvailable } from "@/src/types/clinical-case";
import type { ActiveFilters } from "@/src/hooks/useClinicalCaseFilters";

interface CaseFilterBarProps {
    filters: ActiveFilters;
    available: ClinicalCaseFiltersAvailable | null;
    onStatusChange: (v: ClinicalCaseStatus | "") => void;
    onTypeChange: (v: string) => void;
    onEccidChange: (v: string) => void;
    onSortByChange: (v: SortField) => void;
    onSortDirChange: (v: SortDirection) => void;
    onReset: () => void;
}

const STATUS_TABS: Array<{ label: string; value: ClinicalCaseStatus | "" }> = [
    { label: "All", value: "" },
    { label: "Active", value: ClinicalCaseStatus.Active },
    { label: "Draft", value: ClinicalCaseStatus.Draft },
    { label: "Archived", value: ClinicalCaseStatus.Archived },
    { label: "Published", value: ClinicalCaseStatus.Published },
];

const SELECT_BASE =
    "bg-[#F7FAFC] border border-[#DDE7F0] rounded-[8px] py-1.5 px-3 text-xs text-[#173B67] font-semibold outline-none focus:border-[#1BA7D9] transition-all cursor-pointer";

export function CaseFilterBar({
    filters,
    available,
    onStatusChange,
    onTypeChange,
    onEccidChange,
    onSortByChange,
    onSortDirChange,
    onReset,
}: CaseFilterBarProps) {
    const hasActiveFilters =
        filters.status !== "" ||
        filters.type !== "" ||
        filters.eccid !== "" ||
        filters.sortBy !== SortField.CreatedAt ||
        filters.sortDir !== SortDirection.Desc;

    return (
        <div className="space-y-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onStatusChange(tab.value)}
                        className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filters.status === tab.value
                                ? "bg-[#235697] text-white shadow-sm"
                                : "bg-[#F7FAFC] text-[#4F6F94] border border-[#DDE7F0] hover:border-[#235697]/40 hover:text-[#235697]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Advanced Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Type filter */}
                <select
                    value={filters.type}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className={SELECT_BASE}
                >
                    <option value="">All Types</option>
                    {(available?.availableTypes ?? []).map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                {/* ECCID filter */}
                <select
                    value={filters.eccid}
                    onChange={(e) => onEccidChange(e.target.value)}
                    className={SELECT_BASE}
                >
                    <option value="">All Criteria</option>
                    {(available?.availableEccids ?? []).map((e) => (
                        <option key={e} value={e}>{e}</option>
                    ))}
                </select>

                {/* Sort By */}
                <select
                    value={filters.sortBy}
                    onChange={(e) => onSortByChange(e.target.value as SortField)}
                    className={SELECT_BASE}
                >
                    <option value={SortField.CreatedAt}>Created At</option>
                    <option value={SortField.UpdatedAt}>Updated At</option>
                    <option value={SortField.Title}>Title</option>
                </select>

                {/* Sort Direction toggle */}
                <button
                    onClick={() =>
                        onSortDirChange(
                            filters.sortDir === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
                        )
                    }
                    className={`${SELECT_BASE} flex items-center gap-1.5`}
                    title="Toggle sort direction"
                >
                    <ArrowUpDown className="w-3 h-3" />
                    {filters.sortDir === SortDirection.Asc ? "ASC" : "DESC"}
                </button>

                {/* Reset */}
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" /> Reset Filters
                    </button>
                )}
            </div>
        </div>
    );
}