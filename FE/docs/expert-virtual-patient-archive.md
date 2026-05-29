# Expert Virtual Patient — Archived Source

This file archives the source code related to the Expert Virtual Patient feature prior to removal.

---

## File: FE/src/app/expert/virtual-patient/page.tsx
```tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import VirtualPatientFeature from "@/src/features/expert/virtual-patient/page";

export const metadata: Metadata = {
    title: "Virtual Patient Console — Lavender Teeducation",
    description: "Manage AI simulation personas, configure clinical scenarios, monitor simulation readiness.",
};

export default async function VirtualPatientPage() {
    const isLoggedIn = await checkIsExpertLoggedIn();
    if (!isLoggedIn) redirect("/login");

    return <VirtualPatientFeature />;
}
```

## File: FE/src/app/expert/virtual-patient/[id]/page.tsx
```tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import VirtualPatientDetailFeature from "@/src/features/expert/virtual-patient/detail";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `Patient ${resolvedParams.id} — Virtual Patient Console`,
        description: "Configure AI persona, vital signs, simulation logic, and learning objectives.",
    };
}

export default async function VirtualPatientDetailPage({ params }: Props) {
    const isLoggedIn = await checkIsExpertLoggedIn();
    if (!isLoggedIn) redirect("/login");

    const resolvedParams = await params;
    return <VirtualPatientDetailFeature patientId={resolvedParams.id} />;
}
```

## File: FE/src/features/expert/virtual-patient/page.tsx
```tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useVirtualPatientFilters } from "@/src/hooks/useVirtualPatientFilters";
import { useVirtualPatients } from "@/src/hooks/useVirtualPatients";
import { useVirtualPatientActions } from "@/src/hooks/useVirtualPatientActions";
import { VPFilterBar } from "./components/VPFilterBar";
import { VPStatsBanner } from "./components/VPStatsBanner";
import { VPTableRow } from "./components/VPTableRow";
import { VPSkeletonRow } from "./components/VPSkeletonRow";
import { VPEmptyState } from "./components/VPEmptyState";
import { CreateVPModal } from "./components/CreateVPModal";
import { DeleteVPModal } from "./components/DeleteVPModal";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { RefreshCw } from "lucide-react";
import { getCurrentExpertId } from "@/src/utils/cookies";
import type {
    VirtualPatientSummary,
    VPStatus,
    CreateVPFormState,
    VPSortDir,
} from "@/src/types/virtual-patient-expert";
import { VPSortDir as VPSortDirEnum } from "@/src/types/virtual-patient-expert";

const TABLE_HEADERS = [
    { key: "patientId", label: "Patient ID", className: "w-36" },
    { key: "name", label: "Name", className: "w-48" },
    { key: "chiefConcern", label: "Chief Concern", className: "flex-1" },
    { key: "status", label: "Status", className: "w-24" },
    { key: "level", label: "Level", className: "w-28" },
    { key: "stats", label: "Attempts/Score", className: "w-28 text-center" },
    { key: "createdAt", label: "Created", className: "w-28" },
    { key: "actions", label: "", className: "w-12" },
] as const;

interface DeleteTarget {
    patientId: string;
    patientName: string;
}

export default function VirtualPatientFeature() {
    const router = useRouter();

    // Filters
    const {
        filters, setSearch, setStatus, setLevel, setGender, setCaseId,
        setSortBy, setSortDir, resetFilters, toParams,
    } = useVirtualPatientFilters();

    // Data
    const params = useMemo(() => toParams(), [toParams]);
    const {
        items, total, page, pageSize, totalPages,
        availableFilters, loading, error, refetch, setPage,
    } = useVirtualPatients(params);

    // Actions
    const {
        actionLoading, actionError, createPatient, deletePatient,
        duplicatePatient, updateStatus, clearError,
    } = useVirtualPatientActions();

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

    const hasActiveFilters = !!(filters.search || filters.status || filters.level || filters.gender || filters.caseId);

    const handleSortDirToggle = useCallback(() => {
        setSortDir(
            filters.sortDir === VPSortDirEnum.Desc ? VPSortDirEnum.Asc : VPSortDirEnum.Desc
        );
    }, [filters.sortDir, setSortDir]);

    const handleCreate = useCallback(async (form: CreateVPFormState) => {
        const result = await createPatient({
            name: form.name,
            caseId: form.caseId,
            age: typeof form.age === "number" ? form.age : 0,
            gender: form.gender as Parameters<typeof createPatient>[0]["gender"],
            pronouns: form.pronouns,
            ethnicity: form.ethnicity,
            occupation: form.occupation,
            chiefConcern: form.chiefConcern,
            medicalHistory: form.medicalHistory,
            symptom: form.symptom,
            level: form.level as Parameters<typeof createPatient>[0]["level"],
            timeSetting: typeof form.timeSetting === "number" ? form.timeSetting : 30,
            argumentTime: typeof form.argumentTime === "number" ? form.argumentTime : 15,
            status: form.status,
        });
        if (result) {
            setIsCreateOpen(false);
            refetch();
            router.push(`/expert/virtual-patient/${result.patientId}`);
        }
    }, [createPatient, refetch, router]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteTarget) return;
        await deletePatient(deleteTarget.patientId, () => {
            setDeleteTarget(null);
            refetch();
        });
    }, [deleteTarget, deletePatient, refetch]);

    const handleStatusChange = useCallback((id: string, status: VPStatus) => {
        void updateStatus(id, status, (fn) => {
            void fn;
        });
        setTimeout(() => refetch(), 400);
    }, [updateStatus, refetch]);

    const handleDuplicate = useCallback((id: string) => {
        void duplicatePatient(id, () => refetch());
    }, [duplicatePatient, refetch]);

    const pages = useMemo(() => {
        const arr: number[] = [];
        for (let i = 1; i <= totalPages; i++) arr.push(i);
        return arr;
    }, [totalPages]);

    return (
        <section className="p-6 space-y-5 min-h-screen bg-linear-to-r from-[#1BA7D9] to-[#235697]">

            {/* ── Page Header ── */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Virtual Patient Console
                    </h1>
                    <p className="text-sm text-white/80 mt-0.5 font-medium">
                        Manage AI simulation personas, configure clinical scenarios, monitor simulation readiness
                    </p>
                </div>
                <button
                    onClick={refetch}
                    className="flex items-center gap-1.5 bg-white border border-white/30 text-[#1BA7D9] px-3 py-2 rounded-[10px] text-xs font-semibold hover:bg-[#1BA7D9] hover:text-white transition-all"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* ── Stats Banner ── */}
            <VPStatsBanner total={total} loading={loading} />

            {/* ── Action Error ── */}
            {actionError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium flex items-center justify-between">
                    <span>{actionError}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 font-bold text-xs">Dismiss</button>
                </div>
            )}

            {/* ── Filter Bar ── */}
            <VPFilterBar
                filters={filters}
                availableFilters={availableFilters}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onLevelChange={setLevel}
                onCaseIdChange={setCaseId}
                onGenderChange={setGender}
                onSortByChange={setSortBy}
                onSortDirToggle={handleSortDirToggle}
                onReset={resetFilters}
                onCreate={() => setIsCreateOpen(true)}
                hasActiveFilters={hasActiveFilters}
            />

            {/* ── Table Container ── */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm overflow-hidden">

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" role="table" aria-label="Virtual patients table">
                        <thead>
                            <tr className="border-b border-slate-100 bg-[#F8FAFC]">
                                {TABLE_HEADERS.map((h) => (
                                    <th
                                        key={h.key}
                                        className={`px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 ${h.className}`}
                                    >
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Loading */}
                            {loading && Array.from({ length: pageSize }).map((_, i) => (
                                <VPSkeletonRow key={i} />
                            ))}

                            {/* Error */}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={8}>
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                                                <ExclamationCircleIcon className="w-7 h-7 text-red-400" />
                                            </div>
                                            <p className="text-red-500 font-semibold text-sm text-center px-4">{error}</p>
                                            <button
                                                onClick={refetch}
                                                className="px-5 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Empty */}
                            {!loading && !error && items.length === 0 && (
                                <VPEmptyState
                                    hasFilters={hasActiveFilters}
                                    onReset={resetFilters}
                                    onCreate={() => setIsCreateOpen(true)}
                                />
                            )}

                            {/* Rows */}
                            {!loading && !error && items.map((item: VirtualPatientSummary) => (
                                <VPTableRow
                                    key={item.patientId}
                                    item={item}
                                    onDelete={(id) => setDeleteTarget({ patientId: id, patientName: item.name })}
                                    onDuplicate={handleDuplicate}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {!loading && !error && totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-[#F8FAFC]">
                        <p className="text-xs text-slate-400 font-medium">
                            Showing{" "}
                            <span className="font-bold text-slate-700">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}</span>
                            {" " }of <span className="font-bold text-slate-700">{total}</span> patients
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page <= 1}
                                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-500 hover:border-[#235697] hover:text-[#235697] disabled:opacity-30 transition-all"
                            >
                                ← Prev
                            </button>
                            {pages.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${p === page
                                            ? "bg-[#235697] text-white shadow-sm"
                                            : "border border-slate-200 text-slate-500 hover:border-[#235697] hover:text-[#235697]"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-500 hover:border-[#235697] hover:text-[#235697] disabled:opacity-30 transition-all"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            <CreateVPModal
                isOpen={isCreateOpen}
                isLoading={actionLoading}
                error={actionError}
                onSubmit={handleCreate}
                onClose={() => { setIsCreateOpen(false); clearError(); }}
            />

            <DeleteVPModal
                isOpen={deleteTarget !== null}
                isLoading={actionLoading}
                patientId={deleteTarget?.patientId ?? ""}
                patientName={deleteTarget?.patientName ?? ""}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeleteTarget(null)}
            />
        </section>
    );
}
```

