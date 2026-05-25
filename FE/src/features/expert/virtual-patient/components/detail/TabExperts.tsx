import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, GraduationCap } from "lucide-react";
import type { VirtualPatientDetail, VPExpert } from "@/src/types/virtual-patient-expert";

interface TabExpertsProps {
    readonly patient: VirtualPatientDetail;
}

function ExpertCard({ expert }: { readonly expert: VPExpert }) {
    const skills = expert.expertiseSkill
        ? expert.expertiseSkill.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <div className="bg-[#F0F8FF] rounded-xl p-5 border border-blue-50">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 shadow-sm border-2 border-white">
                    {expert.avatarUrl ? (
                        <Image src={expert.avatarUrl} alt={expert.name} fill sizes="56px" className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[#235697]/10 flex items-center justify-center text-[#235697] font-black text-lg">
                            {expert.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[#235697] text-base">{expert.name}</h4>
                    <p className="text-xs font-bold text-[#1BA7D9] uppercase tracking-wider mt-0.5">{expert.role}</p>

                    {expert.bioQuote && (
                        <p className="text-xs text-slate-500 italic mt-2 leading-relaxed">&ldquo;{expert.bioQuote}&rdquo;</p>
                    )}

                    {expert.educationDetail && (
                        <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500">
                            <GraduationCap className="w-3.5 h-3.5 text-[#235697] mt-0.5 shrink-0" />
                            <span>{expert.educationDetail}</span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-400 font-semibold">
                        {expert.phone    && <span className="flex items-center gap-1"><Phone    className="w-3 h-3" />{expert.phone}</span>}
                        {expert.email    && <span className="flex items-center gap-1"><Mail     className="w-3 h-3" />{expert.email}</span>}
                        {expert.location && <span className="flex items-center gap-1"><MapPin   className="w-3 h-3" />{expert.location}</span>}
                    </div>

                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {skills.map((skill) => (
                                <span key={skill} className="px-2.5 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-[#235697] shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function TabExperts({ patient }: TabExpertsProps) {
    if (patient.experts.length === 0) {
        return (
            <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400 font-medium text-sm">No experts assigned to this virtual patient.</p>
                <p className="text-slate-300 text-xs mt-1">Experts are managed at the clinical case level.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-base font-black text-slate-800">Assigned Experts ({patient.experts.length})</h3>
            {patient.experts.map((expert) => (
                <ExpertCard key={expert.expertId} expert={expert} />
            ))}
            <p className="text-xs text-slate-400 italic">
                Expert assignments are read-only in this view. Manage expert assignments at the Clinical Case level.
            </p>
        </div>
    );
}