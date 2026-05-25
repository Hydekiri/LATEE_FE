"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Globe, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { useVirtualPatientDetail } from "@/src/hooks/useVirtualPatientDetail";
import { useVirtualPatientActions } from "@/src/hooks/useVirtualPatientActions";
import { VPDetailHeader } from "@/src/features/expert/virtual-patient/components/detail/VPDetailHeader";
import { VPDetailSidebar } from "@/src/features/expert/virtual-patient/components/detail/VPDetailSidebar";
import { TabPersona } from "@/src/features/expert/virtual-patient/components/detail/TabPersona";
import { TabVitals } from "@/src/features/expert/virtual-patient/components/detail/TabVitals";
import { TabInstructions } from "@/src/features/expert/virtual-patient/components/detail/TabInstructions";
import { TabLearningObjectives } from "@/src/features/expert/virtual-patient/components/detail/TabLearningObjectives";
import { TabExperts } from "@/src/features/expert/virtual-patient/components/detail/TabExperts";
import { VPStatusBadge } from "@/src/features/expert/virtual-patient/components/VPStatusBadge";
import { VPLevelBadge } from "@/src/features/expert/virtual-patient/components/VPLevelBadge";

import { VPStatus } from "@/src/types/virtual-patient-expert";

const TABS = [
    { slug: "persona", label: "AI Persona" },
    { slug: "vitals", label: "Vital Signs" },
    { slug: "instructions", label: "Instructions" },
    { slug: "objectives", label: "Learning Objectives" },
    { slug: "experts", label: "Experts" },
] as const;

type TabSlug = (typeof TABS)[number]["slug"];

interface VirtualPatientDetailFeatureProps {
    readonly patientId: string;
}

export default function VirtualPatientDetailFeature({ patientId }: VirtualPatientDetailFeatureProps) {
    const { patient, loading, error, saving, refetch, savePatient, updateStatus } =
        useVirtualPatientDetail(patientId);
    const { actionLoading, duplicatePatient } = useVirtualPatientActions();

    const [activeTab, setActiveTab] = useState<TabSlug>("persona");

    const handlePublish = useCallback(async () => {
        if (!patient) return;
        const next = patient.status === VPStatus.Published ? VPStatus.Active : VPStatus.Published;
        await updateStatus(next);
    }, [patient, updateStatus]);

    const handleDuplicate = useCallback(() => {
        void duplicatePatient(patientId);
    }, [duplicatePatient, patientId]);

    if (loading) {
        return (
            <div className="flex flex-col gap-5 p-6 animate-pulse">
                <div className="h-8 w-64 bg-slate-100 rounded-xl" />
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 space-y-4">
                        <div className="h-32 bg-slate-100 rounded-xl" />
                        <div className="h-64 bg-slate-100 rounded-xl" />
                    </div>
                    <div className="col-span-4">
                        <div className="h-96 bg-slate-100 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-red-500 font-semibold text-sm">{error ?? "Patient not found"}</p>
                <div className="flex gap-3">
                    <Link
                        href="/expert/virtual-patient"
                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to list
                    </Link>
                    <button
                        onClick={refetch}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all"
                    >
                        <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                </div>
            </div>
        );
    }

    const isPublished = patient.status === VPStatus.Published;

    return (
        <section className="p-6 space-y-5 min-h-screen bg-[#F4F7FB]">

            {/* ── Breadcrumb + Actions ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                    <Link
                        href="/expert/virtual-patient"
                        className="flex items-center gap-1 hover:text-[#235697] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Virtual Patients
                    </Link>
                    <span>/</span>
                    <span className="text-slate-700 font-black font-mono">{patient.patientId}</span>
                </div>

                <div className="flex items-center gap-2">
                    <VPStatusBadge status={patient.status} size="md" />
                    <VPLevelBadge level={patient.level} size="md" />

                    <button
                        onClick={handleDuplicate}
                        disabled={actionLoading}
                        className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>

                    <button
                        onClick={() => void handlePublish()}
                        disabled={actionLoading || saving}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all disabled:opacity-50 ${isPublished
                                ? "border border-amber-300 text-amber-700 hover:bg-amber-50"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            }`}
                    >
                        {(actionLoading || saving) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Globe className="w-3.5 h-3.5" />
                        )}
                        {isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <Link
                        href={`/practice/${patient.patientId}?tab=about`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 py-2 border border-[#235697] text-[#235697] text-xs font-bold rounded-lg hover:bg-[#235697] hover:text-white transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" /> Preview
                    </Link>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left: Detail + Tabs */}
                <div className="lg:col-span-8 space-y-5">

                    {/* Summary header */}
                    <VPDetailHeader patient={patient} />

                    {/* Tabs */}
                    <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm overflow-hidden">
                        {/* Tab nav */}
                        <div className="flex border-b border-slate-100 px-6 pt-4 gap-1 overflow-x-auto">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.slug}
                                    onClick={() => setActiveTab(tab.slug)}
                                    className={`relative pb-3 px-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.slug
                                            ? "text-[#235697]"
                                            : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-all duration-300 ${activeTab === tab.slug ? "bg-[#235697]" : "bg-transparent"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="px-6 py-6">
                            {activeTab === "persona" && <TabPersona patient={patient} onSave={savePatient} saving={saving} />}
                            {activeTab === "vitals" && <TabVitals patient={patient} onSave={savePatient} saving={saving} />}
                            {activeTab === "instructions" && <TabInstructions patient={patient} onSave={savePatient} saving={saving} />}
                            {activeTab === "objectives" && <TabLearningObjectives patient={patient} onSave={savePatient} saving={saving} />}
                            {activeTab === "experts" && <TabExperts patient={patient} />}
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="lg:col-span-4">
                    <VPDetailSidebar
                        key={patient.updatedAt}   
                        patient={patient}
                        onSave={savePatient}
                        saving={saving}
                    />
                </div>
            </div>
        </section>
    );
}