import React from "react";
import { VPStatus } from "@/src/types/virtual-patient-expert";

const STATUS_CONFIG: Record<VPStatus, { label: string; className: string }> = {
    [VPStatus.Active]: { label: "Active", className: "bg-[#299723]/10 text-[#299723] border-[#299723]" },
    [VPStatus.Draft]: { label: "Draft", className: "bg-[#DA741B]/10 text-[#DA741B] border-[#DA741B]" },
    [VPStatus.Archived]: { label: "Archived", className: "bg-[#D41F1F]/10 text-[#D41F1F] border-[#D41F1F]" },
    [VPStatus.Published]: { label: "Published", className: "bg-[#3B82F6]/10 text-[#235697] border-[#235697]" },
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