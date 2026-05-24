"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";

interface TabLearningObjectivesProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabLearningObjectives({ patient, onSave, saving }: TabLearningObjectivesProps) {
    const [objectives, setObjectives] = useState<string[]>([...patient.learningObjectives]);

    const add    = () => setObjectives((o) => [...o, ""]);
    const remove = (i: number) => setObjectives((o) => o.filter((_, idx) => idx !== i));
    const setAt  = (i: number, v: string) => setObjectives((o) => o.map((item, idx) => idx === i ? v : item));

    const handleSave = useCallback(async () => {
        await onSave({ learningObjectives: objectives.filter(Boolean) });
    }, [onSave, objectives]);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Learning Objectives</h3>
                <div className="flex items-center gap-2">
                    <button onClick={add} className="flex items-center gap-1.5 px-3 py-2 border border-[#235697] text-[#235697] text-xs font-bold rounded-lg hover:bg-[#235697]/5 transition-all">
                        <Plus className="w-3.5 h-3.5" /> Add Objective
                    </button>
                    <button
                        onClick={() => void handleSave()}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save"}
                    </button>
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