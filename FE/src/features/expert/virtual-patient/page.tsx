"use client";

import React, { useState, useMemo } from "react";
import { VirtualPatientEntity, PatientLevel } from "../types/dashboard";
import { Search, Filter, Download, Plus, Eye, Edit3, ShieldAlert, Sparkles, Database } from "lucide-react";
import Link from "next/link";

const INITIAL_PATIENTS: VirtualPatientEntity[] = [
    { 
        patientId: "10070247", caseId: "27892518", name: "Richard Anderson", age: 43, gender: "MALE", pronouns: "he/him", ethnicity: "Hispanic", occupation: "Warehouse worker", chiefConcern: "Abdominal pain", persona: '{"emotional_state": "Anxious"}', vitalSigns: '{"bp": "114/91", "hr": 79, "temp": 37.8, "spo2": "98%", "rr": 18}', instructions: "Take a focused history using OLDCARTS", behaviors: "Low pain tolerance", learningObjectives: "Identify surgical abdomen", timeSetting: 30, argumentTime: 15, level: "Intermediate", caseRule: "Complete HPI", status: "active", avatarImage: "https://example.com/richard.png" 
    }
];

export default function VirtualPatientFeature() {
    const [patients] = useState<VirtualPatientEntity[]>(INITIAL_PATIENTS);
    const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        return patients.filter(p => {
            const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.patientId.includes(query);
            const matchesLevel = selectedLevel === "ALL" || p.level === selectedLevel;
            return matchesQuery && matchesLevel;
        });
    }, [patients, query, selectedLevel]);

    return (
        <section className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Virtual Patients Engine</h1>
                    <p className="text-xs text-white/70">Modify dynamic persona structures, core instructions, and systemic constraints.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#1BA7D9] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#235697] transition-all">
                    <Plus size={16} strokeWidth={2.5} /> Provision AI Patient
                </button>
            </div>

            {/* Core Stats Overview Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-white/10 p-2.5 rounded-xl text-white"><Database size={20} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Total Indexed Actors</p>
                        <p className="text-xl font-black text-white">{patients.length}</p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-emerald-500/20 p-2.5 rounded-xl text-emerald-400"><Sparkles size={20} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Runtime Accuracy</p>
                        <p className="text-xl font-black text-white">94.8%</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[10px] p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter rows by internal fields..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-800 outline-none focus:border-[#1BA7D9]" />
                </div>
                <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
                    {["ALL", "Beginner", "Intermediate", "Advanced", "Expert"].map((lvl) => (
                        <button key={lvl} onClick={() => setSelectedLevel(lvl)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLevel === lvl ? "bg-[#235697] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{lvl}</button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto no-scrollbar bg-white rounded-[10px] p-6 shadow-sm">
                <table className="w-full border-collapse text-left text-xs min-w-[900px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase tracking-wider text-[10px]">
                            <th className="pb-3 pl-2">Patient ID</th>
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Demographics</th>
                            <th className="pb-3">Chief Concern</th>
                            <th className="pb-3">Level Constraint</th>
                            <th className="pb-3">State</th>
                            <th className="pb-3 text-right pr-2">Execution Panel</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 font-medium">
                        {filtered.map((p) => (
                            <tr key={p.patientId} className="border-b border-gray-50 hover:bg-slate-50/60 transition-colors">
                                <td className="py-4 pl-2 font-mono font-bold text-[#235697]">{p.patientId}</td>
                                <td className="py-4 font-bold text-slate-800">{p.name}</td>
                                <td className="py-4 text-gray-500">{p.gender}, {p.age} y/o • {p.ethnicity}</td>
                                <td className="py-4 max-w-[200px] truncate">{p.chiefConcern}</td>
                                <td className="py-4">
                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-50 text-[#235697] border border-blue-100">{p.level}</span>
                                </td>
                                <td className="py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === "active" ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}`}>{p.status}</span>
                                </td>
                                <td className="py-4 text-right pr-2">
                                    <Link href={`/expert/virtual-patient/${p.patientId}`} className="inline-flex items-center gap-1 text-xs font-bold text-[#1BA7D9] hover:text-[#235697] transition-colors">
                                        <Edit3 size={14} /> Full Config
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}