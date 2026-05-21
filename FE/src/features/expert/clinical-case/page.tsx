"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, FileText, User, Activity, ClipboardList, Layers, ChevronDown, ChevronUp } from "lucide-react";

// Định nghĩa Interface khớp chính xác 100% với cấu trúc bảng `clinical_case` trong SQL
interface ClinicalCaseEntity {
    caseId: string;        // case_id VARCHAR(50) PRIMARY KEY
    title: string;         // title TEXT NOT NULL
    description: string;   // description TEXT
    type: string;          // type TEXT (E.g., "APPENDICITIS", "ABDOMINAL_PAIN")
    status: string;        // status VARCHAR(50)
    pe: string;            // pe TEXT (Physical Examination)
    symptom: string;       // symptom TEXT
    medicalhistory: string;// medicalhistory TEXT
    createdBy: string;     // created_by VARCHAR(50) NOT NULL (Expert ID)
    eccid: string;         // eccid VARCHAR(50) NOT NULL (Evaluation Clinical Criteria ID)
    createdAt: string;     // created_at TIMESTAMP
    updatedAt: string;     // updated_at TIMESTAMP
}

const INITIAL_CLINICAL_CASES: ClinicalCaseEntity[] = [
    {
        caseId: "CAS-27892518",
        title: "Acute Appendicitis Presentation",
        description: "Classic presentation of acute appendicitis with progressive localized distress.",
        type: "APPENDICITIS",
        status: "Published",
        pe: "Abdominal examination reveals localized tenderness in the right lower quadrant (McBurney's point). Guarding is present, rebound tenderness is highly positive. Bowel sounds are diminished.",
        symptom: "Right lower quadrant abdominal pain, anorexia, low-grade fever, and mild episodes of vomiting.",
        medicalhistory: "History of intermittent gastroesophageal reflux disease (GERD) and seasonal allergies. No prior abdominal surgeries.",
        createdBy: "EXP-001",
        eccid: "ECC-STANDARD-V2",
        createdAt: "2026-05-15T09:00:00Z",
        updatedAt: "2026-05-15T09:12:00Z"
    },
    {
        caseId: "CAS-27892519",
        title: "Right lower quadrant pain case",
        description: "Differential diagnosis challenge isolating early stage appendicitis exceptions.",
        type: "ABDOMINAL_PAIN",
        status: "Draft",
        pe: "Mild tenderness across the lower abdominal quadrant. No severe rebound rigidity mapped.",
        symptom: "Vague periumbilical pain shifting toward the lower right side over a 12-hour window.",
        medicalhistory: "No significant history of major co-morbidities.",
        createdBy: "EXP-001",
        eccid: "ECC-CRITERIA-V1",
        createdAt: "2026-05-16T10:00:00Z",
        updatedAt: "2026-05-16T10:30:00Z"
    }
];

