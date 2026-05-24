"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest, VPInstructions } from "@/src/types/virtual-patient-expert";

interface TabInstructionsProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabInstructions({ patient, onSave, saving }: TabInstructionsProps) {
    const [inst, setInst] = useState<VPInstructions>({ ...patient.instructions });
    const [procedure, setProcedure] = useState<string[]>([...patient.instructions.procedure]);
    const [caseRules, setCaseRules] = useState<string[]>([...patient.caseRule.rules]);

    const updateInstField = <K extends keyof VPInstructions>(k: K, v: VPInstructions[K]) =>
        setInst((prev) => ({ ...prev, [k]: v }));

    const addProcedure   = () => setProcedure((p) => [...p, ""]);
    const removeProcedure = (i: number) => setProcedure((p) => p.filter((_, idx) => idx !== i));
    const setProcedureAt  = (i: number, v: string) => setProcedure((p) => p.map((item, idx) => idx === i ? v : item));

    const addRule   = () => setCaseRules((r) => [...r, ""]);
    const removeRule = (i: number) => setCaseRules((r) => r.filter((_, idx) => idx !== i));
    const setRuleAt  = (i: number, v: string) => setCaseRules((r) => r.map((item, idx) => idx === i ? v : item));

    const handleSave = useCallback(async () => {
        await onSave({
            instructions: { ...inst, procedure },
            caseRule:     { ...patient.caseRule, rules: caseRules },
        });
    }, [onSave, inst, procedure, caseRules, patient.caseRule]);

    const inputClass = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">Case Instructions</h3>
                <button
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? "Saving..." : "Save"}
                </button>
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