"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, Download, Eye, Trash2, ChevronDown } from "lucide-react";
import { CompleteClinicalCaseSchema } from "@/src/types/clinicalcase";
import { getPaginatedClinicalCases, exportClinicalCasesToExcel } from "@/src/services/expert-clinicalcase-service";
import { Pagination } from "./pagination";

export default function ClinicalCaseFeature() {
    const router = useRouter();
    const [cases, setCases] = useState<CompleteClinicalCaseSchema[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [showFilter, setShowFilter] = useState(false);
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState("desc");

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const fetchedCases = await getPaginatedClinicalCases("", "", "", "", "", "", 1, 20);

                setCases(fetchedCases);
                setTotal(fetchedCases.length);
            } catch (error) {
                console.error("Error fetching clinical cases:", error);
            }
        };

        fetchCases();
    }, []);

    const filteredCases = useMemo(() => {

        const base = cases.filter(c =>
            (c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.caseId.includes(searchQuery) ||
                c.caseType.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (status ? c.status === status : true)
        );

        const sorted = base.sort((a, b) => {
            const aValue = a[sortBy as keyof CompleteClinicalCaseSchema] || "";
            const bValue = b[sortBy as keyof CompleteClinicalCaseSchema] || "";
            if (aValue < bValue) return sortDir === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        const start = (page - 1) * pageSize;
        const casesToFilter = sorted.slice(start, start + pageSize);

        return casesToFilter;
    }, [cases, searchQuery, pageSize, page, status, sortBy, sortDir]);

    // HIỆU CHỈNH: Thêm dấu gạch ngang cho đúng với URL vật lý của Next.js app/expert/clinical-case/[id]
    const handleNavigateToDetail = (id: string) => {
        router.push(`/expert/clinical-case/${id}`);
    };

    return (
        <section className="p-6 space-y-6 font-inter text-sm text-[#4F6F94]">
            <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-5 shadow-sm">
                <h1 className="text-xl font-bold text-[#173B67] tracking-tight">Clinical Scenarios Manifest</h1>
                <div className="flex items-center gap-1.5 text-xs text-[#7F96AD] font-medium mt-1">
                    <span>Dashboard</span>
                    <span className="text-[#DDE7F0]">/</span>
                    <span className="text-[#235697] font-bold">Clinical Cases Management</span>
                </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-6 shadow-md space-y-5">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7F96AD] w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter data rows by exact case_id token or description..."
                            className="w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2 pl-10 pr-4 text-xs text-[#173B67] placeholder:text-[#7F96AD] outline-none focus:border-[#1BA7D9] focus:bg-[#FFFFFF] transition-all"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(v => !v)}
                                className="flex items-center gap-2 border border-[#DDE7F0] px-3 py-2 rounded-[10px]">
                                <Filter size={14} />
                                Filter
                                <ChevronDown size={14} />
                            </button>
                            {showFilter && (
                                <div className="absolute right-0 top-12 z-50 w-[320px] bg-white border rounded-xl shadow-xl p-4 space-y-4">
                                    <div>
                                        <label>Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">
                                                All
                                            </option>
                                            <option value="active">
                                                active
                                            </option>
                                            <option value="draft">
                                                draft
                                            </option>
                                            <option value="archived">
                                                archived
                                            </option>
                                            <option value="published">
                                                published
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) =>
                                                setSortBy(e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="createdAt">
                                                createdAt
                                            </option>
                                            <option value="updatedAt">
                                                updatedAt
                                            </option>
                                            <option value="title">
                                                title
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Direction</label>

                                        <select
                                            value={sortDir}
                                            onChange={(e) =>
                                                setSortDir(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="asc">
                                                asc
                                            </option>
                                            <option value="desc">
                                                desc
                                            </option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-[#1BA7D9] text-white rounded p-2"
                                            onClick={() =>
                                                setShowFilter(false)
                                            }
                                        >
                                            Apply
                                        </button>

                                        <button
                                            className="flex-1 border rounded p-2"
                                            onClick={() => {
                                                setStatus("");
                                                setSortBy("createdAt");
                                                setSortDir("desc");
                                            }}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )
                            }
                        </div>

                        <button
                            onClick={() => exportClinicalCasesToExcel(filteredCases)}
                            className="flex items-center gap-1.5 border border-[#DDE7F0] text-[#4F6F94] px-3 py-2 rounded-[10px]">
                            <Download size={14} />
                            Export
                        </button>
                        <button className="flex items-center gap-1.5 bg-[#1BA7D9] hover:bg-[#1487AE] text-white px-3 py-2 rounded-[10px] text-xs font-bold shadow-sm transition-all">
                            Instantiate New Case Block <Plus size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-separate border-spacing-y-2 text-left text-xs min-w-[850px]">
                        <thead>
                            <tr className="text-[#7F96AD] font-extrabold text-[11px] tracking-wider uppercase">
                                <th className="pb-1 pl-4 w-[120px]">Case ID</th>
                                <th className="pb-1">Descriptor Title</th>
                                <th className="pb-1">Pathology Core (caseType)</th>
                                <th className="pb-1">Criteria Bound (eccId)</th>
                                <th className="pb-1">Lifecycle State</th>
                                <th className="pb-1 text-center pr-4 w-[120px]">Execution Workspace</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#173B67] font-semibold">
                            {filteredCases?.map((c) => (
                                <tr
                                    key={c.caseId}
                                    className="bg-white border border-[#DDE7F0] rounded-xl shadow-xs hover:shadow-sm hover:border-[#1BA7D9]/30 transition-all group"
                                >
                                    <td className="py-3.5 pl-4 rounded-l-xl border-y border-l border-[#DDE7F0] bg-white font-mono font-bold text-[#235697]">
                                        {c.caseId}
                                    </td>
                                    <td className="py-3.5 border-y border-[#DDE7F0] bg-white pr-4">
                                        <div className="flex flex-col max-w-[280px]">
                                            <span
                                                onClick={() => handleNavigateToDetail(c.caseId)}
                                                className="font-bold text-[#173B67] hover:text-[#1BA7D9] hover:underline cursor-pointer truncate"
                                                title={c.title}
                                            >
                                                {c.title}
                                            </span>
                                            <span className="text-[10px] text-[#7F96AD] font-normal truncate mt-0.5">{c.description}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 border-y border-[#DDE7F0] bg-white font-mono text-[#4F6F94]">
                                        {c.caseType.slice(0, 20)}...
                                    </td>
                                    <td className="py-3.5 border-y border-[#DDE7F0] bg-white font-mono text-slate-500">
                                        {c.eccId}
                                    </td>
                                    <td className="py-3.5 border-y border-[#DDE7F0] bg-white">
                                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 rounded-r-xl border-y border-r border-[#DDE7F0] bg-white text-center pr-4">
                                        <div className="flex items-center justify-center gap-1.5 text-[#7F96AD]">
                                            <button
                                                onClick={() => handleNavigateToDetail(c.caseId)}
                                                className="p-1 hover:text-[#235697] hover:bg-[#EDF6FB] rounded transition-all flex items-center gap-1 font-bold text-xs"
                                                title="Inspect Schema Workspace"
                                            >
                                                <Eye size={14} /> <span className="text-[11px] text-[#1BA7D9]">Manage</span>
                                            </button>
                                            <div className="w-px h-3 bg-[#DDE7F0]" />
                                            <button className="p-1 hover:text-rose-500 hover:bg-rose-50 rounded transition-all" title="Purge Record">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    page={page}
                    setPage={setPage}
                    total={total}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                />
            </div>
        </section>
    );
}