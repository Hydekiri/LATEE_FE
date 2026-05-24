"use client";

import React, { useState, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import type { VirtualPatientDetail, UpdateVPRequest } from "@/src/types/virtual-patient-expert";

interface TabPersonaProps {
    readonly patient: VirtualPatientDetail;
    readonly onSave:  (payload: UpdateVPRequest) => Promise<void>;
    readonly saving:  boolean;
}

export function TabPersona({ patient, onSave, saving }: TabPersonaProps) {
    const [emotionalState, setEmotionalState] = useState(
        patient.persona?.emotional_state ?? ""
    );
    const [behaviors, setBehaviors] = useState(
        (patient.behaviors ?? []).join("\n")
    );
    const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory ?? "");
    const [symptom, setSymptom] = useState(patient.symptom ?? "");

    const handleSave = useCallback(async () => {
        await onSave({
            persona:        { emotional_state: emotionalState },
            behaviors:      behaviors.split("\n").map((b) => b.trim()).filter(Boolean),
            medicalHistory,
            symptom,
        });
    }, [onSave, emotionalState, behaviors, medicalHistory, symptom]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-800">AI Persona Configuration</h3>
                <button
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#235697] text-white text-xs font-bold rounded-lg hover:bg-[#1BA7D9] transition-all disabled:opacity-50 shadow-sm"
                >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Emotional State */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Emotional State (AI Actor)
                </label>
                <input
                    type="text"
                    value={emotionalState}
                    onChange={(e) => setEmotionalState(e.target.value)}
                    placeholder="e.g. Anxious, Calm, Distressed"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1">Controls the AI patient&apos;s emotional demeanor during simulation.</p>
            </div>

            {/* Behaviors */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Behavior Rules (one per line)
                </label>
                <textarea
                    value={behaviors}
                    onChange={(e) => setBehaviors(e.target.value)}
                    rows={4}
                    placeholder={"Low pain tolerance\nGives brief answers initially\nResistant to invasive questions"}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all resize-none font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Each line becomes a distinct behavior constraint for the AI actor.</p>
            </div>

            {/* Symptom */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Primary Symptom Description
                </label>
                <input
                    type="text"
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="e.g. Right lower quadrant pain"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] transition-all"
                />
            </div>

            {/* Medical History */}
            <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wide">
                    Medical History
                </label>
                <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    rows={5}
                    placeholder="Past medical history, medications, allergies..."
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#235697] focus:ring-2 focus:ring-[#235697]/10 transition-all resize-none"
                />
            </div>
        </div>
    );
}