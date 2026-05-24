import React from "react";
import { UserCircle, Activity, BarChart2, Clock } from "lucide-react";

interface VPStatsBannerProps {
    readonly total:   number;
    readonly loading: boolean;
}

export function VPStatsBanner({ total, loading }: VPStatsBannerProps) {
    const stats = [
        { label: "Total Patients",  value: loading ? "—" : total, icon: UserCircle, color: "text-[#235697] bg-[#235697]/10" },
        { label: "Active",          value: "—",                   icon: Activity,   color: "text-emerald-600 bg-emerald-50" },
        { label: "Published",       value: "—",                   icon: BarChart2,  color: "text-blue-600 bg-blue-50" },
        { label: "Avg Sim Score",   value: "—",                   icon: Clock,      color: "text-[#1BA7D9] bg-[#1BA7D9]/10" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => {
                const Icon = s.icon;
                return (
                    <div key={s.label} className="bg-white border border-[#DDE7F0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide truncate">{s.label}</p>
                            <p className="text-xl font-black text-slate-800 leading-tight">{s.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}