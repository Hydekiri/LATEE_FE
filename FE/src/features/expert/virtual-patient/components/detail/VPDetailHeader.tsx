import React from "react";
import Image from "next/image";
import { User, Briefcase, Clock, BarChart2 } from "lucide-react";
import type { VirtualPatientDetail } from "@/src/types/virtual-patient-expert";

interface VPDetailHeaderProps {
    readonly patient: VirtualPatientDetail;
}

export function VPDetailHeader({ patient }: VPDetailHeaderProps) {
    const totalTime = patient.timeSetting + patient.argumentTime;

    return (
        <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 bg-[#A7E6FF]/30 border-2 border-[#235697]/10 shadow-sm">
                    {patient.avatarImage ? (
                        <Image
                            src={patient.avatarImage}
                            alt={patient.name}
                            fill
                            sizes="80px"
                            className="object-cover object-top"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <User className="w-8 h-8 text-[#235697]/40" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                            <h1 className="text-xl font-black text-slate-800 leading-tight">{patient.name}</h1>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">
                                <span className="text-[#235697] font-bold">{patient.patientId}</span>
                                {" · "}Case #{patient.caseId}
                            </p>
                        </div>
                    </div>

                    {/* Demographics row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#235697]" />
                            {patient.age}y · {patient.gender} · {patient.pronouns}
                        </span>
                        <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-[#235697]" />
                            {patient.occupation} · {patient.ethnicity}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#235697]" />
                            {totalTime} min total ({patient.timeSetting}+{patient.argumentTime})
                        </span>
                        <span className="flex items-center gap-1">
                            <BarChart2 className="w-3.5 h-3.5 text-[#235697]" />
                            {patient.stats.totalAttempts} attempts · Avg {patient.stats.avgScore.toFixed(1)}%
                        </span>
                    </div>

                    {/* Chief Concern */}
                    <div className="mt-3 px-3 py-2 bg-[#235697]/5 rounded-lg border border-[#235697]/10">
                        <p className="text-xs font-black text-[#235697] uppercase tracking-wide mb-0.5">Chief Concern</p>
                        <p className="text-sm font-semibold text-slate-700">{patient.chiefConcern}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}