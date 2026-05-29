"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, GraduationCap, Plus, Trash2, Loader2, ShieldAlert } from "lucide-react";
import type { VirtualPatientDetail, VPExpert } from "@/src/types/virtual-patient-expert";
import { useVPPermission } from "@/src/hooks/useVPPermission";
import { useVPExpertActions } from "@/src/hooks/useVPExpertActions";
import { AddExpertModal } from "@/src/features/expert/virtual-patient/components/detail/AddExpertModal";

interface TabExpertsProps {
    readonly patient: VirtualPatientDetail;
    readonly onRefresh: () => void;
    readonly readonly?: boolean;
}

function ExpertCard({
    expert,
    canManage,
    onRemove,
    removing,
}: {
    readonly expert: VPExpert;
    readonly canManage: boolean;
    readonly onRemove: (expertId: string) => void;
    readonly removing: boolean;
}) {
    const skills = expert.expertiseSkill
        ? expert.expertiseSkill.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    return (
        <div className="bg-[#F0F8FF] rounded-xl p-5 border border-blue-50 relative">
            {canManage && (
                <button
                    type="button"
                    onClick={() => onRemove(expert.expertId)}
                    disabled={removing}
                    className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    aria-label={`Remove ${expert.name}`}
                    title="Remove expert"
                >
                    {removing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                </button>
            )}
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
                        {expert.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{expert.phone}</span>}
                        {expert.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{expert.email}</span>}
                        {expert.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{expert.location}</span>}
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

export function TabExperts({ patient, onRefresh, readonly }: TabExpertsProps) {
    const { canManageExperts, isReadonly } = useVPPermission(patient);
    const { expertActionLoading, expertActionError, addExperts, removeExpert, clearExpertError } = useVPExpertActions();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleAddConfirm = useCallback(async (expertIds: string[]) => {
        const success = await addExperts(patient.patientId, expertIds);
        if (success) {
            setIsAddModalOpen(false);
            onRefresh();
        }
    }, [addExperts, patient.patientId, onRefresh]);

    const handleRemove = useCallback(async (expertId: string) => {
        setRemovingId(expertId);
        const success = await removeExpert(patient.patientId, expertId);
        setRemovingId(null);
        if (success) {
            onRefresh();
        }
    }, [removeExpert, patient.patientId, onRefresh]);

    const existingExpertIds = patient.experts.map((e) => e.expertId);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">
                    Assigned Experts ({patient.experts.length})
                </h3>
                {canManageExperts && (
                    <button
                        type="button"
                        onClick={() => { clearExpertError(); setIsAddModalOpen(true); }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Expert
                    </button>
                )}
            </div>

            {/* Permission notice for readonly */}
            {isReadonly && (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-xs font-semibold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    You have read-only access to this virtual patient.
                </div>
            )}

            {/* Expert action error */}
            {expertActionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium flex items-center justify-between">
                    <span>{expertActionError}</span>
                    <button onClick={clearExpertError} className="text-red-400 hover:text-red-600 text-xs font-bold ml-2">Dismiss</button>
                </div>
            )}

            {/* Empty state */}
            {patient.experts.length === 0 && (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 font-medium text-sm">No experts assigned to this virtual patient.</p>
                    {canManageExperts && (
                        <p className="text-slate-300 text-xs mt-1">Click &ldquo;Add Expert&rdquo; to assign experts.</p>
                    )}
                </div>
            )}

            {/* Expert cards */}
            {patient.experts.map((expert) => (
                <ExpertCard
                    key={expert.expertId}
                    expert={expert}
                    canManage={canManageExperts}
                    onRemove={handleRemove}
                    removing={removingId === expert.expertId || (expertActionLoading && removingId === expert.expertId)}
                />
            ))}

            {/* Permission footnote */}
            {!canManageExperts && patient.experts.length > 0 && (
                <p className="text-xs text-slate-400 italic">
                    Expert assignments can only be managed by the VP owner.
                </p>
            )}

            {/* AddExpertModal */}
            <AddExpertModal
                isOpen={isAddModalOpen}
                isLoading={expertActionLoading}
                error={expertActionError}
                existingExpertIds={existingExpertIds}
                onConfirm={handleAddConfirm}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}