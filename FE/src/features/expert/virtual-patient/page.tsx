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
import type {
    VirtualPatientSummary,
    VPStatus,
    CreateVPFormState,
    VPSortDir,
} from "@/src/types/virtual-patient-expert";
import { VPSortDir as VPSortDirEnum } from "@/src/types/virtual-patient-expert";
import { RefreshCw } from "lucide-react";

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
                            {" "}of <span className="font-bold text-slate-700">{total}</span> patients
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