export default function ClinicalCaseFeature() {
    const [cases] = useState<ClinicalCaseEntity[]>(INITIAL_CLINICAL_CASES);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

    // Xử lý bộ lọc tìm kiếm theo thuộc tính case_id hoặc title
    const filteredCases = useMemo(() => {
        return cases.filter(c => 
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [cases, searchQuery]);

    const toggleRowExpansion = (id: string) => {
        setExpandedCaseId(prev => (prev === id ? null : id));
    };

    return (
        <section className="p-6 space-y-6 text-xs font-medium text-slate-700">
            {/* Header Module Title & Context */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">Clinical Knowledge Scenarios (clinical_case)</h1>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <span>Dashboard</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-[#235697] font-bold">Clinical Cases Management</span>
                </div>
            </div>

            {/* List Control Block */}
            <div className="bg-white rounded-xl p-6 shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by case_id, title, or pathology type..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-800 outline-none focus:border-[#1BA7D9] transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-[#1BA7D9] text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-[#235697] transition-all whitespace-nowrap">
                        <Plus size={14} strokeWidth={2.5} /> Instantiate Case Schema
                    </button>
                </div>

                {/* Main Relational Table */}
                <div className="overflow-x-auto no-scrollbar">
                    <div className="w-full min-w-[850px] space-y-3">
                        {/* Table Header Row Representation */}
                        <div className="grid grid-cols-12 px-4 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                            <div className="col-span-2">Case Identifier</div>
                            <div className="col-span-4">Schema Title</div>
                            <div className="col-span-2">Pathology Core (type)</div>
                            <div className="col-span-2">Criteria Bound (eccid)</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-1 text-center">Inspect</div>
                        </div>

                        {/* Table Body Iteration Rows */}
                        {filteredCases.map((c) => {
                            const isExpanded = expandedCaseId === c.caseId;
                            return (
                                <div key={c.caseId} className="bg-white border border-gray-100 rounded-xl shadow-xs hover:border-blue-100 transition-all flex flex-col">
                                    {/* Row Summary Segment */}
                                    <div 
                                        onClick={() => toggleRowExpansion(c.caseId)}
                                        className="grid grid-cols-12 px-4 py-3.5 items-center cursor-pointer select-none"
                                    >
                                        <div className="col-span-2 font-mono font-bold text-[#235697]">{c.caseId}</div>
                                        <div className="col-span-4 pr-4">
                                            <div className="font-bold text-slate-800 truncate" title={c.title}>{c.title}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5 font-normal truncate">{c.description}</div>
                                        </div>
                                        <div className="col-span-2 font-mono font-bold text-slate-500">{c.type}</div>
                                        <div className="col-span-2 font-mono text-slate-600 font-semibold">{c.eccid}</div>
                                        <div className="col-span-1">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                                c.status === "Published" ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-400"
                                            }`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <div className="col-span-1 flex justify-center text-slate-400">
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {/* Expanded Operational Workspace Pane (Báo cáo đầy đủ mọi Attribute trong bảng) */}
                                    {isExpanded && (
                                        <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-slate-50/50 rounded-b-xl space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-semibold text-slate-500">
                                                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-gray-100">
                                                    <User size={14} className="text-gray-400" />
                                                    Created By: <strong className="text-slate-800 font-mono font-bold ml-1">{c.createdBy}</strong>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-gray-100">
                                                    <ClipboardList size={14} className="text-gray-400" />
                                                    Created Time: <strong className="text-slate-700 ml-1">{c.createdAt}</strong>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white p-2 rounded-lg border border-gray-100">
                                                    <Layers size={14} className="text-gray-400" />
                                                    Last Mutated: <strong className="text-slate-700 ml-1">{c.updatedAt}</strong>
                                                </div>
                                            </div>

                                            {/* Trường dữ liệu TEXT đặc thù cấu trúc y khoa */}
                                            <div className="space-y-3.5">
                                                <div>
                                                    <span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px] mb-1">Symptom Log (symptom)</span>
                                                    <p className="p-3 bg-white border border-gray-100 rounded-lg text-slate-800 leading-relaxed font-medium">{c.symptom}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px] mb-1">Physical Examination (pe)</span>
                                                    <p className="p-3 bg-white border border-gray-100 rounded-lg text-slate-800 leading-relaxed font-medium">{c.pe}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px] mb-1">Medical History Matrix (medicalhistory)</span>
                                                    <p className="p-3 bg-white border border-gray-100 rounded-lg text-slate-800 leading-relaxed font-medium">{c.medicalhistory}</p>
                                                </div>
                                            </div>

                                            {/* Nút trigger chỉnh sửa biểu mẫu */}
                                            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-end gap-2">
                                                <button className="px-3 py-1.5 bg-white border border-gray-200 text-slate-600 rounded-lg font-bold hover:bg-gray-50 transition-all">Cancel</button>
                                                <button className="px-4 py-1.5 bg-[#235697] text-white font-extrabold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-2xs">Modify Case Schema</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}