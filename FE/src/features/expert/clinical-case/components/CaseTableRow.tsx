"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, Copy, Trash2, MoreVertical } from "lucide-react";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { ClinicalCaseStatus } from "@/src/types/clinical-case";
import type { ClinicalCaseSummary } from "@/src/types/clinical-case";

interface CaseTableRowProps {
    item: ClinicalCaseSummary;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onStatusChange: (id: string, status: ClinicalCaseStatus) => void;
}

export function CaseTableRow({ item, onDelete, onDuplicate }: CaseTableRowProps) {
    const router = useRouter();
    const formattedDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <tr className="bg-white border border-[#DDE7F0] hover:border-[#1BA7D9]/30 hover:shadow-sm transition-all group">
            <td className="py-3.5 pl-4 rounded-l-xl border-y border-l border-[#DDE7F0] font-mono font-bold text-[#235697] text-xs">
                {item.caseId}
            </td>
            <td className="py-3.5 border-y border-[#DDE7F0] pr-4">
                <div className="max-w-70">
                    <button
                        onClick={() => router.push(`/expert/clinical-case/${item.caseId}`)}
                        className="font-bold text-[#173B67] hover:text-[#1BA7D9] hover:underline text-xs text-left truncate block w-full transition-colors"
                    >
                        {item.title}
                    </button>
                    <span className="text-[10px] text-[#7F96AD] truncate block mt-0.5">{item.description}</span>
                </div>
            </td>
            <td className="py-3.5 border-y border-[#DDE7F0] font-mono text-[#4F6F94] text-xs">
                {item.caseType}
            </td>
            <td className="py-3.5 border-y border-[#DDE7F0] font-mono text-slate-500 text-xs">
                {item.eccId}
            </td>
            <td className="py-3.5 border-y border-[#DDE7F0] text-xs text-[#7F96AD]">
                {formattedDate(item.updatedAt)}
            </td>
            <td className="py-3.5 border-y border-[#DDE7F0]">
                <CaseStatusBadge status={item.status} />
            </td>
            <td className="py-3.5 rounded-r-xl border-y border-r border-[#DDE7F0] pr-4">
                <div className="flex items-center justify-end gap-1 text-[#7F96AD]">
                    <button
                        onClick={() => router.push(`/expert/clinical-case/${item.caseId}`)}
                        className="p-1.5 hover:text-[#235697] hover:bg-[#EDF6FB] rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[#1BA7D9]">Manage</span>
                    </button>
                    <div className="w-px h-3 bg-[#DDE7F0]" />
                    <button
                        onClick={() => onDuplicate(item.caseId)}
                        className="p-1.5 hover:text-[#235697] hover:bg-[#EDF6FB] rounded-lg transition-all"
                        title="Duplicate"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-3 bg-[#DDE7F0]" />
                    <button
                        onClick={() => onDelete(item.caseId)}
                        className="p-1.5 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}