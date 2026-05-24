import React from "react";
import { VPStatus } from "@/src/types/virtual-patient-expert";

const STATUS_CONFIG: Record<VPStatus, { label: string; className: string }> = {
    [VPStatus.Active]: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    [VPStatus.Draft]: { label: "Draft", className: "bg-amber-50 text-amber-700 border-amber-200" },
    [VPStatus.Archived]: { label: "Archived", className: "bg-slate-100 text-slate-500 border-slate-200" },
    [VPStatus.Published]: { label: "Published", className: "bg-blue-50 text-blue-700 border-blue-100" },
};

interface VPStatusBadgeProps {
    readonly status: VPStatus;
    readonly size?: "sm" | "md";
}

export function VPStatusBadge({ status, size = "sm" }: VPStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[VPStatus.Draft];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
    return (
        <span className={`inline-flex items-center rounded border font-black uppercase tracking-wider ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}