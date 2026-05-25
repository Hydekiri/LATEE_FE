import React from "react";
import { VPLevel } from "@/src/types/virtual-patient-expert";

const LEVEL_CONFIG: Record<VPLevel, { label: string; className: string }> = {
    [VPLevel.Beginner]:     { label: "Beginner",     className: "bg-sky-50 text-sky-600 border-sky-100" },
    [VPLevel.Intermediate]: { label: "Intermediate", className: "bg-violet-50 text-violet-600 border-violet-100" },
    [VPLevel.Advanced]:     { label: "Advanced",     className: "bg-rose-50 text-rose-600 border-rose-100" },
};

interface VPLevelBadgeProps {
    readonly level: VPLevel;
    readonly size?: "sm" | "md";
}

export function VPLevelBadge({ level, size = "sm" }: VPLevelBadgeProps) {
    const config    = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[VPLevel.Intermediate];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
    return (
        <span className={`inline-flex items-center rounded border font-bold ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}