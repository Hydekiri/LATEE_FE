"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, Download, Eye, Trash2 } from "lucide-react";

interface ClinicalCaseEntity {
    caseId: string;        
    title: string;         
    description: string;   
    type: string;          
    status: string;        
    pe: string;            
    symptom: string;       
    medicalhistory: string;
    createdBy: string;     
    eccid: string;         
    createdAt: string;     
    updatedAt: string;     
}

const INITIAL_CLINICAL_CASES: ClinicalCaseEntity[] = [
    {
        caseId: "27892518",
        title: "Acute Appendicitis Presentation",
        description: "A patient came to the hospital for evaluation of abdominal symptoms, and was subsequently diagnosed with appendicitis",
        type: "APPENDICITIS",
        status: "active",
        pe: "Admission Vitals: Temp: 98 HR: 112 Resp: 16 O2Sat: 97% General: No acute distress; alert and fully oriented Abdomen: Soft, non-distended, acutely tender to palpation in the right lower quadrant; (+) rebound.",
        symptom: "Patient presents with complaint of right lower quadrant/flank abdominal pain since this morning.",
        medicalhistory: "Past Medical History: Asthma, HT, neuropathy in bilateral legs and arm for multiple years, GERD.",
        createdBy: "USR-EXP-001",
        eccid: "CRIT-001",
        createdAt: "2026-05-15T09:00:00Z",
        updatedAt: "2026-05-15T09:12:00Z"
    },
    {
        caseId: "21807759",
        title: "Acute Appendicitis Operational Differential",
        description: "A patient came to the hospital for evaluation of abdominal symptoms, and was subsequently diagnosed with acute appendicitis",
        type: "ACUTE APPENDICITIS",
        status: "active",
        pe: "Guarding on the right side of the abdomen and some mild right lower quadrant tenderness.",
        symptom: "History of prostate cancer presents with a 2 day history of abdominal pain which began with a periumbilical burning sensation.",
        medicalhistory: "Past Medical History: PMH: Prostate Cancer.",
        createdBy: "USR-EXP-001",
        eccid: "CRIT-001",
        createdAt: "2026-05-16T10:00:00Z",
        updatedAt: "2026-05-16T10:30:00Z"
    }
];

export default function ClinicalCaseFeature() {
    const router = useRouter();
    const [cases] = useState<ClinicalCaseEntity[]>(INITIAL_CLINICAL_CASES);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCases = useMemo(() => {
        return cases.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.caseId.includes(searchQuery) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cases, searchQuery]);

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
                        <button className="flex items-center gap-1.5 border border-[#DDE7F0] text-[#4F6F94] px-3 py-2 rounded-[10px] text-xs font-semibold hover:bg-[#EDF6FB] transition-all">
                            <Filter size={14} /> Filter
                        </button>
                        <button className="flex items-center gap-1.5 border border-[#DDE7F0] text-[#4F6F94] px-3 py-2 rounded-[10px] text-xs font-semibold hover:bg-[#EDF6FB] transition-all">
                            <Download size={14} /> Export
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
                                <th className="pb-1">Pathology Core (type)</th>
                                <th className="pb-1">Criteria Bound (eccid)</th>
                                <th className="pb-1">Lifecycle State</th>
                                <th className="pb-1 text-center pr-4 w-[120px]">Execution Workspace</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#173B67] font-semibold">
                            {filteredCases.map((c) => (
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
                                        {c.type}
                                    </td>
                                    <td className="py-3.5 border-y border-[#DDE7F0] bg-white font-mono text-slate-500">
                                        {c.eccid}
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
            </div>
        </section>
    );
}