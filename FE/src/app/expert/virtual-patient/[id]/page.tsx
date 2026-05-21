"use client";

import React, { useState } from "react";
import { VirtualPatientEntity } from "@/src/features/expert/types/dashboard";
import { User, Activity, ShieldAlert, FileText, Clock, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PatientDetailFeature() {
    const [patient] = useState<VirtualPatientEntity>({
        patientId: "PT-10070247", caseId: "CAS-27892518", name: "Richard Anderson", age: 43, gender: "MALE", pronouns: "he/him", ethnicity: "Hispanic", occupation: "Warehouse worker", chiefConcern: "Abdominal pain", persona: "Patient feels sharp pain around upper quadrant.", vitalSigns: '{"bp": "114/91", "hr": 79, "temp": 37.8, "spo2": "98%", "rr": 18}', instructions: "Evaluate basic history parsing.", behaviors: "Low pain tolerance criteria.", learningObjectives: "Identify continuous diagnostics blocks.", timeSetting: 30, argumentTime: 15, level: "Intermediate", caseRule: "Perform immediate ROS routing validation.", status: "active", avatarImage: "👨‍🚒", createdAt: "2026-05-15 09:00", updatedAt: "2026-05-15 09:12"
    });

    const vitals = JSON.parse(patient.vitalSigns);

    return (
        <section className="p-6 space-y-6 text-xs font-medium text-slate-700">
            <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 font-bold"><Link href="/expert/virtual-patient" className="hover:text-slate-700 flex items-center gap-1"><ArrowLeft size={14} /> Back</Link><span>/</span><span>Details</span></div>
                    <h1 className="text-xl font-bold text-slate-800 mt-1">{patient.name} ({patient.patientId})</h1>
                </div>
                <div className="text-right font-mono text-[11px] text-[#235697] font-bold">Case ID Target: {patient.caseId}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-5 shadow-sm space-y-4 h-fit">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><User size={16} /> Demographics</h3>
                    <div className="space-y-2.5">
                        <div><span className="text-gray-400 block font-bold">Pronouns</span><p className="font-bold text-slate-800 text-sm">{patient.pronouns}</p></div>
                        <div><span className="text-gray-400 block font-bold">Occupation</span><p className="font-bold text-slate-800 text-sm">{patient.occupation}</p></div>
                        <div><span className="text-gray-400 block font-bold">Ethnicity</span><p className="font-bold text-slate-800 text-sm">{patient.ethnicity}</p></div>
                        <div><span className="text-gray-400 block font-bold">Gender & Age Context</span><p className="font-bold text-slate-800 text-sm">{patient.gender} • {patient.age} years old</p></div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><Activity size={16} /> Vital Signs State (vital_signs)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
                            <div className="bg-gray-50 p-2.5 rounded-lg border"><div>BP</div><strong className="text-sm text-slate-800">{vitals.bp}</strong></div>
                            <div className="bg-gray-50 p-2.5 rounded-lg border"><div>HR</div><strong className="text-sm text-slate-800">{vitals.hr} bpm</strong></div>
                            <div className="bg-gray-50 p-2.5 rounded-lg border"><div>Temp</div><strong className="text-sm text-slate-800">{vitals.temp} °C</strong></div>
                            <div className="bg-gray-50 p-2.5 rounded-lg border"><div>SpO2</div><strong className="text-sm text-slate-800">{vitals.spo2}</strong></div>
                            <div className="bg-gray-50 p-2.5 rounded-lg border"><div>RR</div><strong className="text-sm text-slate-800">{vitals.rr} /m</strong></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-5">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2"><FileText size={16} /> Inference Text Fields</h3>
                        <div className="space-y-3.5 leading-relaxed">
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Chief Concern</span><p className="p-3 bg-gray-50 border rounded-lg text-slate-800 font-semibold">{patient.chiefConcern}</p></div>
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Persona Definition</span><p className="p-3 bg-gray-50 border rounded-lg italic">{patient.persona}</p></div>
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Prompt Instructions</span><p className="p-3 bg-gray-50 border rounded-lg text-slate-800 font-mono">{patient.instructions}</p></div>
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">AI Actor Behaviors</span><p className="p-3 bg-gray-50 border rounded-lg text-slate-800">{patient.behaviors}</p></div>
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Learning Objectives Matrix</span><p className="p-3 bg-gray-50 border rounded-lg text-slate-800">{patient.learningObjectives}</p></div>
                            <div><span className="text-gray-400 font-bold block uppercase tracking-wide text-[10px]">Case Rule Structure (case_rule)</span><p className="p-3 bg-gray-50 border rounded-lg text-slate-800">{patient.caseRule}</p></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dashed">
                            <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg"><span className="flex items-center gap-2 text-gray-500 font-bold"><Clock size={14} /> Time Setting</span><strong className="text-slate-800 text-sm">{patient.timeSetting} mins</strong></div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 border rounded-lg"><span className="flex items-center gap-2 text-gray-500 font-bold"><Settings size={14} /> Argument Time</span><strong className="text-slate-800 text-sm">{patient.argumentTime} mins</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}