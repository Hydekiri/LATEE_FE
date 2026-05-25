"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2, Activity } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest, VPVitalSigns } from "@/src/types/virtual-patient-expert";
import { buildVPBasePayload } from "@/src/utils/vp-payload";
interface TabVitalsProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

const VITALS_FIELDS: {
    key: keyof VPVitalSigns;
    label: string;
    unit: string;
    placeholder: string;
    type: "text" | "number";
}[] = [
    { key: "bp",   label: "Blood Pressure",    unit: "mmHg",       placeholder: "114/91",  type: "text"   },
    { key: "hr",   label: "Heart Rate",         unit: "bpm",        placeholder: "79",      type: "number" },
    { key: "temp", label: "Temperature",        unit: "°C",         placeholder: "37.8",    type: "number" },
    { key: "spo2", label: "Oxygen Saturation",  unit: "% SpO2",     placeholder: "98%",     type: "text"   },
    { key: "rr",   label: "Respiratory Rate",   unit: "breaths/min",placeholder: "18",      type: "number" },
];

export function TabVitals({ patient, onSave, saving }: TabVitalsProps) {
    const [vitals, setVitals] = useState<VPVitalSigns>({ ...patient.vitalSigns });

    const [dirty, setDirty] = useState(false);

    const setVital = useCallback(<K extends keyof VPVitalSigns>(key: K, value: VPVitalSigns[K]) => {
        setVitals((prev) => ({ ...prev, [key]: value }));
        setDirty(true);
    }, []);

    const handleSave = useCallback(async () => {
        await onSave({ ...buildVPBasePayload(patient), vitalSigns: vitals });
        setDirty(false);
    }, [onSave, patient, vitals]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#235697]" />
                    <h3 className="text-base font-black text-slate-800">Vital Signs Configuration</h3>
                </div>
                {dirty && (
                    <button onClick={() => void handleSave()} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm">
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {saving ? "Saving..." : "Save Vitals"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VITALS_FIELDS.map(({ key, label, unit, placeholder, type }) => (
                    <div key={key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            {label}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type={type}
                                value={vitals[key]}
                                onChange={(e) => {
                                    const val = type === "number" ? Number(e.target.value) : e.target.value;
                                    setVital(key, val as VPVitalSigns[typeof key]);
                                }}
                                placeholder={placeholder}
                                step={type === "number" ? "0.1" : undefined}
                                className="flex-1 px-3 py-2 text-sm font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#235697] transition-all font-mono"
                            />
                            <span className="text-[11px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">{unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-slate-400 italic">
                Vital signs are displayed to learners during the simulation. Ensure values are clinically plausible for the presented scenario.
            </p>
        </div>
    );
}