## File: FE/src/features/expert/virtual-patient/detail.tsx
```tsx
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
                                : "bg-[#235697] text-white hover:bg-[#1BA7D9] shadow-sm"
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
```

## Components — extracted

### File: FE/src/features/expert/virtual-patient/components/VPFilterBar.tsx
```tsx
"use client";

import React, { useRef, useCallback } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, Plus, RotateCcw } from "lucide-react";
import type { VPActiveFilters, VPFiltersAvailable } from "@/src/types/virtual-patient-expert";
import { VPStatus, VPLevel, VPGender, VPSortField, VPSortDir } from "@/src/types/virtual-patient-expert";

const STATUS_OPTIONS: { value: VPStatus | ""; label: string }[] = [
    { value: "", label: "All Status" },
    { value: VPStatus.Active, label: "Active" },
    { value: VPStatus.Draft, label: "Draft" },
    { value: VPStatus.Published, label: "Published" },
    { value: VPStatus.Archived, label: "Archived" },
];

const LEVEL_OPTIONS: { value: VPLevel | ""; label: string }[] = [
    { value: "", label: "All Levels" },
    { value: VPLevel.Beginner, label: "Beginner" },
    { value: VPLevel.Intermediate, label: "Intermediate" },
    { value: VPLevel.Advanced, label: "Advanced" },
];

const GENDER_OPTIONS: { value: VPGender | ""; label: string }[] = [
    { value: "", label: "All Genders" },
    { value: VPGender.Male, label: "Male" },
    { value: VPGender.Female, "label": "Female" },
];

const SORT_OPTIONS: { value: VPSortField; label: string }[] = [
    { value: VPSortField.CreatedAt, label: "Newest First" },
    { value: VPSortField.UpdatedAt, label: "Recently Updated" },
    { value: VPSortField.Name, label: "Name A→Z" },
    { value: VPSortField.Level, label: "Level" },
];

interface VPFilterBarProps {
    readonly filters: VPActiveFilters;
    readonly availableFilters: VPFiltersAvailable | null;
    readonly onSearchChange: (v: string) => void;
    readonly onStatusChange: (v: VPStatus | "") => void;
    readonly onLevelChange: (v: VPLevel | "") => void;
    readonly onGenderChange: (v: VPGender | "") => void;
    readonly onSortByChange: (v: VPSortField) => void;
    readonly onSortDirToggle: () => void;
    readonly onReset: () => void;
    readonly onCreate: () => void;
    readonly hasActiveFilters: boolean;
    readonly onCaseIdChange: (v: string) => void;
}

export function VPFilterBar({
    filters, availableFilters,
    onSearchChange, onStatusChange, onLevelChange,
    onGenderChange, onSortByChange, onSortDirToggle,
    onReset, onCreate, hasActiveFilters, onCaseIdChange,
}: VPFilterBarProps) {
    const searchRef = useRef<HTMLInputElement>(null);

    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            onSearchChange("");
            searchRef.current?.blur();
        }
    }, [onSearchChange]);

    return (
        <div className="bg-white border border-[#DDE7F0] rounded-xl px-5 py-4 shadow-sm space-y-3">
            {/* Row 1: Search + Create */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        ref={searchRef}
                        type="text"
                        value={filters.search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search by name, ID, case, concern..."
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg
                                text-slate-700 placeholder-slate-400 outline-none
                                focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10
                                transition-all bg-slate-50 hover:bg-white"
                        aria-label="Search virtual patients"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {hasActiveFilters && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
                                    border border-slate-200 rounded-lg text-slate-500
                                    hover:border-red-200 hover:text-red-500 transition-all"
                            aria-label="Reset filters"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={onCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-sm
                                font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm
                                focus:outline-none focus:ring-2 focus:ring-[#235697]/30"
                        aria-label="Create new virtual patient"
                    >
                        <Plus className="w-4 h-4" />
                        New Patient
                    </button>
                </div>
            </div>

            {/* Row 2: Filter chips */}
            <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                {/* Status */}
                <select
                    value={filters.status}
                    onChange={(e) => onStatusChange(e.target.value as VPStatus | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by status"
                >
                    {STATUS_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Level */}
                <select
                    value={filters.level}
                    onChange={(e) => onLevelChange(e.target.value as VPLevel | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by level"
                >
                    {LEVEL_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Gender */}
                <select
                    value={filters.gender}
                    onChange={(e) => onGenderChange(e.target.value as VPGender | "")}
                    className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                            text-slate-600 bg-slate-50 hover:bg-white transition-all
                            focus:outline-none focus:border-[#235697] cursor-pointer"
                    aria-label="Filter by gender"
                >
                    {GENDER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                {/* Case filter */}
                {(availableFilters?.availableCaseIds ?? []).length > 0 && (
                    <select
                        value={filters.caseId}
                        onChange={(e) => onCaseIdChange(e.target.value)}
                        className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                                text-slate-600 bg-slate-50 hover:bg-white transition-all
                                focus:outline-none focus:border-[#235697] cursor-pointer"
                        aria-label="Filter by clinical case"
                    >
                        <option value="">All Cases</option>
                        {availableFilters?.availableCaseIds.map((id) => (
                            <option key={id} value={id}>Case #{id}</option>
                        ))}
                    </select>
                )}

                {/* Sort */}
                <div className="flex items-center gap-1 ml-auto">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={filters.sortBy}
                        onChange={(e) => onSortByChange(e.target.value as VPSortField)}
                        className="text-xs font-semibold border border-slate-200 rounded-lg px-3 py-1.5
                                text-slate-600 bg-slate-50 hover:bg-white transition-all
                                focus:outline-none focus:border-[#235697] cursor-pointer"
                        aria-label="Sort by"
                    >
                        {SORT_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <button
                        onClick={onSortDirToggle}
                        className="p-1.5 border border-slate-200 rounded-lg text-slate-400
                                hover:border-[#235697] hover:text-[#235697] transition-all"
                        aria-label={`Sort direction: ${filters.sortDir}`}
                        title={filters.sortDir === VPSortDir.Desc ? "Descending" : "Ascending"}
                    >
                        <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${filters.sortDir === VPSortDir.Asc ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/VPRowActions.tsx
```tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    MoreVertical, Eye, Edit3, Copy, Archive,
    Trash2, Globe, FileText,
} from "lucide-react";
import type { VirtualPatientSummary, VPStatus } from "@/src/types/virtual-patient-expert";
import { VPStatus as VPStatusEnum } from "@/src/types/virtual-patient-expert";

interface VPRowActionsProps {
    readonly item:           VirtualPatientSummary;
    readonly onDelete:       (id: string) => void;
    readonly onDuplicate:    (id: string) => void;
    readonly onStatusChange: (id: string, status: VPStatus) => void;
}

