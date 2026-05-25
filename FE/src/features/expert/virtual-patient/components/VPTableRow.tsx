"use client";

import React, { memo } from "react";
import Link from "next/link";
import { VPStatusBadge } from "@/src/features/expert/virtual-patient/components/VPStatusBadge";
import { VPLevelBadge }  from "@/src/features/expert/virtual-patient/components/VPLevelBadge";
import { VPRowActions }  from "@/src/features/expert/virtual-patient/components/VPRowActions";
import type { VirtualPatientSummary, VPStatus } from "@/src/types/virtual-patient-expert";

interface VPTableRowProps {
    readonly item:          VirtualPatientSummary;
    readonly onDelete:      (id: string) => void;
    readonly onDuplicate:   (id: string) => void;
    readonly onStatusChange:(id: string, status: VPStatus) => void;
}

export const VPTableRow = memo(function VPTableRow({
    item, onDelete, onDuplicate, onStatusChange,
}: VPTableRowProps) {
    const createdLabel = new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });

    return (
        <tr className="border-b border-slate-100 hover:bg-[#F8FAFC] transition-colors group">
            {/* Patient ID */}
            <td className="px-4 py-3">
                <Link
                    href={`/expert/virtual-patient/${item.patientId}`}
                    className="font-black text-[#235697] text-sm hover:underline font-mono tracking-tight"
                >
                    {item.patientId}
                </Link>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Case #{item.caseId}</p>
            </td>

            {/* Name + Demographics */}
            <td className="px-4 py-3">
                <p className="font-bold text-slate-800 text-sm leading-tight">{item.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.age}y · {item.gender} · {item.occupation}
                </p>
            </td>

            {/* Chief Concern */}
            <td className="px-4 py-3 max-w-50">
                <p className="text-sm text-slate-600 truncate" title={item.chiefConcern}>
                    {item.chiefConcern}
                </p>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <VPStatusBadge status={item.status} />
            </td>

            {/* Level */}
            <td className="px-4 py-3">
                <VPLevelBadge level={item.level} />
            </td>

            {/* Attempts / Score */}
            <td className="px-4 py-3 text-center">
                <p className="text-sm font-bold text-slate-700">{item.attemptCount}</p>
                {item.avgScore > 0 && (
                    <p className="text-[10px] text-[#1BA7D9] font-semibold">{item.avgScore.toFixed(1)}%</p>
                )}
            </td>

            {/* Created */}
            <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{createdLabel}</td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex justify-end"> 
                    <VPRowActions
                        item={item}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onStatusChange={onStatusChange}
                    />
                </div>
            </td>
        </tr>
    );
});