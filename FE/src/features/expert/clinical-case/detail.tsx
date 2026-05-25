"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft, Save, Loader2, RefreshCw,
    FileText, FlaskConical, Scan, User, Stethoscope,
} from "lucide-react";
import { useClinicalCaseDetail } from "@/src/hooks/useClinicalCaseDetail";
import { CaseStatusBadge } from "./components/CaseStatusBadge";
import { CaseDetailHeader } from "./components/detail/CaseDetailHeader";
import { CaseDetailSidebar } from "./components/detail/CaseDetailSidebar";
import { TabOverview } from "./components/detail/tabs/TabOverview";
import { TabPhysicalExam } from "./components/detail/tabs/TabPhysicalExam";
import { TabLabs } from "./components/detail/tabs/TabLabs";
import { TabRadiology } from "./components/detail/tabs/TabRadiology";
import type { UpdateClinicalCaseRequest, FragmentedPhysicalExam, ClinicalCaseDetail } from "@/src/types/clinical-case";
import { CaseDetailTabNav } from "./components/detail/CaseDetailTabNav";
import { TabSymptoms } from "./components/detail/tabs/TabSymptoms";
import { getCookie } from "@/src/utils/cookies";


type DetailTab = "overview" | "symptoms" | "exam" | "labs" | "radiology";

const TABS: Array<{ id: DetailTab; label: string; icon: React.ReactNode }> = [
    { id: "overview", label: "Overview", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "symptoms", label: "Symptoms & History", icon: <User className="w-3.5 h-3.5" /> },
    { id: "exam", label: "Physical Exam", icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: "labs", label: "Lab Tests", icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: "radiology", label: "Imaging", icon: <Scan className="w-3.5 h-3.5" /> },
];

export function parsePE(raw: string): FragmentedPhysicalExam {
    const extract = (regex: RegExp, fallback = "") => {
        const m = raw.match(regex);
        return m?.[1]?.trim() ?? fallback;
    };
    return {
        temp: extract(/Temp:\s*([^\s;%]+)/i, "98"),
        hr: extract(/HR:\s*([^\s;%]+)/i, "—"),
        resp: extract(/Resp:\s*([^\s;%]+)/i, "—"),
        o2sat: extract(/O2Sat:\s*([^\s;%]+%?)/i, "—"),
        general: extract(/General:\s*([\s\S]*?)(?=Cardiac:|Pulmonary:|Abdomen:|Extremities:|$)/i),
        cardiac: extract(/Cardiac:\s*([\s\S]*?)(?=General:|Pulmonary:|Abdomen:|Extremities:|$)/i),
        pulmonary: extract(/Pulmonary:\s*([\s\S]*?)(?=General:|Cardiac:|Abdomen:|Extremities:|$)/i),
        abdomen: extract(/Abdomen:\s*([\s\S]*?)(?=General:|Cardiac:|Pulmonary:|Extremities:|$)/i),
        extremities: extract(/Extremities:\s*([\s\S]*)/i),
    };
}

export function packPE(exam: FragmentedPhysicalExam): string {
    return `Admission Vitals: Temp: ${exam.temp} HR: ${exam.hr} Resp: ${exam.resp} O2Sat: ${exam.o2sat} General: ${exam.general} Cardiac: ${exam.cardiac} Pulmonary: ${exam.pulmonary} Abdomen: ${exam.abdomen} Extremities: ${exam.extremities}`;
}

function buildUpdatePayload(
    caseData: ClinicalCaseDetail,
    localForm: Partial<UpdateClinicalCaseRequest>
): UpdateClinicalCaseRequest {
    const createdBy = getCookie("userId") ?? caseData.createdBy;

    return {
        caseId: caseData.caseId,
        title: localForm.title ?? caseData.title,
        description: localForm.description ?? caseData.description,
        caseType: localForm.caseType ?? caseData.caseType,
        status: localForm.status ?? caseData.status,
        pe: localForm.pe ?? caseData.pe,
        symptom: localForm.symptom ?? caseData.symptom,
        medicalHistory: localForm.medicalHistory ?? caseData.medicalHistory,
        createdBy,
        eccId: localForm.eccId ?? caseData.eccId,
    };
}

interface Props {
    caseId: string;
}