export function VPRowActions({ item, onDelete, onDuplicate, onStatusChange }: VPRowActionsProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) close();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, close]);

    const isPublished = item.status === VPStatusEnum.Published;
    const isArchived  = item.status === VPStatusEnum.Archived;

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Row actions"
                aria-haspopup="true"
                aria-expanded={open}
                className={[
                    "p-1.5 rounded-[8px] transition-all outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[#1BA7D9]",
                    open
                        ? "bg-[#235697]/10 text-[#235697]"
                        : "text-[#7F96AD] hover:bg-[#EDF6FB] hover:text-[#235697]",
                ].join(" ")}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-9 z-50 w-52 bg-white border border-[#DDE7F0] rounded-xl shadow-lg py-1.5 text-xs font-semibold text-[#4F6F94] overflow-hidden">

                    {/* View */}
                    <Link
                        href={`/expert/virtual-patient/${item.patientId}`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5 text-[#235697]" />
                        View Detail
                    </Link>

                    {/* Edit */}
                    <Link
                        href={`/expert/virtual-patient/${item.patientId}?edit=true`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Edit3 className="w-3.5 h-3.5 text-[#235697]" />
                        Edit Patient
                    </Link>

                    {/* Duplicate */}
                    <button
                        onClick={() => { onDuplicate(item.patientId); close(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Copy className="w-3.5 h-3.5 text-[#235697]" />
                        Duplicate
                    </button>

                    <div className="my-1 border-t border-[#DDE7F0]" />

                    {/* Publish */}
                    {!isPublished && !isArchived && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Published); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] text-[#235697] transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Publish
                        </button>
                    )}

                    {/* Unpublish */}
                    {isPublished && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Draft); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5 text-[#235697]" />
                            Unpublish → Draft
                        </button>
                    )}

                    {/* Archive */}
                    {!isArchived && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Archived); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5 text-[#235697]" />
                            Archive
                        </button>
                    )}

                    <div className="my-1 border-t border-[#DDE7F0]" />

                    {/* Delete */}
                    <button
                        onClick={() => { onDelete(item.patientId); close(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/CreateVPModal.tsx
```tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Loader2, Search, Check } from "lucide-react";
import { useClinicalCaseSearch } from "@/src/hooks/useClinicalCaseSearch";
import type { CreateVPFormState, ClinicalCaseSummary } from "@/src/types/virtual-patient-expert";
import { VPStatus, VPLevel, VPGender, DEFAULT_VP_FORM } from "@/src/types/virtual-patient-expert";

interface CreateVPModalProps {
    readonly isOpen:    boolean;
    readonly isLoading: boolean;
    readonly error:     string | null;
    readonly onSubmit:  (form: CreateVPFormState) => void;
    readonly onClose:   () => void;
}

export function CreateVPModal({ isOpen, isLoading, error, onSubmit, onClose }: CreateVPModalProps) {
    const [form, setForm] = useState<CreateVPFormState>(DEFAULT_VP_FORM);
    const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);
    const [selectedCaseTitle, setSelectedCaseTitle] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { query, results, searching, setQuery, clearSearch } = useClinicalCaseSearch(350);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCaseDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setForm(DEFAULT_VP_FORM);
                clearSearch();
                setSelectedCaseTitle("");
            }, 0);
        }
    }, [isOpen, clearSearch]);

    const handleCaseSelect = useCallback((c: ClinicalCaseSummary) => {
        setForm((prev) => ({ ...prev, caseId: c.caseId }));
        setSelectedCaseTitle(c.title);
        setCaseDropdownOpen(false);
        clearSearch();
    }, [clearSearch]);

    const setField = useCallback(<K extends keyof CreateVPFormState>(
        key: K, value: CreateVPFormState[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        setForm(DEFAULT_VP_FORM);
        clearSearch();
        setSelectedCaseTitle("");
        onClose();
    }, [isLoading, onClose, clearSearch]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    }, [form, onSubmit]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Create virtual patient"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-black text-slate-800">New Virtual Patient</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Create a new AI simulation persona</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Clinical Case — Searchable Autocomplete */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                            Clinical Case <span className="text-red-400">*</span>
                        </label>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-[#235697] focus-within:border-[#235697] focus-within:ring-2 focus-within:ring-[#235697]/10 transition-all"
                                onClick={() => setCaseDropdownOpen(true)}
                            >
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    value={caseDropdownOpen ? query : selectedCaseTitle || form.caseId}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        if (!caseDropdownOpen) setCaseDropdownOpen(true);
                                    }}
                                    onFocus={() => setCaseDropdownOpen(true)}
                                    placeholder="Search clinical cases by title or ID..."
                                    className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                                />
                                {searching && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />}
                                {form.caseId && !caseDropdownOpen && (
                                    <span className="text-xs text-slate-400 font-mono shrink-0">#{form.caseId}</span>
                                )}
                            </div>

                            {caseDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                                    {results.length === 0 && !searching && query.trim() && (
                                        <div className="px-4 py-3 text-sm text-slate-400 text-center">
                                            No cases found for &ldquo;{query}&rdquo;
                                        </div>
                                    )}
                                    {results.length === 0 && !searching && !query.trim() && (
                                        <div className="px-4 py-3 text-sm text-slate-400 text-center">
                                            Type to search clinical cases...
                                        </div>
                                    )}
                                    {results.map((c: ClinicalCaseSummary) => (
                                        <button
                                            key={c.caseId}
                                            type="button"
                                            onClick={() => handleCaseSelect(c)}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#F4F7FB] transition-colors border-b border-slate-50 last:border-0"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 truncate">{c.title}</p>
                                                <p className="text-xs text-slate-400 font-mono">#{c.caseId} · {c.type} · {c.status}</p>
                                            </div>
                                            {form.caseId === c.caseId && (
                                                <Check className="w-4 h-4 text-[#235697] shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row: Name */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                            Patient Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            required
                            placeholder="e.g. Richard Anderson"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all"
                        />
                    </div>

                    {/* Row: Age + Gender + Level */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Age</label>
                            <input
                                type="number"
                                value={form.age}
                                onChange={(e) => setField("age", e.target.value === "" ? "" : Number(e.target.value))}
                                min={1} max={120}
                                placeholder="43"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Gender</label>
                            <select
                                value={form.gender}
                                onChange={(e) => setField("gender", e.target.value as VPGender | "")}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value="">Select</option>
                                <option value={VPGender.Male}>Male</option>
                                <option value={VPGender.Female}>Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Level</label>
                            <select
                                value={form.level}
                                onChange={(e) => setField("level", e.target.value as VPLevel | "")}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value="">Select</option>
                                <option value={VPLevel.Beginner}>Beginner</option>
                                <option value={VPLevel.Intermediate}>Intermediate</option>
                                <option value={VPLevel.Advanced}>Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Row: Occupation + Ethnicity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Occupation</label>
                            <input
                                type="text"
                                value={form.occupation}
                                onChange={(e) => setField("occupation", e.target.value)}
                                placeholder="e.g. Warehouse worker"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Ethnicity</label>
                            <input
                                type="text"
                                value={form.ethnicity}
                                onChange={(e) => setField("ethnicity", e.target.value)}
                                placeholder="e.g. Hispanic"
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                    </div>

                    {/* Chief Concern */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">
                            Chief Concern <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.chiefConcern}
                            onChange={(e) => setField("chiefConcern", e.target.value)}
                            required
                            placeholder="e.g. Abdominal pain"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                        />
                    </div>

                    {/* Symptom */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Symptom</label>
                        <input
                            type="text"
                            value={form.symptom}
                            onChange={(e) => setField("symptom", e.target.value)}
                            placeholder="e.g. Right lower quadrant pain"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                        />
                    </div>

                    {/* Medical History */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Medical History</label>
                        <textarea
                            value={form.medicalHistory}
                            onChange={(e) => setField("medicalHistory", e.target.value)}
                            rows={3}
                            placeholder="Past medical history..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all resize-none"
                        />
                    </div>

                    {/* Row: Time Settings + Status */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">VP Time (min)</label>
                            <input
                                type="number"
                                value={form.timeSetting}
                                onChange={(e) => setField("timeSetting", e.target.value === "" ? "" : Number(e.target.value))}
                                min={5} max={120}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Reasoning (min)</label>
                            <input
                                type="number"
                                value={form.argumentTime}
                                onChange={(e) => setField("argumentTime", e.target.value === "" ? "" : Number(e.target.value))}
                                min={5} max={60}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setField("status", e.target.value as VPStatus)}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                            >
                                <option value={VPStatus.Draft}>Draft</option>
                                {/* <option value={VPStatus.Active}>Active</option> */}
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm disabled:opacity-50"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? "Creating..." : "Create Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/DeleteVPModal.tsx
```tsx
"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteVPModalProps {
    readonly isOpen:     boolean;
    readonly isLoading:  boolean;
    readonly patientId:  string;
    readonly patientName: string;
    readonly onConfirm:  () => void;
    readonly onClose:    () => void;
}

export function DeleteVPModal({
    isOpen, isLoading, patientId, patientName, onConfirm, onClose,
}: DeleteVPModalProps) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => { if (!isLoading) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-base">Delete Virtual Patient</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-bold text-slate-700">{patientName}</span>{" "}
                            <span className="font-mono text-xs text-slate-400">({patientId})</span>?
                            This action cannot be undone and will remove all associated simulation data.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? "Deleting..." : "Delete Patient"}
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/VPLevelBadge.tsx
```tsx
import React from "react";
import { VPLevel } from "@/src/types/virtual-patient-expert";

const LEVEL_CONFIG: Record<VPLevel, { label: string; className: string }> = {
    [VPLevel.Beginner]:     { label: "Beginner",     className: "bg-[#1BA7D9]/10 text-[#1BA7D9] border-[#1BA7D9]" },
    [VPLevel.Intermediate]: { label: "Intermediate", className: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]" },
    [VPLevel.Advanced]:     { label: "Advanced",     className: "bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]" },
};

interface VPLevelBadgeProps {
    readonly level: VPLevel;
    readonly size?: "sm" | "md";
}

export function VPLevelBadge({ level, size = "sm" }: VPLevelBadgeProps) {
    const config    = LEVEL_CONFIG[level] ?? LEVEL_CONFIG[VPLevel.Intermediate];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
    return (
        <span className={`inline-flex items-center rounded border font-bold ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/VPSkeletonRow.tsx
```tsx
export function VPSkeletonRow() {
    return (
        <tr className="animate-pulse border-b border-slate-100">
            <td className="px-4 py-3"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
            <td className="px-4 py-3"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
            <td className="px-4 py-3"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
            <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-100 rounded-full" /></td>
            <td className="px-4 py-3"><div className="h-5 w-20 bg-slate-100 rounded-full" /></td>
            <td className="px-4 py-3"><div className="h-4 w-10 bg-slate-100 rounded" /></td>
            <td className="px-4 py-3"><div className="h-4 w-10 bg-slate-100 rounded" /></td>
            <td className="px-4 py-3"><div className="h-8 w-8 bg-slate-100 rounded-lg" /></td>
        </tr>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/VPTableRow.tsx
```tsx
"use client";

import React, { memo } from "react";
import Link from "next/link";
import { VPStatusBadge } from "@/src/features/expert/virtual-patient/components/VPStatusBadge";
import { VPLevelBadge }  from "@/src/features/expert/virtual-patient/components/VPLevelBadge";
import { VPRowActions }  from "@/src/features/expert/virtual-patient/components/VPRowActions";
import type { VirtualPatientSummary, VPStatus } from "@/src/types/virtual-patient-expert";

interface VPTableRowProps {
    readonly item:          VirtualPatientSummary;
    readonly onDelete:      (id: string) => void;
    readonly onDuplicate:   (id: string) => void;
    readonly onStatusChange:(id: string, status: VPStatus) => void;
}

export const VPTableRow = memo(function VPTableRow({
    item, onDelete, onDuplicate, onStatusChange,
}: VPTableRowProps) {
    const createdLabel = new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });

    return (
        <tr className="border-b border-slate-100 hover:bg-[#F8FAFC] transition-colors group">
            {/* Patient ID */}
            <td className="px-4 py-3">
                <Link
                    href={`/expert/virtual-patient/${item.patientId}`}
                    className="font-black text-[#235697] text-sm hover:underline font-mono tracking-tight"
                >
                    {item.patientId}
                </Link>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Case #{item.caseId}</p>
            </td>

            {/* Name + Demographics */}
            <td className="px-4 py-3">
                <p className="font-bold text-slate-800 text-sm leading-tight">{item.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.age}y · {item.gender} · {item.occupation}
                </p>
            </td>

            {/* Chief Concern */}
            <td className="px-4 py-3 max-w-50">
                <p className="text-sm text-slate-600 truncate" title={item.chiefConcern}>
                    {item.chiefConcern}
                </p>
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <VPStatusBadge status={item.status} />
            </td>

            {/* Level */}
            <td className="px-4 py-3">
                <VPLevelBadge level={item.level} />
            </td>

            {/* Attempts / Score */}
            <td className="px-4 py-3 text-center">
                <p className="text-sm font-bold text-slate-700">{item.attemptCount}</p>
                {item.avgScore > 0 && (
                    <p className="text-[10px] text-[#1BA7D9] font-semibold">{item.avgScore.toFixed(1)}%</p>
                )}
            </td>

            {/* Created */}
            <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{createdLabel}</td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex justify-end"> 
                    <VPRowActions
                        item={item}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onStatusChange={onStatusChange}
                    />
                </div>
            </td>
        </tr>
    );
});
```

### File: FE/src/features/expert/virtual-patient/components/VPStatusBadge.tsx
```tsx
import React from "react";
import { VPStatus } from "@/src/types/virtual-patient-expert";

const STATUS_CONFIG: Record<VPStatus, { label: string; className: string }> = {
    [VPStatus.Active]: { label: "Active", className: "bg-[#299723]/10 text-[#299723] border-[#299723]" },
    [VPStatus.Draft]: { label: "Draft", className: "bg-[#DA741B]/10 text-[#DA741B] border-[#DA741B]" },
    [VPStatus.Archived]: { label: "Archived", className: "bg-[#D41F1F]/10 text-[#D41F1F] border-[#D41F1F]" },
    [VPStatus.Published]: { label: "Published", className: "bg-[#3B82F6]/10 text-[#235697] border-[#235697]" },
};

interface VPStatusBadgeProps {
    readonly status: VPStatus;
    readonly size?: "sm" | "md";
}

export function VPStatusBadge({ status, size = "sm" }: VPStatusBadgeProps) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[VPStatus.Draft];
    const sizeClass = size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
    return (
        <span className={`inline-flex items-center rounded border font-black uppercase tracking-wider ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/VPStatsBanner.tsx
```tsx
import React from "react";
import { UserCircle, Activity, BarChart2, Clock } from "lucide-react";
import { useVPStats } from "@/src/hooks/useVPStats";

interface VPStatsBannerProps {
    readonly total:   number;
    readonly loading: boolean;
}

export function VPStatsBanner({ total, loading }: VPStatsBannerProps) {
    const { published, active, archived, avgScore, statsLoading } = useVPStats();
    const stats = [
        {
            label: "Total Patients",
            value: loading ? "—" : total,
            icon: UserCircle,
            color: "text-[#235697] bg-[#235697]/10",
        },
        {
            label: "Active",
            value: statsLoading ? "—" : active,
            icon: Activity,
            color: "text-emerald-600 bg-emerald-50",
        },
        {
            label: "Published",
            value: statsLoading ? "—" : published,
            icon: BarChart2,
            color: "text-blue-600 bg-blue-50",
        },
        {
            label: "Archived",
            value: statsLoading ? "—" : archived,
            icon: Clock,
            color: "text-amber-600 bg-amber-50",
        },
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
```

### File: FE/src/features/expert/virtual-patient/components/VPEmptyState.tsx
```tsx
import React from "react";
import { UserCircle, Plus } from "lucide-react";

interface VPEmptyStateProps {
    readonly hasFilters: boolean;
    readonly onReset:   () => void;
    readonly onCreate:  () => void;
}

export function VPEmptyState({ hasFilters, onReset, onCreate }: VPEmptyStateProps) {
    return (
        <tr>
            <td colSpan={8}>
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#235697]/10 flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-[#235697]" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-700 text-base mb-1">
                            {hasFilters ? "No patients match your filters" : "No virtual patients yet"}
                        </p>
                        <p className="text-slate-400 text-sm max-w-xs">
                            {hasFilters
                                ? "Try adjusting your search or filter criteria."
                                : "Create your first AI virtual patient to begin building clinical simulations."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {hasFilters && (
                            <button
                                onClick={onReset}
                                className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
                            >
                                Clear filters
                            </button>
                        )}
                        <button
                            onClick={onCreate}
                            className="flex items-center gap-2 px-5 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Patient
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}
```

## Detail components

### File: FE/src/features/expert/virtual-patient/components/detail/VPDetailHeader.tsx
```tsx
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
                            {patient.stats.totalAttempts} attempts · Avg {patient.stats.avgScore?.toFixed(1)}%
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
```

### File: FE/src/features/expert/virtual-patient/components/detail/VPDetailSidebar.tsx
```tsx
"use client";

import React, { useState, useEffect } from "react";
import { Clock, Users, TrendingUp, Calendar, FileText, Save, Plus, X, Loader2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
interface VPDetailSidebarProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function VPDetailSidebar({ patient, onSave, saving }: VPDetailSidebarProps) {
    const createdLabel = new Date(patient.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
    const updatedLabel = new Date(patient.updatedAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    const totalAttempts  = patient.stats?.totalAttempts  ?? 0;
    const avgScore       = patient.stats?.avgScore       ?? 0;
    const completionRate = patient.stats?.completionRate ?? 0;
    const [timingDirty, setTimingDirty] = useState(false);
    const [newRule,    setNewRule]    = useState("");
    const [rulesDirty, setRulesDirty] = useState(false);

    const [timeSetting,  setTimeSetting]  = useState(() => patient.timeSetting);
    const [argumentTime, setArgumentTime] = useState(() => patient.argumentTime);
    const [rules,        setRules]        = useState<string[]>(() => [...(patient.caseRule?.rules ?? [])]);

    const handleTimingSave = async () => {
        await onSave({ ...buildVPBasePayload(patient), timeSetting, argumentTime });
        setTimingDirty(false);
    };

    const handleAddRule = () => {
        const trimmed = newRule.trim();
        if (!trimmed) return;
        setRules((prev) => [...prev, trimmed]);
        setNewRule("");
        setRulesDirty(true);
    };

    const handleRemoveRule = (i: number) => {
        setRules((prev) => prev.filter((_, idx) => idx !== i));
        setRulesDirty(true);
    };

    // const handleRulesSave = async () => {
    //     await onSave({
    //         ...buildBasePayload(),
    //         caseRule: rules.length > 0 ? { rules } : null,
    //     });
    //     setRulesDirty(false);
    // };

    return (
        <div className="space-y-4 sticky top-6">

            {/* Simulation Stats — read only */}
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

            {/* Timing Configuration — editable */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#235697]" /> Timing Configuration
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400 shrink-0">VP Interaction</span>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="number"
                                min={1} max={120}
                                value={timeSetting}
                                onChange={(e) => { setTimeSetting(Number(e.target.value)); setTimingDirty(true); }}
                                className="w-16 text-right text-sm font-black text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#235697]"
                            />
                            <span className="text-xs text-slate-400">min</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400 shrink-0">Reasoning Phase</span>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="number"
                                min={1} max={120}
                                value={argumentTime}
                                onChange={(e) => { setArgumentTime(Number(e.target.value)); setTimingDirty(true); }}
                                className="w-16 text-right text-sm font-black text-slate-800 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#235697]"
                            />
                            <span className="text-xs text-slate-400">min</span>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-600">Total Session</span>
                        <span className="text-sm font-black text-[#235697]">{timeSetting + argumentTime} min</span>
                    </div>
                    {timingDirty && (
                        <button
                            onClick={handleTimingSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-1.5 mt-1 px-3 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save Timing
                        </button>
                    )}
                </div>
            </div>

            {(patient.caseRule?.rules?.length ?? 0) > 0 && (
                <div className="bg-white border border-[#DDE7F0] rounded-xl shadow-sm p-5">
                    <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#235697]" /> Case Rules
                    </h3>
                    <ol className="space-y-2 list-decimal pl-4">
                        {patient.caseRule!.rules.map((rule, i) => (
                            <li key={i} className="text-xs text-slate-600 font-medium leading-relaxed">{rule}</li>
                        ))}
                    </ol>
                </div>
            )}

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
```

### File: FE/src/features/expert/virtual-patient/components/detail/TabVitals.tsx
```tsx
"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Activity } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest, VPVitalSigns } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
interface TabVitalsProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

const VITALS_FIELDS: {
    key: keyof VPVitalSigns;
    label: string;
    unit: string;
    placeholder: string;
    type: "text" | "number";
}[] = [
    { key: "bp",   label: "Blood Pressure",    unit: "mmHg",       placeholder: "114/91",  type: "text"   },
    { key: "hr",   label: "Heart Rate",         unit: "bpm",        placeholder: "79",      type: "number" },
    { key: "temp", label: "Temperature",        unit: "°C",         placeholder: "37.8",    type: "number" },
    { key: "spo2", label: "Oxygen Saturation",  unit: "% SpO2",     placeholder: "98%",     type: "text"   },
    { key: "rr",   label: "Respiratory Rate",   unit: "breaths/min",placeholder: "18",      type: "number" },
];

export function TabVitals({ patient, onSave, saving }: TabVitalsProps) {
    const [vitals, setVitals] = useState<VPVitalSigns>({ ...patient.vitalSigns });

    const [dirty, setDirty] = useState(false);

    const setVital = useCallback(<K extends keyof VPVitalSigns>(key: K, value: VPVitalSigns[K]) => {
        setVitals((prev) => ({ ...prev, [key]: value }));
        setDirty(true);
    }, []);

    const handleSave = useCallback(async () => {
        await onSave({ ...buildVPBasePayload(patient), vitalSigns: vitals });
        setDirty(false);
    }, [onSave, patient, vitals]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#235697]" />
                    <h3 className="text-base font-black text-slate-800">Vital Signs Configuration</h3>
                </div>
                {dirty && (
                    <button onClick={() => void handleSave()} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save Vitals"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VITALS_FIELDS.map(({ key, label, unit, placeholder, type }) => (
                    <div key={key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            {label}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type={type}
                                value={vitals[key]}
                                onChange={(e) => {
                                    const val = type === "number" ? Number(e.target.value) : e.target.value;
                                    setVital(key, val as VPVitalSigns[typeof key]);
                                }}
                                placeholder={placeholder}
                                step={type === "number" ? "0.1" : undefined}
                                className="flex-1 px-3 py-2 text-sm font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#235697] transition-all font-mono"
                            />
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">{unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-slate-400 italic">
                Vital signs are displayed to learners during the simulation. Ensure values are clinically plausible for the presented scenario.
            </p>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/detail/TabPersona.tsx
```tsx
"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
interface TabPersonaProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabPersona({ patient, onSave, saving }: TabPersonaProps) {
    const [emotionalState, setEmotionalState] = useState(patient.persona?.emotional_state ?? "");
    const [behaviors, setBehaviors] = useState((patient.behaviors ?? []).join("\n"));
    const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory ?? "");
    const [symptom, setSymptom] = useState(patient.symptom ?? "");
    const [dirty, setDirty] = useState(false); 

    const handleSave = useCallback(async () => {
        await onSave({
            ...buildVPBasePayload(patient),
            persona:       { emotional_state: emotionalState },
            behaviors:     behaviors.split("\n").map((b) => b.trim()).filter(Boolean),
            medicalHistory,
            symptom,
        });
        setDirty(false); 
    }, [onSave, patient, emotionalState, behaviors, medicalHistory, symptom]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">AI Persona Configuration</h3>
                {dirty && ( 
                    <button
                        onClick={() => void handleSave()}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>
            {/* Emotional State */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Emotional State (AI Actor)
                </label>
                <input
                    type="text"
                    value={emotionalState}
                    onChange={(e) => { setEmotionalState(e.target.value); setDirty(true); }}
                    placeholder="e.g. Anxious, Calm, Distressed"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">Controls the AI patient&apos;s emotional demeanor during simulation.</p>
            </div>

            {/* Behaviors */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Behavior Rules (one per line)
                </label>
                <textarea
                    value={behaviors}
                    onChange={(e) => { setBehaviors(e.target.value); setDirty(true); }}
                    rows={4}
                    placeholder={"Low pain tolerance\nGives brief answers initially\nResistant to invasive questions"}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all resize-none font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Each line becomes a distinct behavior constraint for the AI actor.</p>
            </div>

            {/* Symptom */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Primary Symptom Description
                </label>
                <input
                    type="text"
                    value={symptom}
                    onChange={(e) => { setSymptom(e.target.value); setDirty(true); }}
                    placeholder="e.g. Right lower quadrant pain"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                />
            </div>

            {/* Medical History */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Medical History
                </label>
                <textarea
                    value={medicalHistory}
                    onChange={(e) => { setMedicalHistory(e.target.value); setDirty(true); }}
                    rows={5}
                    placeholder="Past medical history, medications, allergies..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all resize-none"
                />
            </div>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/detail/TabLearningObjectives.tsx
```tsx
"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
interface TabLearningObjectivesProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabLearningObjectives({ patient, onSave, saving }: TabLearningObjectivesProps) {
    const [objectives, setObjectives] = useState<string[]>([...patient.learningObjectives]);
    const [dirty, setDirty] = useState(false);

    const add    = () => { setObjectives((o) => [...o, ""]); setDirty(true); };
    const remove = (i: number) => { setObjectives((o) => o.filter((_, idx) => idx !== i)); setDirty(true); };
    const setAt  = (i: number, v: string) => { setObjectives((o) => o.map((item, idx) => idx === i ? v : item)); setDirty(true); };

    const handleSave = useCallback(async () => {
        await onSave({ ...buildVPBasePayload(patient), learningObjectives: objectives.filter(Boolean) });
        setDirty(false);
    }, [onSave, patient, objectives]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Learning Objectives</h3>
                <div className="flex items-center gap-2">
                    <button onClick={add} className="flex items-center gap-1.5 px-3 py-2 border border-[#235697] text-[#235697] text-xs font-bold rounded-lg hover:bg-[#235697]/5 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Objective
                    </button>
                    {dirty && (
                        <button onClick={() => void handleSave()} disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm">
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            {saving ? "Saving..." : "Save"}
                        </button>
                    )}
                </div>
            </div>

            {objectives.length === 0 && (
                <div className="py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 text-sm font-medium mb-2">No learning objectives defined yet.</p>
                    <button onClick={add} className="text-[#235697] font-bold text-sm hover:underline">+ Add first objective</button>
                </div>
            )}

            <div className="space-y-2">
                {objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <span className="mt-2.5 text-[10px] font-black text-slate-400 w-5 shrink-0">{i + 1}.</span>
                        <textarea
                            value={obj}
                            onChange={(e) => setAt(i, e.target.value)}
                            rows={2}
                            placeholder={`Learning objective ${i + 1}`}
                            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all resize-none"
                        />
                        <button onClick={() => remove(i)} className="mt-2 p-1.5 text-slate-300 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {objectives.length > 0 && (
                <p className="text-xs text-slate-400 italic">
                    {objectives.length} objective{objectives.length !== 1 ? "s" : ""} configured. These are shown to learners on the case details page.
                </p>
            )}
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/detail/TabInstructions.tsx
```tsx
"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest, VPInstructions } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";

interface TabInstructionsProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabInstructions({ patient, onSave, saving }: TabInstructionsProps) {
    const [inst, setInst] = useState<VPInstructions>({ ...patient.instructions });
    const [procedure, setProcedure] = useState<string[]>([...patient.instructions.procedure]);
    
    // FIX TẠI ĐÂY: Dùng optional chaining để tránh lỗi trắng màn hình nếu caseRule bị null
    const [caseRules, setCaseRules] = useState<string[]>(
        patient.caseRule?.rules ? [...patient.caseRule.rules] : []
    );

    const [dirty, setDirty] = useState(false);

    const updateInstField = <K extends keyof VPInstructions>(k: K, v: VPInstructions[K]) => {
        setInst((prev) => ({ ...prev, [k]: v }));
        setDirty(true);
    };

    const addProcedure    = () => { setProcedure((p) => [...p, ""]);                                        setDirty(true); };
    const removeProcedure = (i: number) => { setProcedure((p) => p.filter((_, idx) => idx !== i));          setDirty(true); };
    const setProcedureAt  = (i: number, v: string) => { setProcedure((p) => p.map((item, idx) => idx === i ? v : item)); setDirty(true); };

    // Đã mở comment các hàm xử lý của caseRules
    const addRule    = () => { setCaseRules((r) => [...r, ""]);                                             setDirty(true); };
    const removeRule = (i: number) => { setCaseRules((r) => r.filter((_, idx) => idx !== i));               setDirty(true); };
    const setRuleAt  = (i: number, v: string) => { setCaseRules((r) => r.map((item, idx) => idx === i ? v : item)); setDirty(true); };

    const handleSave = useCallback(async () => {
        await onSave({
            ...buildVPBasePayload(patient),
            instructions: { ...inst, procedure },
            // FIX TẠI ĐÂY: Fallback object rỗng nếu patient.caseRule bị null
            caseRule: { ...(patient.caseRule || {}), rules: caseRules },
        });
        setDirty(false);
    }, [onSave, patient, inst, procedure, caseRules]); // Đã cập nhật caseRules vào mảng dependency

    const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Case Instructions</h3>
                {dirty && (
                    <button onClick={() => void handleSave()} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save"}
                    </button>
                )}
            </div>

            {/* Role + Tone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">Learner Role</label>
                    <input type="text" value={inst.role} onChange={(e) => updateInstField("role", e.target.value)} className={inputClass} placeholder="Medical Learner" />
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">AI Response Tone</label>
                    <input type="text" value={inst.tone} onChange={(e) => updateInstField("tone", e.target.value)} className={inputClass} placeholder="Short answers unless asked directly" />
                </div>
            </div>

            {/* Task */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">Task Description</label>
                <textarea
                    value={inst.task}
                    onChange={(e) => updateInstField("task", e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                    placeholder="Take a focused history from this patient..."
                />
            </div>

            {/* Procedure steps */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Procedure Steps</label>
                    <button onClick={addProcedure} className="flex items-center gap-1 text-xs text-[#235697] font-bold hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                </div>
                <div className="space-y-2">
                    {procedure.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 w-5 shrink-0">{i + 1}.</span>
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => setProcedureAt(i, e.target.value)}
                                className={inputClass}
                                placeholder={`Step ${i + 1}`}
                            />
                            <button onClick={() => removeProcedure(i)} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Case rules */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Case Rules</label>
                    <button onClick={addRule} className="flex items-center gap-1 text-xs text-[#235697] font-bold hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add Rule
                    </button>
                </div>
                <div className="space-y-2">
                    {caseRules.map((rule, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 w-5 shrink-0">{i + 1}.</span>
                            <input
                                type="text"
                                value={rule}
                                onChange={(e) => setRuleAt(i, e.target.value)}
                                className={inputClass}
                                placeholder={`Rule ${i + 1}`}
                            />
                            <button onClick={() => removeRule(i)} className="p-1.5 text-slate-300 hover:text-red-400 transition-colors shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

### File: FE/src/features/expert/virtual-patient/components/detail/TabExperts.tsx
```tsx
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
```

## Services

### File: FE/src/services/virtual-patient-expert-service.ts
```ts
import { clientApi, buildQueryString } from "@/src/utils/api-client";
import type {
    VirtualPatientSummary,
    VirtualPatientDetail,
    VPListParams,
    VPPaginatedResponse,
    CreateVPRequest,
    CreateVPResponse,
    UpdateVPRequest,
    UpdateVPResponse,
    UpdateVPStatusRequest,
    UpdateVPStatusResponse,
    DeleteVPResponse,
    DuplicateVPResponse,
    VPStatus,
} from "@/src/types/virtual-patient-expert";

const BASE = "/api/expert/virtual-patients";

export const virtualPatientExpertService = {
    list(params: VPListParams = {}): Promise<VPPaginatedResponse<VirtualPatientSummary>> {
        const qs = buildQueryString({
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 15,
            search: params.search ?? "",
            status: params.status ?? "",
            level: params.level ?? "",
            gender: params.gender ?? "",
            caseId: params.caseId ?? "",
            sortBy: params.sortBy ?? "",
            sortDir: params.sortDir ?? "",
        });
        return clientApi.get<VPPaginatedResponse<VirtualPatientSummary>>(`${BASE}${qs}`);
    },

    getById(id: string): Promise<VirtualPatientDetail> {
        return clientApi.get<VirtualPatientDetail>(`${BASE}/${id}`);
    },

    create(payload: CreateVPRequest): Promise<CreateVPResponse> {
        return clientApi.post<CreateVPResponse, CreateVPRequest>(BASE, payload);
    },

    update(id: string, payload: UpdateVPRequest): Promise<UpdateVPResponse> {
        return clientApi.put<UpdateVPResponse, UpdateVPRequest>(`${BASE}/${id}`, payload);
    },

    updateStatus(id: string, status: VPStatus): Promise<UpdateVPStatusResponse> {
        return clientApi.patch<UpdateVPStatusResponse, UpdateVPStatusRequest>(
            `${BASE}/${id}/status`,
            { status }
        );
    },

    delete(id: string): Promise<DeleteVPResponse> {
        return clientApi.delete<DeleteVPResponse>(`${BASE}/${id}?confirm=true`);
    },

    duplicate(id: string): Promise<DuplicateVPResponse> {
        return clientApi.post<DuplicateVPResponse, Record<string, never>>(
            `${BASE}/${id}/duplicate`,
            {}
        );
    },

    publish(id: string): Promise<UpdateVPStatusResponse> {
        return clientApi.patch<UpdateVPStatusResponse, Record<string, never>>(
            `${BASE}/${id}/publish`,
            {}
        );
    },
};
```

## Hooks

### File: FE/src/hooks/useVirtualPatientFilters.ts
```ts
"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    VPStatus,
    VPLevel,
    VPGender,
    VPSortField,
    VPSortDir,
    DEFAULT_VP_FILTERS,
    type VPActiveFilters,
    type VPListParams,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientFiltersReturn {
    filters: VPActiveFilters;
    setSearch: (v: string) => void;
    setStatus: (v: VPStatus | "") => void;
    setLevel: (v: VPLevel | "") => void;
    setGender: (v: VPGender | "") => void;
    setCaseId: (v: string) => void;
    setSortBy: (v: VPSortField) => void;
    setSortDir: (v: VPSortDir) => void;
    resetFilters: () => void;
    toParams: () => VPListParams;
}

export function useVirtualPatientFilters(): UseVirtualPatientFiltersReturn {
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<VPActiveFilters>(() => ({
        search: searchParams.get("search") ?? DEFAULT_VP_FILTERS.search,
        status: (searchParams.get("status") as VPStatus | "") ?? DEFAULT_VP_FILTERS.status,
        level: (searchParams.get("level") as VPLevel | "") ?? DEFAULT_VP_FILTERS.level,
        gender: (searchParams.get("gender") as VPGender | "") ?? DEFAULT_VP_FILTERS.gender,
        caseId: searchParams.get("caseId") ?? DEFAULT_VP_FILTERS.caseId,
        sortBy: (searchParams.get("sortBy") as VPSortField) ?? DEFAULT_VP_FILTERS.sortBy,
        sortDir: (searchParams.get("sortDir") as VPSortDir) ?? DEFAULT_VP_FILTERS.sortDir,
    }));

    const setSearch = useCallback((v: string) => setFilters((f) => ({ ...f, search: v })), []);
    const setStatus = useCallback((v: VPStatus | "") => setFilters((f) => ({ ...f, status: v })), []);
    const setLevel = useCallback((v: VPLevel | "") => setFilters((f) => ({ ...f, level: v })), []);
    const setGender = useCallback((v: VPGender | "") => setFilters((f) => ({ ...f, gender: v })), []);
    const setCaseId = useCallback((v: string) => setFilters((f) => ({ ...f, caseId: v })), []);
    const setSortBy = useCallback((v: VPSortField) => setFilters((f) => ({ ...f, sortBy: v })), []);
    const setSortDir = useCallback((v: VPSortDir) => setFilters((f) => ({ ...f, sortDir: v })), []);
    const resetFilters = useCallback(() => setFilters(DEFAULT_VP_FILTERS), []);
    const toParams = useCallback(() => filtersToParams(filters), [filters]);
    return {
        filters,
        setSearch, setStatus, setLevel, setGender, setCaseId,
        setSortBy, setSortDir, resetFilters, toParams,
    };
}

export function filtersToParams(filters: VPActiveFilters): VPListParams {
    return {
        search: filters.search || undefined,
        status: filters.status || undefined,
        level: filters.level || undefined,
        gender: filters.gender || undefined,
        caseId: filters.caseId || undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
    };
}
```

### File: FE/src/hooks/useVirtualPatients.ts
```ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientSummary,
    VPListParams,
    VPFiltersAvailable,
} from "@/src/types/virtual-patient-expert";

interface VirtualPatientsState {
    items: VirtualPatientSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    availableFilters: VPFiltersAvailable | null;
    loading: boolean;
    error: string | null;
}

interface UseVirtualPatientsReturn extends VirtualPatientsState {
    refetch: () => void;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

export function useVirtualPatients(params: VPListParams): UseVirtualPatientsReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        search,
        status,
        level,
        gender,
        caseId,
        sortBy,
        sortDir,
        pageSize: paramPageSize,
    } = params;

    const debouncedSearch = useDebounce(search ?? "", 350);
    const searchParamsRef = useRef(searchParams);
    useEffect(() => {
        searchParamsRef.current = searchParams;
    });

    const [state, setState] = useState<VirtualPatientsState>({
        items: [],
        total: 0,
        page: params.page ?? 1,
        pageSize: paramPageSize ?? 8,
        totalPages: 0,
        availableFilters: null,
        loading: true,
        error: null,
    });

    const abortRef = useRef<AbortController | null>(null);
    const fetchCountRef = useRef(0);
    const pageRef = useRef(params.page ?? 1);

    const prevFiltersRef = useRef({ debouncedSearch, status, level, gender, caseId });
    useEffect(() => {
        const prev = prevFiltersRef.current;
        if (
            prev.debouncedSearch !== debouncedSearch ||
            prev.status !== status ||
            prev.level !== level ||
            prev.gender !== gender ||
            prev.caseId !== caseId
        ) {
            pageRef.current = 1;
        }
        prevFiltersRef.current = { debouncedSearch, status, level, gender, caseId };
    }, [debouncedSearch, status, level, gender, caseId]);

    const fetchData = useCallback(async () => {
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        const currentFetch = ++fetchCountRef.current;

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const result = await virtualPatientExpertService.list({
                search: debouncedSearch || undefined,
                status: status || undefined,
                level: level || undefined,
                gender: gender || undefined,
                caseId: caseId || undefined,
                sortBy,
                sortDir,
                page: pageRef.current,
                pageSize: paramPageSize ?? 15,
            });

            if (currentFetch !== fetchCountRef.current) return;

            setState({
                items: result.items,
                total: result.total,
                page: result.page,
                pageSize: result.pageSize,
                totalPages: result.totalPages,
                availableFilters: result.filters ?? null,
                loading: false,
                error: null,
            });
            const sp = new URLSearchParams(searchParamsRef.current.toString());

            if (debouncedSearch) sp.set("search", debouncedSearch); else sp.delete("search");
            if (status) sp.set("status", status); else sp.delete("status");
            if (level) sp.set("level", level); else sp.delete("level");
            if (gender) sp.set("gender", gender); else sp.delete("gender");
            sp.set("page", String(result.page));

            router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
        } catch (err: unknown) {
            if (currentFetch !== fetchCountRef.current) return;
            setState((prev) => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : "Error",
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, status, level, gender, caseId, sortBy, sortDir, paramPageSize, router, pathname]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const setPage = useCallback((page: number) => {
        pageRef.current = page;
        void fetchData();
    }, [fetchData]);

    const setPageSize = useCallback((size: number) => {
        pageRef.current = 1;
        setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
    }, []);

    const refetch = useCallback(() => {
        void fetchData();
    }, [fetchData]);

    return { ...state, refetch, setPage, setPageSize };
}
```

### File: FE/src/hooks/useVirtualPatientDetail.ts
```ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientDetail,
    UpdateVPRequest,
    VPStatus,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientDetailReturn {
    patient: VirtualPatientDetail | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
    refetch: () => void;
    savePatient: (payload: UpdateVPRequest) => Promise<void>;
    updateStatus: (status: VPStatus) => Promise<void>;
}

export function useVirtualPatientDetail(id: string): UseVirtualPatientDetailReturn {
    const [patient, setPatient] = useState<VirtualPatientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await virtualPatientExpertService.getById(id);
            setPatient(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load virtual patient");
        } finally {
            setLoading(false);
        }
    }, [id]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchDetail();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchDetail]);

    const refetch = useCallback(() => {
        void fetchDetail();
    }, [fetchDetail]);

    const savePatient = useCallback(async (payload: UpdateVPRequest) => {
        setSaving(true);
        try {
            await virtualPatientExpertService.update(id, payload);
            await new Promise((r) => setTimeout(r, 300)); 
            await fetchDetail();
        } catch (err) {
            console.error("update error:", err);
        } finally {
            setSaving(false);
        }
    }, [id, fetchDetail]);

    const updateStatus = useCallback(async (status: VPStatus) => {
        setPatient((prev) => (prev ? { ...prev, status } : prev));
        try {
            await virtualPatientExpertService.updateStatus(id, status);
        } catch {
            await fetchDetail(); 
        }
    }, [id, fetchDetail]);

    return { patient, loading, error, saving, refetch, savePatient, updateStatus };
}
```

### File: FE/src/hooks/useVirtualPatientActions.ts
```ts
"use client";

import { useState, useCallback } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";
import type {
    VirtualPatientSummary,
    CreateVPRequest,
    CreateVPResponse,
    VPStatus,
} from "@/src/types/virtual-patient-expert";

interface UseVirtualPatientActionsReturn {
    actionLoading:    boolean;
    actionError:      string | null;
    createPatient:    (payload: CreateVPRequest) => Promise<CreateVPResponse | null>;
    deletePatient:    (id: string, onSuccess?: () => void) => Promise<void>;
    duplicatePatient: (id: string, onSuccess?: () => void) => Promise<void>;
    updateStatus: (
        id: string,
        status: VPStatus,
        mutateItem?: (fn: (item: VirtualPatientSummary) => VirtualPatientSummary) => void,
        onSettled?: () => void,
    ) => Promise<void>;
    publishPatient: (id: string, onSuccess?: () => void) => Promise<void>;
    clearError: () => void;
}

export function useVirtualPatientActions(): UseVirtualPatientActionsReturn {
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError,   setActionError]   = useState<string | null>(null);

    const clearError = useCallback(() => setActionError(null), []);

    const createPatient = useCallback(async (
        payload: CreateVPRequest,
    ): Promise<CreateVPResponse | null> => {
        setActionLoading(true);
        setActionError(null);
        try {
            return await virtualPatientExpertService.create(payload);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to create virtual patient");
            return null;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const deletePatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.delete(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to delete virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    const duplicatePatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.duplicate(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to duplicate virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (
        id: string,
        status: VPStatus,
        // Optional optimistic updater — kept for list-page usage
        mutateItem?: (fn: (item: VirtualPatientSummary) => VirtualPatientSummary) => void,
        // Called after the API resolves (success or failure) so the caller
        // can trigger a refetch at the right moment — no more blind setTimeout
        onSettled?: () => void,
    ): Promise<void> => {
        mutateItem?.((item) => ({ ...item, status }));
        setActionError(null);
        try {
            await virtualPatientExpertService.updateStatus(id, status);
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to update status");
            throw err;
        } finally {
            onSettled?.();
        }
    }, []);

    const publishPatient = useCallback(async (
        id: string,
        onSuccess?: () => void,
    ): Promise<void> => {
        setActionLoading(true);
        setActionError(null);
        try {
            await virtualPatientExpertService.publish(id);
            onSuccess?.();
        } catch (err: unknown) {
            setActionError(err instanceof Error ? err.message : "Failed to publish virtual patient");
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        actionLoading, actionError,
        createPatient, deletePatient, duplicatePatient,
        updateStatus, publishPatient, clearError,
    };
}
```

### File: FE/src/hooks/useVPStats.ts
```ts
import { useEffect, useState } from "react";
import { virtualPatientExpertService } from "@/src/services/virtual-patient-expert-service";

interface VPStats {
    active: number;
    published: number;
    archived: number;
    avgScore: number | null;
    statsLoading: boolean;
}

export function useVPStats(): VPStats {
    const [active, setActive] = useState(0);
    const [published, setPublished] = useState(0);
    const [archived, setArchived] = useState(0);
    const [avgScore, setAvgScore] = useState<number | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        virtualPatientExpertService
            .list({ pageSize: 200 })
            .then((res) => {
                const items = res.items;

                setActive(items.filter((p) => p.status === "active").length);
                setPublished(items.filter((p) => p.status === "published").length);
                setArchived(items.filter((p) => p.status === "archived").length);
                const scores = items
                    .map((p) => p.avgScore)
                    .filter((s): s is number => s !== null && s !== undefined);

                setAvgScore(
                    scores.length > 0
                        ? scores.reduce((a, b) => a + b, 0) / scores.length
                        : null
                );
            })
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, []);

    return { active, published, archived, avgScore, statsLoading };
}
```

## Types

### File: FE/src/types/virtual-patient-expert.ts
```ts

export enum VPStatus {
    Active = "active",
    Draft = "draft",
    Archived = "archived",
    Published = "published",
}

export enum VPLevel {
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced",
}

export enum VPSortField {
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
    Name = "name",
    Level = "level",
}

export enum VPSortDir {
    Asc = "asc",
    Desc = "desc",
}

export enum VPGender {
    Male = "MALE",
    Female = "FEMALE",
}


export interface VPVitalSigns {
    readonly bp: string;
    readonly hr: number;
    readonly temp: number;
    readonly spo2: string;
    readonly rr: number;
}

export interface VPInstructions {
    readonly role: string;
    readonly task: string;
    readonly tone: string;
    readonly procedure: readonly string[];
}

export interface VPCaseRule {
    readonly rules: readonly string[];
    readonly totalTime: string;
    readonly timeBreakdown: readonly string[];
}

export interface VPPersona {
    readonly emotional_state?: string;
    [key: string]: string | undefined;
}

export interface VPExpert {
    readonly expertId: string;
    readonly name: string;
    readonly role: string;
    readonly avatarUrl: string | null;
    readonly bioQuote?: string;
    readonly educationDetail?: string;
    readonly expertiseSkill?: string;
    readonly phone?: string;
    readonly email?: string;
    readonly location?: string;
}

export interface VPStats {
    readonly totalAttempts: number;
    readonly avgScore: number;
    readonly completionRate: number;
}


export interface VirtualPatientSummary {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly level: VPLevel;
    readonly status: VPStatus;
    readonly avatarImage: string | null;
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly attemptCount: number;
    readonly avgScore: number;
    readonly expertCount: number;
}


export interface VirtualPatientDetail {
    readonly patientId: string;
    readonly caseId: string;
    readonly name: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly pronouns: string;
    readonly ethnicity: string;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly medicalHistory: string;
    readonly symptom: string;
    readonly persona: VPPersona;
    readonly vitalSigns: VPVitalSigns;
    readonly instructions: VPInstructions;
    readonly behaviors: readonly string[];
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly learningObjectives: readonly string[];
    readonly level: VPLevel;
    readonly avatarImage: string | null;
    readonly caseRule: VPCaseRule;
    readonly status: VPStatus;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly experts: readonly VPExpert[];
    readonly stats: VPStats;
}


export interface VPFiltersAvailable {
    readonly availableStatuses: VPStatus[];
    readonly availableLevels: VPLevel[];
    readonly availableGenders: VPGender[];
    readonly availableCaseIds: string[];
}

export interface VPListParams {
    readonly page?: number;
    readonly pageSize?: number;
    readonly search?: string;
    readonly status?: VPStatus | "";
    readonly level?: VPLevel | "";
    readonly gender?: VPGender | "";
    readonly caseId?: string;
    readonly sortBy?: VPSortField;
    readonly sortDir?: VPSortDir;
}

export interface VPActiveFilters {
    search: string;
    status: VPStatus | "";
    level: VPLevel | "";
    gender: VPGender | "";
    caseId: string;
    sortBy: VPSortField;
    sortDir: VPSortDir;
}

// ─────────────────────────────────────────────
// Paginated Response
// ─────────────────────────────────────────────

export interface VPPaginatedResponse<T> {
    readonly items: T[];
    readonly total: number;
    readonly page: number;
    readonly pageSize: number;
    readonly totalPages: number;
    readonly filters?: VPFiltersAvailable;
}

// ─────────────────────────────────────────────
// Request DTOs
// ─────────────────────────────────────────────

export interface CreateVPRequest {
    readonly name: string;
    readonly caseId: string;
    readonly age: number;
    readonly gender: VPGender;
    readonly pronouns: string;
    readonly ethnicity: string;
    readonly occupation: string;
    readonly chiefConcern: string;
    readonly medicalHistory?: string;
    readonly symptom?: string;
    readonly level: VPLevel;
    readonly timeSetting: number;
    readonly argumentTime: number;
    readonly status: VPStatus;
    readonly avatarImage?: string | null;
    readonly persona?: VPPersona;
    readonly vitalSigns?: VPVitalSigns;
    readonly instructions?: VPInstructions;
    readonly behaviors?: string[];
    readonly learningObjectives?: string[];
    readonly caseRule?: VPCaseRule;
}

export type UpdateVPRequest = Partial<CreateVPRequest>;

export interface UpdateVPStatusRequest {
    readonly status: VPStatus;
}

// ─────────────────────────────────────────────
// Response DTOs
// ─────────────────────────────────────────────

export interface CreateVPResponse {
    readonly patientId: string;
    readonly name: string;
    readonly status: VPStatus;
    readonly createdAt: string;
}

export interface UpdateVPResponse {
    readonly patientId: string;
    readonly updatedAt: string;
}

export interface UpdateVPStatusResponse {
    readonly patientId: string;
    readonly status: VPStatus;
    readonly updatedAt: string;
}

export interface DeleteVPResponse {
    readonly success: boolean;
    readonly patientId: string;
}

export interface DuplicateVPResponse {
    readonly patientId: string;
    readonly name: string;
    readonly status: VPStatus;
    readonly createdAt: string;
}

// ─────────────────────────────────────────────
// UI / Form Types
// ─────────────────────────────────────────────

export interface CreateVPFormState {
    name: string;
    caseId: string;
    age: number | "";
    gender: VPGender | "";
    pronouns: string;
    ethnicity: string;
    occupation: string;
    chiefConcern: string;
    medicalHistory: string;
    symptom: string;
    level: VPLevel | "";
    timeSetting: number | "";
    argumentTime: number | "";
    status: VPStatus;
}

export const DEFAULT_VP_FORM: CreateVPFormState = {
    name: "",
    caseId: "",
    age: "",
    gender: "",
    pronouns: "",
    ethnicity: "",
    occupation: "",
    chiefConcern: "",
    medicalHistory: "",
    symptom: "",
    level: "",
    timeSetting: 30,
    argumentTime: 15,
    status: VPStatus.Draft,
};

export const DEFAULT_VP_FILTERS: VPActiveFilters = {
    search: "",
    status: "",
    level: "",
    gender: "",
    caseId: "",
    sortBy: VPSortField.CreatedAt,
    sortDir: VPSortDir.Desc,
};

```

## Utilities

### File: FE/src/utils/vp-payload.ts
```ts
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";

export function buildVPBasePayload(patient: VirtualPatientDetail): UpdateVPRequest {
    return {
        caseId:             patient.caseId,
        name:               patient.name,
        age:                patient.age,
        gender:             patient.gender,
        pronouns:           patient.pronouns,
        ethnicity:          patient.ethnicity,
        occupation:         patient.occupation,
        chiefConcern:       patient.chiefConcern,
        timeSetting:        patient.timeSetting,
        argumentTime:       patient.argumentTime,
        level:              patient.level,
        avatarImage:        patient.avatarImage?.startsWith("https://example.com")
                                ? undefined
                                : patient.avatarImage,
        persona:            patient.persona,
        vitalSigns:         patient.vitalSigns,
        instructions:       patient.instructions,
        behaviors:          patient.behaviors ? [...patient.behaviors] : [],
        medicalHistory:     patient.medicalHistory,
        symptom:            patient.symptom,
        learningObjectives: patient.learningObjectives ? [...patient.learningObjectives] : [],
    };
}
```

### File: FE/src/utils/patient-assets.ts
```ts
const getDeterministicRandom = (id: string, min: number, max: number): number => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % (max - min + 1);
    return min + index;
};
export function resolvePatientAvatar(img: string, id: string, age: number, gender: string): string {
    if (img && img.startsWith('http') && !img.includes('VP7.jpeg') && !img.includes('example.com')) {
        return img;
    }
    if (img && img.startsWith('/images') && !img.includes('VP7.jpeg')) {
        return img;
    }
    return getAvatarByAge(id, age, gender);
}

export const getAvatarByAge = (id: string, age: number, gender: string = "FEMALE"): string => {
    const g = gender.toUpperCase();
    let vpNumber: number;

    // 1. Trẻ em < 12 tuổi
    if (age < 12) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 15, 19); // MALE < 12: VP15-19
        } else {
            vpNumber = getDeterministicRandom(id, 19, 23); // FEMALE < 12: VP19-23
        }
    } 
    // 2. Thanh niên <= 30 tuổi
    else if (age <= 30) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 3, 9);   // MALE <= 30: VP3-9
        } else {
            vpNumber = getDeterministicRandom(id, 10, 14); // FEMALE <= 30: VP10-14
        }
    }
    // 3. Trung niên 31 - 55 tuổi
    else if (age <= 55) {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 32, 36); // MALE 31-55: VP32-36
        } else {
            vpNumber = getDeterministicRandom(id, 37, 41); // FEMALE 31-55: VP37-41
        }
    }
    // 4. Người già > 55 tuổi
    else {
        if (g === "MALE") {
            vpNumber = getDeterministicRandom(id, 28, 31); // MALE > 55: VP28-31
        } else {
            // FEMALE > 55: VP1 và VP24-27
            const pool = [1, 24, 25, 26, 27];
            const randomIndex = getDeterministicRandom(id, 0, pool.length - 1);
            vpNumber = pool[randomIndex];
        }
    }

    const extension = vpNumber <= 10 ? 'jpeg' : 'jpg';

    return `/images/VirtualPatient/VP${vpNumber}.${extension}`;
};
```

## Data examples

### File: FE/src/data/patient.ts
```ts
// // src/data/mockData.ts
// import { PatientData } from "@/src/types/practice";

// const abdominalIssues = [
//     "Acute appendicitis",
//     "Gallbladder inflammation",
//     "Irritable bowel syndrome (IBS)",
//     "Peptic ulcer pain",
//     "Acute pancreatitis",
//     "Small bowel obstruction"
// ];

// // Tạo dữ liệu tĩnh (Static Data) thay vì random mỗi lần render
// export const MOCK_PATIENTS: PatientData[] = Array.from({ length: 9 }).map((_, i) => ({
//     id: `PT00${i + 1}`,
//     img: `/images/VirtualPatient/VP${i + 1}.jpeg`, // Đảm bảo bạn có ảnh VP1.jpeg -> VP9.jpeg
//     level: "Level 1",
//     time: "10 - 20 mins",
//     occupation: i % 2 === 0 ? "Child" : "Old woman",
//     description: "Clinically relevant. Real-world scenarios tailored for medical students.",
//     chiefConcern: abdominalIssues[i % abdominalIssues.length], // Lấy tuần tự để cố định dữ liệu
//     date: "Sep 20, 2023",
//     feedback: 60 + i, // Fake số liệu cố định
// }));

// // Hàm helper để lấy bệnh nhân theo ID
// export const getPatientById = (id: string): PatientData | undefined => {
//     return MOCK_PATIENTS.find(p => p.id === id);
// };
```

---

End of archive.
