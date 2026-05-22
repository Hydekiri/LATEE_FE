"use client";

import React, { useState, useMemo } from "react";
// ĐỒNG BỘ: Sử dụng hệ thống Solid Icons cao cấp từ Heroicons v2
import { 
    ArrowLeftIcon, 
    ArrowDownOnSquareIcon, 
    DocumentTextIcon, 
    BeakerIcon, 
    RadioIcon, 
    ClipboardDocumentListIcon, 
    ShieldCheckIcon, 
    UserIcon, 
    PlusIcon, 
    TrashIcon, 
    HeartIcon,
    PencilIcon 
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface LabTestItemJoined {
    id: number;              
    itemId: number;          
    label: string;           
    fluid: string;           
    category: 'Blood Gas' | 'Chemistry' | 'Hematology'; 
    value: string;           
    rangeLower: string;      
    rangeUpper: string;      
}

interface RadiologyReportEntity {
    id: number;              
    noteId: string;          
    modality: 'CT'|'Ultrasound'|'Radiograph'|'Drainage'|'MRI'|'MRCP'|'ERCP'; 
    region: string;          
    examName: string;        
    text: string;            
}

interface CompleteClinicalCaseSchema {
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
    labs: LabTestItemJoined[];
    radiology: RadiologyReportEntity[];
}

interface FragmentedPhysicalExam {
    temp: string;
    hr: string;
    resp: string;
    o2sat: string;
    general: string;
    cardiac: string;
    pulmonary: string;
    abdomen: string;
    extremities: string;
}

const INITIAL_CASE_CONTEXT: CompleteClinicalCaseSchema = {
    caseId: "27892518",
    title: "Acute Appendicitis Presentation",
    description: "A patient came to the hospital for evaluation of abdominal symptoms, and was subsequently diagnosed with appendicitis",
    type: "APPENDICITIS",
    status: "active",
    pe: "Admission Vitals: Temp: 98 HR: 112 Resp: 16 O2Sat: 97% General: No acute distress; alert and fully oriented Cardiac: Regular rate and rhythm; normal S1 and S2 Pulmonary: Lungs clear to auscultation bilaterally Abdomen: Soft, non-distended, acutely tender to palpation in the right lower quadrant; mild tenderness in the right upper quadrant; (+) rebound; (-) gaurding; (+) Rovsing/(+)Psoas signs Extremities: Warm and well-perfused",
    symptom: "I am a a while year old male with medical history for chronic lower back pain who now presents with complaint of right lower quadrant/flank abdominal pain since this morning.",
    medicalhistory: "Past Medical History: Asthma, HT, neuropathy in bilateral legs and arm for multiple years, GERD.",
    createdBy: "USR-EXP-001",
    eccid: "CRIT-001",
    labs: [
        { id: 1, itemId: 51301, label: "White Blood Cells", fluid: "Blood", category: "Hematology", value: "19.2 K/uL", rangeLower: "4.0", rangeUpper: "11.0" }
    ],
    radiology: [
        { id: 1, noteId: "10070247-RR", modality: "CT", region: "Abdomen", examName: "CT ABD & PELVIS WITH CONTRAST", text: "Enlarged and fluid-filled appendix measuring up to 2.1 cm with surrounding fat stranding." }
    ]
};

export default function ClinicalCaseDetailFeature({ caseId }: { caseId: string }) {
    const [caseData, setCaseData] = useState<CompleteClinicalCaseSchema>({
        ...INITIAL_CASE_CONTEXT,
        caseId: caseId 
    });
    const [activeTab, setActiveTab] = useState<"history" | "labs" | "radiology">("history");

    // Quản lý trạng thái focus động của từng trường nhập liệu (Dynamic Focus States Tracker)
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // ENGINE PARSER: Bóc tách chuỗi pe thô của DB ra các ô input độc lập ở FE
    const parsedExamState: FragmentedPhysicalExam = useMemo(() => {
        const raw = caseData.pe;
        const extract = (regex: RegExp, fallback: string = "") => {
            const match = raw.match(regex);
            return match && match[1] ? match[1].trim() : fallback;
        };

        return {
            temp: extract(/Temp:\s*([^\s;%]+)/i, "98"),
            hr: extract(/HR:\s*([^\s;%]+)/i, "112"),
            resp: extract(/Resp:\s*([^\s;%]+)/i, "16"),
            o2sat: extract(/O2Sat:\s*([^\s;%]+%?)/i, "97%"),
            general: extract(/General:\s*(.*?)(?=Cardiac:|Pulmonary:|Abdomen:|Extremities:|$)/i),
            cardiac: extract(/Cardiac:\s*(.*?)(?=General:|Pulmonary:|Abdomen:|Extremities:|$)/i),
            pulmonary: extract(/Pulmonary:\s*(.*?)(?=General:|Cardiac:|Abdomen:|Extremities:|$)/i),
            abdomen: extract(/Abdomen:\s*(.*?)(?=General:|Cardiac:|Pulmonary:|Extremities:|$)/i),
            extremities: extract(/Extremities:\s*(.*)/i)
        };
    }, [caseData.pe]);

    // Trích xuất dữ liệu gốc ban đầu của PE phục vụ việc so sánh trạng thái đổi màu nền (Dirty State Checking)
    const originalExamState = useMemo(() => {
        const raw = INITIAL_CASE_CONTEXT.pe;
        const extract = (regex: RegExp, fallback: string = "") => {
            const match = raw.match(regex);
            return match && match[1] ? match[1].trim() : fallback;
        };
        return {
            temp: extract(/Temp:\s*([^\s;%]+)/i, "98"),
            hr: extract(/HR:\s*([^\s;%]+)/i, "112"),
            resp: extract(/Resp:\s*([^\s;%]+)/i, "16"),
            o2sat: extract(/O2Sat:\s*([^\s;%]+%?)/i, "97%"),
            general: extract(/General:\s*(.*?)(?=Cardiac:|Pulmonary:|Abdomen:|Extremities:|$)/i),
            cardiac: extract(/Cardiac:\s*(.*?)(?=General:|Pulmonary:|Abdomen:|Extremities:|$)/i),
            pulmonary: extract(/Pulmonary:\s*(.*?)(?=General:|Cardiac:|Abdomen:|Extremities:|$)/i),
            abdomen: extract(/Abdomen:\s*(.*?)(?=General:|Cardiac:|Pulmonary:|Extremities:|$)/i),
            extremities: extract(/Extremities:\s*(.*)/i)
        };
    }, []);

    const handleExamFragmentChange = (field: keyof FragmentedPhysicalExam, val: string) => {
        const updated = { ...parsedExamState, [field]: val };
        const packedString = `Admission Vitals: Temp: ${updated.temp} HR: ${updated.hr} Resp: ${updated.resp} O2Sat: ${updated.o2sat} General: ${updated.general} Cardiac: ${updated.cardiac} Pulmonary: ${updated.pulmonary} Abdomen: ${updated.abdomen} Extremities: ${updated.extremities}`;
        setCaseData(prev => ({ ...prev, pe: packedString }));
    };

    const handleFieldChange = (key: keyof CompleteClinicalCaseSchema, value: string) => {
        setCaseData(prev => ({ ...prev, [key]: value }));
    };

    const handleLabValueChange = (id: number, value: string) => {
        setCaseData(prev => ({
            ...prev,
            labs: prev.labs.map(l => l.id === id ? { ...l, value } : l)
        }));
    };

    const handleRadiologyTextChange = (id: number, text: string) => {
        setCaseData(prev => ({
            ...prev,
            radiology: prev.radiology.map(r => r.id === id ? { ...r, text } : r)
        }));
    };

    const handleRemoveLab = (id: number) => {
        setCaseData(prev => ({ ...prev, labs: prev.labs.filter(l => l.id !== id) }));
    };

    const handleRemoveRadiology = (id: number) => {
        setCaseData(prev => ({ ...prev, radiology: prev.radiology.filter(r => r.id !== id) }));
    };

    const handleSaveWorkspace = () => {
        console.log("Saving dynamic packed architecture to DB:", caseData);
    };

    const getInputInteractiveClasses = (fieldKey: string, isDirty: boolean, baseStyle: string) => {
        const isFocused = focusedField === fieldKey;
        if (isFocused) return `${baseStyle} bg-white border-[#235697] text-[#173B67] ring-2 ring-[#235697]`;
        if (isDirty) return `${baseStyle} bg-amber-50/50 border-amber-200 text-amber-900`;
        return `${baseStyle}`;
    };

    const getPencilColorClass = (fieldKey: string, isDirty: boolean, defaultColor: string = "text-slate-300") => {
        if (focusedField === fieldKey) return "text-[#235697] ";
        if (isDirty) return "text-amber-500 animate-pulse";
        return defaultColor;
    };

    return (
        <section className="p-6 space-y-6 font-inter text-sm text-[#4F6F94]">
            
            {/* Top Operational Context Banner */}
            <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[#7F96AD] font-semibold text-xs">
                        <Link href="/expert/clinical-case" className="hover:text-[#235697] flex items-center gap-0.5 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" /> Clinical Cases
                        </Link>
                        <span>/</span>
                        <span className="text-[#235697] font-bold">Workspace Target: {caseId}</span>
                    </div>
                    <h1 className="text-xl font-bold text-[#173B67] tracking-tight">Modify Scenario Parameters</h1>
                </div>
                <button 
                    onClick={handleSaveWorkspace}
                    className="flex items-center gap-1.5 bg-[#1BA7D9] hover:bg-[#1487AE] text-white px-4 py-2.5 rounded-[10px] font-semibold text-xs shadow-sm transition-all active:scale-95"
                >
                    <ArrowDownOnSquareIcon className="w-4 h-4" /> Save Changes
                </button>
            </div>

            {/* Static Relational Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-[10px] bg-[#235697]/10 text-[#235697]">
                        <ClipboardDocumentListIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 relative group">
                        <span className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wide block">Pathology Base (type)</span>
                        <input 
                            type="text" 
                            value={caseData.type} 
                            onFocus={() => setFocusedField("type")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleFieldChange("type", e.target.value)} 
                            className={getInputInteractiveClasses("type", caseData.type !== INITIAL_CASE_CONTEXT.type, "w-full bg-transparent border-b border-transparent hover:border-[#DDE7F0] text-[#173B67] font-mono font-bold text-xs outline-none mt-0.5 pr-6 transition-all rounded px-1")}
                        />
                        <PencilIcon className={`w-3 h-3 absolute right-0 bottom-1.5 pointer-events-none transition-colors duration-150 ${getPencilColorClass("type", caseData.type !== INITIAL_CASE_CONTEXT.type)}`} />
                    </div>
                </div>
                <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-[10px] bg-[#235697]/10 text-[#235697]">
                        <ShieldCheckIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 relative group">
                        <span className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wide block">Evaluation Binding (eccid)</span>
                        <input 
                            type="text" 
                            value={caseData.eccid} 
                            onFocus={() => setFocusedField("eccid")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => handleFieldChange("eccid", e.target.value)} 
                            className={getInputInteractiveClasses("eccid", caseData.eccid !== INITIAL_CASE_CONTEXT.eccid, "w-full bg-transparent border-b border-transparent hover:border-[#DDE7F0] text-[#173B67] font-mono font-bold text-xs outline-none mt-0.5 pr-6 transition-all rounded px-1")}
                        />
                        <PencilIcon className={`w-3 h-3 absolute right-0 bottom-1.5 pointer-events-none transition-colors duration-150 ${getPencilColorClass("eccid", caseData.eccid !== INITIAL_CASE_CONTEXT.eccid)}`} />
                    </div>
                </div>
                <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-xl p-4 flex items-center gap-3 shadow-xs">
                    <div className="p-2.5 rounded-[10px] bg-[#235697]/10 text-[#235697]">
                        <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wide block">Author Authority (created_by)</span>
                        <span className="text-[#173B67] font-mono text-xs font-bold block mt-1">{caseData.createdBy}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Navigation Tab Controllers */}
                <div className="flex gap-1.5 text-xs font-semibold shrink-0 z-10 translate-y-px">
                    <button 
                        onClick={() => setActiveTab("history")} 
                        className={`px-5 py-3 rounded-t-xl border transition-all duration-150 ${
                            activeTab === "history" 
                                ? "bg-[#FFFFFF] text-[#235697] border-[#DDE7F0] border-b-transparent font-black shadow-2xs" 
                                : "bg-[#1BA7D9] text-white/80 border-transparent hover:text-white hover:bg-[#1487AE]"
                        }`}
                    >
                        <div className="flex items-center gap-1.5"><DocumentTextIcon className="w-4 h-4" /> Narrative Case History</div>
                    </button>
                    <button 
                        onClick={() => setActiveTab("labs")} 
                        className={`px-5 py-3 rounded-t-xl border transition-all duration-150 ${
                            activeTab === "labs" 
                                ? "bg-[#FFFFFF] text-[#235697] border-[#DDE7F0] border-b-transparent font-black shadow-2xs" 
                                : "bg-[#1BA7D9] text-white/80 border-transparent hover:text-white hover:bg-[#1487AE]"
                        }`}
                    >
                        <div className="flex items-center gap-1.5"><BeakerIcon className="w-4 h-4" /> Laboratory Test Metrics ({caseData.labs.length})</div>
                    </button>
                    <button 
                        onClick={() => setActiveTab("radiology")} 
                        className={`px-5 py-3 rounded-t-xl border transition-all duration-150 ${
                            activeTab === "radiology" 
                                ? "bg-[#FFFFFF] text-[#235697] border-[#DDE7F0] border-b-transparent font-black shadow-2xs" 
                                : "bg-[#1BA7D9] text-white/80 border-transparent hover:text-white hover:bg-[#1487AE]"
                        }`}
                    >
                        <div className="flex items-center gap-1.5"><RadioIcon className="w-4 h-4" /> Radiology Analysis ({caseData.radiology.length})</div>
                    </button>
                </div>

                {/* Content Workspace Matrix Canvas */}
                <div className="bg-[#FFFFFF] border border-[#DDE7F0] rounded-b-xl rounded-r-xl p-6 shadow-xs relative">
                    
                    {activeTab === "history" && (
                        <div className="space-y-5">
                            <div className="space-y-1.5 relative group">
                                <label className="text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">Clinical Case Title Header</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={caseData.title}
                                        onFocus={() => setFocusedField("title")}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => handleFieldChange("title", e.target.value)}
                                        className={getInputInteractiveClasses("title", caseData.title !== INITIAL_CASE_CONTEXT.title, "w-full border border-[#DDE7F0] text-[#173B67] font-bold rounded-[10px] p-3 pr-10 outline-none transition-all bg-[#F7FAFC]")} 
                                    />
                                    <PencilIcon className={`w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("title", caseData.title !== INITIAL_CASE_CONTEXT.title)}`} />
                                </div>
                            </div>

                            <div className="bg-[#235697] rounded-xl p-5 space-y-4 shadow-md border border-[#235697]/20">
                                <span className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider border-b border-white/20 pb-2">
                                    <HeartIcon className="w-4 h-4 text-white" /> Fragmented Physical Examination Matrix
                                </span>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="space-y-1 relative group/vit">
                                        <label className="text-[10px] text-white/80 font-bold uppercase">Temp (°F/°C)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.temp} 
                                                onFocus={() => setFocusedField("temp")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("temp", e.target.value)} 
                                                className={getInputInteractiveClasses("temp", parsedExamState.temp !== originalExamState.temp, "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 pr-7 font-mono text-xs font-bold text-white outline-none transition-all")} 
                                            />
                                            <PencilIcon className={`w-2.5 h-2.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("temp", parsedExamState.temp !== originalExamState.temp, "text-white/40")}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative group/vit">
                                        <label className="text-[10px] text-white/80 font-bold uppercase">HR (bpm)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.hr} 
                                                onFocus={() => setFocusedField("hr")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("hr", e.target.value)} 
                                                className={getInputInteractiveClasses("hr", parsedExamState.hr !== originalExamState.hr, "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 pr-7 font-mono text-xs font-bold text-white outline-none transition-all")} 
                                            />
                                            <PencilIcon className={`w-2.5 h-2.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("hr", parsedExamState.hr !== originalExamState.hr, "text-white/40")}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative group/vit">
                                        <label className="text-[10px] text-white/80 font-bold uppercase">Resp (/m)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.resp} 
                                                onFocus={() => setFocusedField("resp")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("resp", e.target.value)} 
                                                className={getInputInteractiveClasses("resp", parsedExamState.resp !== originalExamState.resp, "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 pr-7 font-mono text-xs font-bold text-white outline-none transition-all")} 
                                            />
                                            <PencilIcon className={`w-2.5 h-2.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("resp", parsedExamState.resp !== originalExamState.resp, "text-white/40")}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative group/vit">
                                        <label className="text-[10px] text-white/80 font-bold uppercase">O2Sat (%)</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.o2sat} 
                                                onFocus={() => setFocusedField("o2sat")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("o2sat", e.target.value)} 
                                                className={getInputInteractiveClasses("o2sat", parsedExamState.o2sat !== originalExamState.o2sat, "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 pr-7 font-mono text-xs font-bold text-white outline-none transition-all")} 
                                            />
                                            <PencilIcon className={`w-2.5 h-2.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("o2sat", parsedExamState.o2sat !== originalExamState.o2sat, "text-white/40")}`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Các trường khám cơ quan độc lập */}
                                <div className="space-y-3.5 pt-3 border-t border-dashed border-white/20">
                                    <div className="space-y-1 relative group/txt">
                                        <label className="text-[10px] text-white/80 font-bold uppercase block">General Appearance</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.general} 
                                                onFocus={() => setFocusedField("general")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("general", e.target.value)} 
                                                className={getInputInteractiveClasses("general", parsedExamState.general !== originalExamState.general, "w-full bg-white border border-transparent rounded-lg p-2 pr-8 text-xs text-slate-800 outline-none")} 
                                            />
                                            <PencilIcon className={`w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("general", parsedExamState.general !== originalExamState.general)}`} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1 relative group/txt">
                                            <label className="text-[10px] text-white/80 font-bold uppercase block">Cardiac Exam Findings</label>
                                            <div className="relative">
                                                <textarea 
                                                    rows={2} 
                                                    value={parsedExamState.cardiac} 
                                                    onFocus={() => setFocusedField("cardiac")}
                                                    onBlur={() => setFocusedField(null)}
                                                    onChange={(e) => handleExamFragmentChange("cardiac", e.target.value)} 
                                                    className={getInputInteractiveClasses("cardiac", parsedExamState.cardiac !== originalExamState.cardiac, "w-full bg-white border border-transparent rounded-lg p-2.5 pr-8 text-xs text-slate-800 outline-none resize-none")} 
                                                />
                                                <PencilIcon className={`w-3 h-3 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("cardiac", parsedExamState.cardiac !== originalExamState.cardiac)}`} />
                                            </div>
                                        </div>
                                        <div className="space-y-1 relative group/txt">
                                            <label className="text-[10px] text-white/80 font-bold uppercase block">Pulmonary / Chest Findings</label>
                                            <div className="relative">
                                                <textarea 
                                                    rows={2} 
                                                    value={parsedExamState.pulmonary} 
                                                    onFocus={() => setFocusedField("pulmonary")}
                                                    onBlur={() => setFocusedField(null)}
                                                    onChange={(e) => handleExamFragmentChange("pulmonary", e.target.value)} 
                                                    className={getInputInteractiveClasses("pulmonary", parsedExamState.pulmonary !== originalExamState.pulmonary, "w-full bg-white border border-transparent rounded-lg p-2.5 pr-8 text-xs text-slate-800 outline-none resize-none")} 
                                                />
                                                <PencilIcon className={`w-3 h-3 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("pulmonary", parsedExamState.pulmonary !== originalExamState.pulmonary)}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative group/txt">
                                        <label className="text-[10px] text-white font-black uppercase block tracking-wide">Abdominal / Gastrointestinal Evaluation (Critical Zone)</label>
                                        <div className="relative">
                                            <textarea 
                                                rows={3} 
                                                value={parsedExamState.abdomen} 
                                                onFocus={() => setFocusedField("abdomen")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("abdomen", e.target.value)} 
                                                className={getInputInteractiveClasses("abdomen", parsedExamState.abdomen !== originalExamState.abdomen, "w-full bg-white border-2 border-transparent rounded-lg p-2.5 pr-8 text-xs text-slate-800 font-semibold outline-none resize-none shadow-inner")} 
                                            />
                                            <PencilIcon className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("abdomen", parsedExamState.abdomen !== originalExamState.abdomen, "text-slate-400")}`} />
                                        </div>
                                    </div>
                                    <div className="space-y-1 relative group/txt">
                                        <label className="text-[10px] text-white/80 font-bold uppercase block">Extremities & Musculoskeletal</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={parsedExamState.extremities} 
                                                onFocus={() => setFocusedField("extremities")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => handleExamFragmentChange("extremities", e.target.value)} 
                                                className={getInputInteractiveClasses("extremities", parsedExamState.extremities !== originalExamState.extremities, "w-full bg-white border border-transparent rounded-lg p-2 pr-8 text-xs text-slate-800 outline-none")} 
                                            />
                                            <PencilIcon className={`w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass("extremities", parsedExamState.extremities !== originalExamState.extremities)}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 relative group">
                                <label className="text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">Scenario Context Summary (description)</label>
                                <div className="relative">
                                    <textarea 
                                        rows={2} 
                                        value={caseData.description} 
                                        onFocus={() => setFocusedField("description")}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => handleFieldChange("description", e.target.value)} 
                                        className={getInputInteractiveClasses("description", caseData.description !== INITIAL_CASE_CONTEXT.description, "w-full bg-[#F7FAFC] border border-[#DDE7F0] text-slate-800 rounded-[10px] p-3 pr-10 outline-none transition-all resize-none")} 
                                    />
                                    <PencilIcon className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("description", caseData.description !== INITIAL_CASE_CONTEXT.description)}`} />
                                </div>
                            </div>
                            <div className="space-y-1.5 relative group">
                                <label className="text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">Symptom Timeline Manifest (symptom)</label>
                                <div className="relative">
                                    <textarea 
                                        rows={4} 
                                        value={caseData.symptom} 
                                        onFocus={() => setFocusedField("symptom")}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => handleFieldChange("symptom", e.target.value)} 
                                        className={getInputInteractiveClasses("symptom", caseData.symptom !== INITIAL_CASE_CONTEXT.symptom, "w-full bg-[#F7FAFC] border border-[#DDE7F0] text-slate-800 rounded-[10px] p-3 pr-10 outline-none transition-all leading-relaxed")} 
                                    />
                                    <PencilIcon className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("symptom", caseData.symptom !== INITIAL_CASE_CONTEXT.symptom)}`} />
                                </div>
                            </div>
                            <div className="space-y-1.5 relative group">
                                <label className="text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">Medical History Sub-Matrix (medicalhistory)</label>
                                <div className="relative">
                                    <textarea 
                                        rows={4} 
                                        value={caseData.medicalhistory} 
                                        onFocus={() => setFocusedField("medicalhistory")}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={(e) => handleFieldChange("medicalhistory", e.target.value)} 
                                        className={getInputInteractiveClasses("medicalhistory", caseData.medicalhistory !== INITIAL_CASE_CONTEXT.medicalhistory, "w-full bg-[#F7FAFC] border border-[#DDE7F0] text-slate-800 rounded-[10px] p-3 pr-10 outline-none transition-all leading-relaxed")} 
                                    />
                                    <PencilIcon className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass("medicalhistory", caseData.medicalhistory !== INITIAL_CASE_CONTEXT.medicalhistory)}`} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Labs */}
                    {activeTab === "labs" && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-[#DDE7F0] pb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">Editable Lab Records Mapping</span>
                                <button className="flex items-center gap-1 text-xs font-bold text-[#1BA7D9] hover:text-[#1487AE] transition-colors">
                                    <PlusIcon className="w-3.5 h-3.5" /> Inject New Test Line
                                </button>
                            </div>
                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#DDE7F0] text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">
                                            <th className="pb-2">Item ID</th>
                                            <th className="pb-2">Biomarker Label</th>
                                            <th className="pb-2">Fluid</th>
                                            <th className="pb-2">Category</th>
                                            <th className="pb-2 w-[180px]">Mutable Value</th>
                                            <th className="pb-2">Ref Range</th>
                                            <th className="pb-2 text-center">Purge</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#173B67] font-semibold font-mono">
                                        {caseData.labs.map((lab) => {
                                            const labFieldKey = `lab-${lab.id}`;
                                            const originalLab = INITIAL_CASE_CONTEXT.labs.find(l => l.id === lab.id);
                                            const isLabDirty = originalLab ? lab.value !== originalLab.value : true;
                                            
                                            return (
                                                <tr key={lab.id} className="border-b border-gray-50 hover:bg-[#EDF6FB]/40 group">
                                                    <td className="py-3 text-[#235697]">{lab.itemId}</td>
                                                    <td className="py-3 font-inter font-bold">{lab.label}</td>
                                                    <td className="py-3 font-inter text-[#4F6F94]">{lab.fluid}</td>
                                                    <td className="py-3 font-inter text-slate-400">{lab.category}</td>
                                                    <td className="py-2 relative group/cell">
                                                        <div className="relative max-w-[160px]">
                                                            <input 
                                                                type="text" 
                                                                value={lab.value} 
                                                                onFocus={() => setFocusedField(labFieldKey)}
                                                                onBlur={() => setFocusedField(null)}
                                                                onChange={(e) => handleLabValueChange(lab.id, e.target.value)} 
                                                                className={getInputInteractiveClasses(labFieldKey, isLabDirty, "w-full bg-[#F7FAFC] border border-[#DDE7F0] pl-2 pr-7 py-1 rounded text-xs font-bold text-amber-600 outline-none transition-all shadow-inner")} 
                                                            />
                                                            <PencilIcon className={`w-2.5 h-2.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150 ${getPencilColorClass(labFieldKey, isLabDirty)}`} />
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-gray-400 font-bold">{lab.rangeLower} - {lab.rangeUpper}</td>
                                                    <td className="py-3 text-center">
                                                        <button onClick={() => handleRemoveLab(lab.id)} className="text-gray-300 hover:text-rose-500 transition-colors">
                                                            <TrashIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Tab Radiology */}
                    {activeTab === "radiology" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-[#DDE7F0] pb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">Radiology Scans Segment Records</span>
                                <button className="flex items-center gap-1 text-xs font-bold text-[#1BA7D9] hover:text-[#1487AE] transition-colors">
                                    <PlusIcon className="w-3.5 h-3.5" /> Add Radiology Frame
                                </button>
                            </div>
                            {caseData.radiology.map((rad) => {
                                const radFieldKey = `rad-${rad.id}`;
                                const originalRad = INITIAL_CASE_CONTEXT.radiology.find(r => r.id === rad.id);
                                const isRadDirty = originalRad ? rad.text !== originalRad.text : true;

                                return (
                                    <div key={rad.id} className="border border-[#DDE7F0] rounded-xl p-5 space-y-4 bg-white shadow-2xs relative group">
                                        <button onClick={() => handleRemoveRadiology(rad.id)} className="absolute top-4 right-4 text-gray-300 hover:text-rose-500 transition-colors" title="Delete Report">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 pb-2.5 max-w-[90%]">
                                            <span className="bg-[#D6F5FF] text-[#235697] text-[10px] font-black px-2 py-0.5 rounded font-mono">{rad.noteId}</span>
                                            <h4 className="text-sm font-bold text-[#173B67]">{rad.examName}</h4>
                                            <span className="text-[11px] font-semibold text-slate-400">[{rad.modality} • {rad.region}]</span>
                                        </div>
                                        <div className="space-y-1.5 relative group/radtext">
                                            <span className="text-[#7F96AD] font-bold text-[9px] uppercase tracking-wider block">Clinical Interpretation Text Findings</span>
                                            <div className="relative">
                                                <textarea 
                                                    rows={3} 
                                                    value={rad.text} 
                                                    onFocus={() => setFocusedField(radFieldKey)}
                                                    onBlur={() => setFocusedField(null)}
                                                    onChange={(e) => handleRadiologyTextChange(rad.id, e.target.value)} 
                                                    className={getInputInteractiveClasses(radFieldKey, isRadDirty, "w-full bg-[#F7FAFC] border border-[#DDE7F0] text-slate-800 font-medium rounded-[10px] p-3 pr-10 outline-none font-mono text-xs leading-relaxed transition-all")} 
                                                />
                                                <PencilIcon className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none transition-colors duration-150 ${getPencilColorClass(radFieldKey, isRadDirty)}`} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}