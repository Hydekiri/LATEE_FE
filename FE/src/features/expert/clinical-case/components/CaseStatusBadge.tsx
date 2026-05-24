import React from "react";
import { ClinicalCaseStatus } from "@/src/types/clinical-case";

const STATUS_CONFIG: Record<ClinicalCaseStatus, { label: string; className: string }> = {
    [ClinicalCaseStatus.Active]: {
        label: "Active",
        className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    [ClinicalCaseStatus.Draft]: {
        label: "Draft",
        className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    [ClinicalCaseStatus.Archived]: {
        label: "Archived",
        className: "bg-slate-100 text-slate-500 border-slate-200",
    },
    [ClinicalCaseStatus.Published]: {
        label: "Published",
        className: "bg-blue-50 text-blue-700 border-blue-100",
    },
};

interface CaseStatusBadgeProps {
    status: ClinicalCaseStatus;
    size?: "sm" | "md";
}

export function CaseStatusBadge({ status, size = "sm" }: CaseStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[ClinicalCaseStatus.Draft];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

    return (
        <span
            className={`inline-flex items-center rounded border font-black uppercase tracking-wider ${sizeClass} ${config.className}`}
        >
            {config.label}
        </span>
    );
}