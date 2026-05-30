import React from "react";
import { VPLevel } from "@/src/types/virtual-patient-expert";

const LEVEL_CONFIG: Record<VPLevel, { label: string; className: string }> = {
    [VPLevel.Beginner]: { label: "Beginner", className: "bg-[#1BA7D9]/10 text-[#1BA7D9] border-[#1BA7D9]" },
    [VPLevel.Intermediate]: { label: "Intermediate", className: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]" },
    [VPLevel.Advanced]: { label: "Advanced", className: "bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]" },
};

interface VPLevelBadgeProps {
    readonly level: VPLevel;
    readonly size?: "sm" | "md";
}

export function VPLevelBadge({ level, size = "sm" }: VPLevelBadgeProps) {
    const config = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[VPLevel.Intermediate];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
    return (
        <span className={`inline-flex items-center rounded border font-bold ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}