export default function ClinicalCaseDetailFeature({ caseId }: Props) {
    const { caseData, loading, error, saving, refetch, saveCase, updateLab, updateRad } =
        useClinicalCaseDetail(caseId);

    const [activeTab, setActiveTab] = useState<DetailTab>("overview");
    const [localForm, setLocalForm] = useState<Partial<UpdateClinicalCaseRequest>>({});
    const isDirty = Object.keys(localForm).length > 0;

    const handleFieldChange = (key: keyof UpdateClinicalCaseRequest, value: string) => {
        setLocalForm((f) => ({ ...f, [key]: value }));
    };

    const handleSave = async () => {
        if (!isDirty || !caseData) return;
        console.log("[LOCAL FORM]Saving case with changes:", localForm);
        await saveCase(buildUpdatePayload(caseData, localForm));
        setLocalForm({});
    };

    const parsedExam = useMemo(() => {
        const raw = (localForm.pe ?? caseData?.pe) ?? "";
        return parsePE(raw);
    }, [localForm.pe, caseData?.pe]);

    const handleExamChange = (field: keyof FragmentedPhysicalExam, val: string) => {
        const updated = { ...parsedExam, [field]: val };
        handleFieldChange("pe", packPE(updated));
    };

    if (loading) {
        return (
            <section className="p-6">
                <div className="animate-pulse space-y-5">
                    <div className="h-20 bg-[#DDE7F0] rounded-xl" />
                    <div className="h-12 bg-[#DDE7F0] rounded-xl w-1/2" />
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-[#DDE7F0] rounded-xl" />)}
                    </div>
                    <div className="h-96 bg-[#DDE7F0] rounded-xl" />
                </div>
            </section>
        );
    }

    if (error || !caseData) {
        return (
            <section className="p-6 flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-base font-bold text-[#173B67]">Failed to Load Case</p>
                <p className="text-sm text-[#7F96AD]">{error ?? "Case not found"}</p>
                <button onClick={refetch} className="flex items-center gap-1.5 bg-[#1BA7D9] text-white px-4 py-2 rounded-[10px] text-sm font-semibold">
                    <RefreshCw className="w-4 h-4" /> Retry
                </button>
            </section>
        );
    }

    const fieldValue = (key: keyof UpdateClinicalCaseRequest): string =>
        (localForm[key] ?? (caseData as unknown as Record<string, unknown>)[key] as string) ?? "";

    return (
        <section className="p-6 space-y-5 font-inter text-sm text-[#4F6F94]">
            {/* Breadcrumb + Header */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#7F96AD] font-medium">
                        <Link
                            href="/expert/clinical-case"
                            className="hover:text-[#235697] flex items-center gap-1 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Clinical Cases
                        </Link>
                        <span className="text-[#DDE7F0]">/</span>
                        <span className="text-[#235697] font-bold font-mono">#{caseId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-[#173B67] tracking-tight">{caseData.title}</h1>
                        <CaseStatusBadge status={caseData.status} size="md" />
                    </div>
                    <p className="text-xs text-[#7F96AD]">
                        Last updated: {new Date(caseData.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        {" · "}by {caseData.createdByName}
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="flex items-center gap-1.5 bg-[#1BA7D9] hover:bg-[#1487AE] disabled:opacity-40 text-white px-4 py-2.5 rounded-[10px] font-semibold text-xs shadow-sm transition-all shrink-0"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isDirty ? "Save Changes" : "Saved"}
                </button>
            </div>

            {/* Main Two-column Layout */}
            <div className="flex flex-col xl:flex-row gap-5 items-start">
                {/* Left: Tabs Content */}
                <div className="flex-1 min-w-0">
                    {/* Tab Nav */}
                    <CaseDetailTabNav
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        labCount={caseData.labs.length}
                        radCount={caseData.radiology.length}
                    />

                    {/* Tab Panel */}
                    <div className="bg-white border border-[#DDE7F0] rounded-b-xl rounded-r-xl p-6 shadow-sm -mt-px">
                        {activeTab === "overview" && (
                            <TabOverview
                                caseData={caseData}
                                localForm={localForm}
                                onFieldChange={handleFieldChange}
                            />
                        )}
                        {activeTab === "symptoms" && (
                            <TabSymptoms
                                symptom={fieldValue("symptom")}
                                medicalHistory={fieldValue("medicalHistory")}
                                onFieldChange={handleFieldChange}
                            />
                        )}
                        {activeTab === "exam" && (
                            <TabPhysicalExam exam={parsedExam} onFieldChange={handleExamChange} />
                        )}
                        {activeTab === "labs" && (
                            <TabLabs labs={caseData.labs} onUpdateLab={updateLab} />
                        )}
                        {activeTab === "radiology" && (
                            <TabRadiology radiology={caseData.radiology} onUpdateRad={updateRad} />
                        )}
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-full xl:w-80 shrink-0">
                    <CaseDetailSidebar caseData={caseData} />
                </div>
            </div>
        </section>
    );
}

interface FormFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    multiline?: boolean;
    rows?: number;
}

function FormField({ label, value, onChange, multiline, rows = 3 }: FormFieldProps) {
    const inputClass =
        "w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2.5 px-3 text-xs text-[#173B67] outline-none focus:border-[#1BA7D9] focus:bg-white transition-all leading-relaxed";
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider block">{label}</label>
            {multiline ? (
                <textarea className={inputClass} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input className={inputClass} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    );
}