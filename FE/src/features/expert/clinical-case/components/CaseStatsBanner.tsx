import React from "react";
import { FileText, Users, BarChart2, BookOpen } from "lucide-react";
import type { ClinicalCaseFiltersAvailable } from "@/src/types/clinical-case";

interface CaseStatsBannerProps {
    total: number;
    loading: boolean;
    // Truyền thêm từ useClinicalCases
    availableFilters: ClinicalCaseFiltersAvailable | null;
    items: { status: string; virtualPatientCount: number; avgScore: number }[];
}

export function CaseStatsBanner({ total, loading, availableFilters, items }: CaseStatsBannerProps) {
    // Tính từ items hiện tại trong page
    const activeCount   = items.filter((i) => i.status === "active").length;
    const totalVP       = items.reduce((sum, i) => sum + (i.virtualPatientCount ?? 0), 0);
    const scoresWithVal = items.filter((i) => i.avgScore > 0);
    const avgScore      = scoresWithVal.length > 0
        ? scoresWithVal.reduce((sum, i) => sum + i.avgScore, 0) / scoresWithVal.length
        : 0;

    const stats = [
        {
            label: "Total Cases",
            value: total,
            display: total.toString(),
            icon: FileText,
            color: "text-[#235697] bg-[#235697]/10",
        },
        {
            label: "Active",
            value: activeCount,
            display: activeCount.toString(),
            icon: BookOpen,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Virtual Patients",
            value: totalVP,
            display: totalVP.toString(),
            icon: Users,
            color: "text-purple-600 bg-purple-50",
        },
        {
            label: "Avg Score",
            value: avgScore,
            display: avgScore > 0 ? `${avgScore.toFixed(1)}%` : "—",
            icon: BarChart2,
            color: "text-[#1BA7D9] bg-[#1BA7D9]/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white border border-[#DDE7F0] rounded-xl p-4 flex items-center gap-3 shadow-sm"
                >
                    <div className={`p-2.5 rounded-[10px] ${s.color} shrink-0`}>
                        <s.icon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider">
                            {s.label}
                        </p>
                        {loading ? (
                            <div className="h-5 w-12 bg-[#DDE7F0] rounded animate-pulse mt-1" />
                        ) : (
                            <p className="text-lg font-black text-[#173B67]">{s.display}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}