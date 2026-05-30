"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, BookOpen, Plus, Trash2 } from "lucide-react";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
import type { VirtualPatientDetail, UpdateVPRequest, VPInstructions } from "@/src/types/virtual-patient-expert";

interface TabInstructionsProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave: (payload: UpdateVPRequest) => Promise<void>;
    readonly saving: boolean;
    readonly readonly?: boolean;
}

const DEFAULT_INSTRUCTIONS: VPInstructions = { role: "", task: "", tone: "", procedure: [] };

const inputClass =
    "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all";

export function TabInstructions({ patient, onSave, saving, readonly }: TabInstructionsProps) {
    const [inst, setInst] = useState<VPInstructions>(patient.instructions ?? DEFAULT_INSTRUCTIONS);
    const [procedure, setProcedure] = useState<string[]>([...(patient.instructions?.procedure ?? [])]);
    const [caseRules, setCaseRules] = useState<string[]>(patient.caseRule?.rules ? [...patient.caseRule.rules] : []);
    const [dirty, setDirty] = useState(false);

    const mark = () => setDirty(true);

    const updateField = <K extends keyof VPInstructions>(k: K, v: VPInstructions[K]) => {
        setInst((prev) => ({ ...prev, [k]: v }));
        mark();
    };

    const addProcedure = () => { setProcedure((p) => [...p, ""]); mark(); };
    const removeProcedure = (i: number) => { setProcedure((p) => p.filter((_, idx) => idx !== i)); mark(); };
    const setProcAt = (i: number, v: string) => { setProcedure((p) => p.map((item, idx) => idx === i ? v : item)); mark(); };

    const addRule = () => { setCaseRules((r) => [...r, ""]); mark(); };
    const removeRule = (i: number) => { setCaseRules((r) => r.filter((_, idx) => idx !== i)); mark(); };
    const setRuleAt = (i: number, v: string) => { setCaseRules((r) => r.map((item, idx) => idx === i ? v : item)); mark(); };

    const handleSave = useCallback(async () => {
        await onSave({
            ...buildVPBasePayload(patient),
            instructions: { ...inst, procedure },
            caseRule: { ...(patient.caseRule ?? { totalTime: "", timeBreakdown: [] }), rules: caseRules },
        });
        setDirty(false);
    }, [onSave, patient, inst, procedure, caseRules]);

    const hasInstructions = !!patient.instructions;

    if (!hasInstructions && !dirty) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">No instructions configured</p>
                <p className="text-xs text-slate-300 mt-1">Add instructions to guide learners during this case</p>
                <button
                    onClick={() => setDirty(true)}
                    className="mt-4 flex items-center gap-1.5 px-4 py-2 border border-[#235697] text-[#235697] text-xs font-bold rounded-lg hover:bg-[#235697]/5 transition-all mx-auto"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Instructions
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#235697]" />
                    Case Instructions
                </h3>
                {dirty && (
                    <button
                        onClick={() => void handleSave()}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                    >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save"}
                    </button>
                )}
            </div>

            {/* Role + Tone */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">Learner Role</label>
                    <input
                        type="text"
                        value={inst.role}
                        onChange={(e) => updateField("role", e.target.value)}
                        placeholder="Medical Learner"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">AI Response Tone</label>
                    <input
                        type="text"
                        value={inst.tone}
                        onChange={(e) => updateField("tone", e.target.value)}
                        placeholder="Short answers unless asked directly"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* Task */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">Task Description</label>
                <textarea
                    value={inst.task}
                    onChange={(e) => updateField("task", e.target.value)}
                    rows={3}
                    placeholder="Take a focused history from this patient..."
                    className={`${inputClass} resize-none`}
                />
            </div>

            {/* Procedure Steps */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Procedure Steps</label>
                    <button onClick={addProcedure} className="flex items-center gap-1 text-xs text-[#235697] font-bold hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add Step
                    </button>
                </div>
                {procedure.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No steps added yet.</p>
                )}
                <div className="space-y-2">
                    {procedure.map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 w-5 shrink-0">{i + 1}.</span>
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => setProcAt(i, e.target.value)}
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

            {/* Case Rules */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide">Case Rules</label>
                    <button onClick={addRule} className="flex items-center gap-1 text-xs text-[#235697] font-bold hover:underline">
                        <Plus className="w-3.5 h-3.5" /> Add Rule
                    </button>
                </div>
                {caseRules.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No rules added yet.</p>
                )}
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