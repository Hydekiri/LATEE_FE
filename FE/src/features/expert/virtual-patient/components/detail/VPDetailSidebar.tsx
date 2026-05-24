import React from "react";
import { Clock, Users, TrendingUp, Calendar, FileText } from "lucide-react";
import type { VirtualPatientDetail } from "@/src/types/virtual-patient-expert";

interface VPDetailSidebarProps {
    readonly patient: VirtualPatientDetail;
}

export function VPDetailSidebar({ patient }: VPDetailSidebarProps) {
    const createdLabel = new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
    const updatedLabel = new Date(patient.updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    // ── Safe stat values — all can be null/undefined for new patients ─────────
    const totalAttempts  = patient.stats?.totalAttempts  ?? 0;
    const avgScore       = patient.stats?.avgScore       ?? 0;
    const completionRate = patient.stats?.completionRate ?? 0;

    // ── caseRule is nullable per the API ─────────────────────────────────────
    const caseRules = patient.caseRule?.rules ?? [];

    return (
        <div className="space-y-4 sticky top-6">

            {/* Simulation Stats */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#235697]" /> Simulation Stats
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">Total Attempts</span>
                        <span className="text-sm font-black text-slate-800">{totalAttempts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">Avg Score</span>
                        <span className="text-sm font-black text-[#235697]">{avgScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
                        <span className="text-sm font-black text-emerald-600">{(completionRate * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            {/* Timing Config */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#235697]" /> Timing Configuration
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">VP Interaction</span>
                        <span className="text-sm font-black text-slate-800">{patient.timeSetting} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400">Reasoning Phase</span>
                        <span className="text-sm font-black text-slate-800">{patient.argumentTime} min</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-600">Total Session</span>
                        <span className="text-sm font-black text-[#235697]">{patient.timeSetting + patient.argumentTime} min</span>
                    </div>
                </div>
            </div>

            {/* Case Rules — only rendered when caseRule is non-null and has entries */}
            {caseRules.length > 0 && (
                <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#235697]" /> Case Rules
                    </h3>
                    <ol className="space-y-2 list-decimal pl-4">
                        {caseRules.map((rule, i) => (
                            <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed">{rule}</li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Experts */}
            {(patient.experts?.length ?? 0) > 0 && (
                <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#235697]" /> Assigned Experts ({patient.experts.length})
                    </h3>
                    <div className="space-y-2">
                        {patient.experts.map((expert) => (
                            <div key={expert.expertId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="w-7 h-7 rounded-full bg-[#235697]/10 flex items-center justify-center text-[10px] font-black text-[#235697] shrink-0">
                                    {expert.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{expert.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{expert.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#235697]" /> Metadata
                </h3>
                <div className="space-y-2">
                    <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Created</p>
                        <p className="text-xs font-bold text-slate-700">{createdLabel}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Last Updated</p>
                        <p className="text-xs font-bold text-slate-700">{updatedLabel}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Case ID</p>
                        <p className="text-xs font-mono font-bold text-[#235697]">#{patient.caseId}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}