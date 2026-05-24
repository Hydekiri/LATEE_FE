import React from "react";
import type { ClinicalCaseDetail } from "@/src/types/clinical-case";

interface Props {
    caseData: ClinicalCaseDetail;
}

export function CaseDetailHeader({ caseData }: Props) {
    const stats = [
        { label: "Total Attempts", value: caseData.stats.totalAttempts },
        { label: "Avg Score", value: `${caseData.stats.avgScore.toFixed(1)}%` },
        { label: "Completion Rate", value: `${(caseData.stats.completionRate * 100).toFixed(0)}%` },
        { label: "Virtual Patients", value: caseData.virtualPatients.length },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
                <div key={s.label} className="bg-white border border-[#DDE7F0] rounded-xl p-4 shadow-xs">
                    <p className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-black text-[#173B67] mt-1">{s.value}</p>
                </div>
            ))}
        </div>
    );
}