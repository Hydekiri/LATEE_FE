"use client";

import React, { useState, useCallback } from "react";
import { Search, Plus, RefreshCw, LayoutGrid, List } from "lucide-react";
import { useClinicalCases } from "@/src/hooks/useClinicalCases";
import { useClinicalCaseFilters } from "@/src/hooks/useClinicalCaseFilters";
import { useClinicalCaseActions } from "@/src/hooks/useClinicalCaseActions";
import { CaseFilterBar } from "./components/CaseFilterBar";
import { CaseStatsBanner } from "./components/CaseStatsBanner";
import { CaseCard } from "./components/CaseCard";
import { CaseTableRow } from "./components/CaseTableRow";
import { CaseSkeletonCard } from "./components/CaseSkeletonCard";
import { CaseSkeletonRow } from "./components/CaseSkeletonCard";
import { CaseEmptyState } from "./components/CaseEmptyState";
import { CreateCaseModal } from "./components/CreateCaseModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";
import { ClinicalCaseStatus } from "@/src/types/clinical-case";
import type { CreateClinicalCaseRequest, ClinicalCaseSummary } from "@/src/types/clinical-case";

type LayoutMode = "grid" | "table";

export default function ClinicalCaseFeature() {
    const { filters, setSearch, setStatus, setType, setEccid, setSortBy, setSortDir, resetFilters, toParams } =
        useClinicalCaseFilters();

    const params = toParams();
    const { items, total, page, totalPages, availableFilters, loading, error, refetch, setPage } =
        useClinicalCases(params);

    const { actionLoading, createCase, deleteCase, updateStatus, duplicateCase } = useClinicalCaseActions();

    const [layout, setLayout] = useState<LayoutMode>("grid");
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const [localItems, setLocalItems] = useState<ClinicalCaseSummary[]>([]);
    const displayItems = localItems.length > 0 && localItems.length === items.length ? localItems : items;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLocalItems(items);
        }, 0);

        return () => clearTimeout(timer);
    }, [items]);

    const handleCreate = useCallback(async (payload: CreateClinicalCaseRequest) => {
        const result = await createCase(payload);
        if (result) {
            setCreateOpen(false);
            refetch();
        }
    }, [createCase, refetch]);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        await deleteCase(deleteTarget, () => {
            setDeleteTarget(null);
            refetch();
        });
    }, [deleteCase, deleteTarget, refetch]);

    const handleStatusChange = useCallback(
        async (id: string, status: ClinicalCaseStatus) => {
            await updateStatus(id, status, (fn) => {
                setLocalItems((prev) => prev.map((item) => item.caseId === id ? fn(item) : item));
            });
        },
        [updateStatus]
    );

    const handleDuplicate = useCallback(async (id: string) => {
        await duplicateCase(id, () => refetch());
    }, [duplicateCase, refetch]);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <section className="p-6 space-y-5 font-inter text-sm text-[#4F6F94]">
            {/* Page Header */}
            <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-[#173B67] tracking-tight">Clinical Scenarios Workspace</h1>
                    <div className="flex items-center gap-1.5 text-xs text-[#7F96AD] font-medium mt-1">
                        <span>Dashboard</span>
                        <span className="text-[#DDE7F0]">/</span>
                        <span className="text-[#235697] font-bold">Clinical Cases Management</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={refetch}
                        className="flex items-center gap-1.5 border border-[#DDE7F0] text-[#4F6F94] px-3 py-2 rounded-[10px] text-xs font-semibold hover:bg-[#EDF6FB] transition-all"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-1.5 bg-[#1BA7D9] hover:bg-[#1487AE] text-white px-4 py-2 rounded-[10px] text-xs font-bold shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        New Case
                    </button>
                </div>
            </div>

            {/* Stats Banner */}
            <CaseStatsBanner
                total={total}
                loading={loading}
                availableFilters={availableFilters}
                items={displayItems}
            />

            {/* Main Content Card */}
            <div className="bg-blue-50 border border-[#DDE7F0] rounded-xl shadow-md overflow-hidden">
                {/* Search + Layout Toolbar */}
                <div className="p-5 border-b border-[#DDE7F0] space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F96AD] w-4 h-4" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, case ID, or type..."
                                className="w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2 pl-10 pr-4 text-xs text-[#173B67] placeholder:text-[#7F96AD] outline-none focus:border-[#1BA7D9] focus:bg-white transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#7F96AD] font-medium shrink-0">
                                {loading ? "Loading..." : `${total} results`}
                            </span>
                            <div className="flex border border-[#DDE7F0] rounded-[10px] overflow-hidden">
                                <button
                                    onClick={() => setLayout("grid")}
                                    className={`p-2 transition-colors ${layout === "grid" ? "bg-[#235697] text-white" : "text-[#7F96AD] hover:bg-[#EDF6FB]"}`}
                                    title="Grid view"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setLayout("table")}
                                    className={`p-2 transition-colors ${layout === "table" ? "bg-[#235697] text-white" : "text-[#7F96AD] hover:bg-[#EDF6FB]"}`}
                                    title="Table view"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <CaseFilterBar
                        filters={filters}
                        available={availableFilters}
                        onStatusChange={setStatus}
                        onTypeChange={setType}
                        onEccidChange={setEccid}
                        onSortByChange={setSortBy}
                        onSortDirChange={setSortDir}
                        onReset={resetFilters}
                    />
                </div>

                {/* Content Area */}
                <div className="p-5">
                    {error ? (
                        <CaseEmptyState type="error" message={error} onRetry={refetch} />
                    ) : layout === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => <CaseSkeletonCard key={i} />)
                                : displayItems.length === 0
                                    ? <div className="col-span-full"><CaseEmptyState onCreateNew={() => setCreateOpen(true)} /></div>
                                    : displayItems.map((item) => (
                                        <CaseCard
                                            key={item.caseId}
                                            item={item}
                                            onDelete={(id) => setDeleteTarget(id)}
                                            onDuplicate={handleDuplicate}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                            }
                        </div>
                    ) : (
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full border-separate border-spacing-y-2 text-left text-xs min-w-225">
                                <thead>
                                    <tr className="text-[#7F96AD] font-extrabold text-[11px] tracking-wider uppercase">
                                        <th className="pb-1 pl-4 w-30">Case ID</th>
                                        <th className="pb-1">Title</th>
                                        <th className="pb-1">Type</th>
                                        <th className="pb-1">ECCID</th>
                                        <th className="pb-1">Updated</th>
                                        <th className="pb-1">Status</th>
                                        <th className="pb-1 text-right pr-4 w-40">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading
                                        ? Array.from({ length: 8 }).map((_, i) => <CaseSkeletonRow key={i} />)
                                        : displayItems.length === 0
                                            ? (
                                                <tr>
                                                    <td colSpan={7}>
                                                        <CaseEmptyState onCreateNew={() => setCreateOpen(true)} />
                                                    </td>
                                                </tr>
                                            )
                                            : displayItems.map((item) => (
                                                <CaseTableRow
                                                    key={item.caseId}
                                                    item={item}
                                                    onDelete={(id) => setDeleteTarget(id)}
                                                    onDuplicate={handleDuplicate}
                                                    onStatusChange={handleStatusChange}
                                                />
                                            ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="px-5 pb-5 flex items-center justify-between">
                        <span className="text-xs text-[#7F96AD]">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-1">
                            {pages.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === page
                                            ? "bg-[#235697] text-white shadow-sm"
                                            : "border border-[#DDE7F0] text-[#4F6F94] hover:bg-[#EDF6FB]"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateCaseModal
                key={createOpen ? "create-case-open" : "create-case-closed"}
                open={createOpen}
                loading={actionLoading}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />
            <DeleteConfirmModal
                open={deleteTarget !== null}
                caseId={deleteTarget ?? ""}
                loading={actionLoading}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </section>
    );
}