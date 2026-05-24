import React from "react";

export function CaseSkeletonCard() {
    return (
        <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 space-y-4 animate-pulse">
            <div className="flex items-start justify-between gap-2">
                <div className="h-4 bg-[#DDE7F0] rounded w-3/4" />
                <div className="h-5 bg-[#DDE7F0] rounded w-16 shrink-0" />
            </div>
            <div className="h-3 bg-[#DDE7F0] rounded w-full" />
            <div className="h-3 bg-[#DDE7F0] rounded w-2/3" />
            <div className="flex gap-2 pt-1">
                <div className="h-5 bg-[#DDE7F0] rounded w-20" />
                <div className="h-5 bg-[#DDE7F0] rounded w-16" />
            </div>
            <div className="border-t border-[#DDE7F0] pt-3 flex justify-between items-center">
                <div className="h-3 bg-[#DDE7F0] rounded w-24" />
                <div className="h-3 bg-[#DDE7F0] rounded w-20" />
            </div>
        </div>
    );
}

export function CaseSkeletonRow() {
    return (
        <tr className="animate-pulse">
            {[120, 200, 120, 100, 80, 100].map((w, i) => (
                <td key={i} className="py-4 px-3">
                    <div className="h-3.5 bg-[#DDE7F0] rounded" style={{ width: w }} />
                </td>
            ))}
        </tr>
    );
}