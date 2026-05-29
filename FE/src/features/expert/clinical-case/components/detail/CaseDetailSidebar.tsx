import React from "react";
import { User, Tag, ClipboardCheck, BarChart2, Users } from "lucide-react";
import { CaseStatusBadge } from "../CaseStatusBadge";
import type { ClinicalCaseDetail } from "@/src/types/clinical-case";

interface Props {
    caseData: ClinicalCaseDetail;
}

export function CaseDetailSidebar({ caseData }: Props) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <div className="space-y-4">
            {/* Case Meta */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">Case Information</h3>

                <SidebarRow icon={<Tag className="w-4 h-4" />} label="Type">
                    <span className="font-mono font-bold text-[#235697]">{caseData.caseType}</span>
                </SidebarRow>
                <SidebarRow icon={<ClipboardCheck className="w-4 h-4" />} label="Criteria (ECCID)">
                    <span className="font-mono text-slate-600">{caseData.eccId}</span>
                </SidebarRow>
                <SidebarRow icon={<User className="w-4 h-4" />} label="Author">
                    <span className="font-semibold text-[#173B67]">{caseData.createdByName}</span>
                </SidebarRow>

                <div className="border-t border-[#DDE7F0] pt-3 space-y-2 text-xs text-[#7F96AD]">
                    <div className="flex justify-between">
                        <span>Created</span>
                        <span className="font-semibold text-[#173B67]">{formatDate(caseData.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Updated</span>
                        <span className="font-semibold text-[#173B67]">{formatDate(caseData.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Status</span>
                        <CaseStatusBadge status={caseData.status} />
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">Analytics</h3>
                <div className="space-y-3">
                    <ProgressStat label="Avg Score" value={caseData.stats.avgScore} max={100} color="bg-[#1BA7D9]" />
                    <ProgressStat label="Completion Rate" value={caseData.stats.completionRate * 100} max={100} color="bg-emerald-500" />
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-[#7F96AD] font-medium">
                            <BarChart2 className="w-3.5 h-3.5" /> Total Attempts
                        </span>
                        <span className="font-black text-[#173B67]">{caseData.stats.totalAttempts}</span>
                    </div>
                </div>
            </div>

            {/* Virtual Patients */}
            {caseData.virtualPatients.length > 0 && (
                <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 shadow-sm space-y-3">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> Virtual Patients ({caseData.virtualPatients.length})
                    </h3>
                    {caseData.virtualPatients.map((vp) => (
                        <div key={vp.patientId} className="flex items-center gap-3 border border-[#DDE7F0] rounded-xl p-3">
                            <div className="w-8 h-8 rounded-full bg-[#235697]/10 flex items-center justify-center text-[#235697] font-bold text-xs">
                                {vp.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#173B67] truncate">{vp.name}</p>
                                <p className="text-[10px] text-[#7F96AD]">{vp.age}y · {vp.gender} · {vp.level}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SidebarRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="text-[#7F96AD] shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#7F96AD] font-medium">{label}</p>
                <div className="text-xs mt-0.5">{children}</div>
            </div>
        </div>
    );
}

function ProgressStat({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-[#7F96AD] font-medium">{label}</span>
                <span className="font-black text-[#173B67]">{value.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-[#F7FAFC] border border-[#DDE7F0] rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}