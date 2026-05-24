"use client";

import React from "react";
import type { UpdateClinicalCaseRequest } from "@/src/types/clinical-case";

interface TabSymptomsProps {
    symptom: string;
    medicalHistory: string;
    onFieldChange: (key: keyof UpdateClinicalCaseRequest, value: string) => void;
}

export function TabSymptoms({ symptom, medicalHistory, onFieldChange }: TabSymptomsProps) {
    return (
        <div
            role="tabpanel"
            id="tabpanel-symptoms"
            aria-labelledby="tab-symptoms"
            className="space-y-5"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE7F0]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">
                    Patient Presentation
                </span>
                <span className="text-[10px] text-[#7F96AD] font-medium">
                    Changes saved on blur or via Save button
                </span>
            </div>

            {/* Chief Complaint */}
            <SymptomField
                id="symptom-field"
                label="Chief Complaint / Symptom"
                hint="Describe the patient's primary presenting symptoms in clinical language."
                value={symptom}
                onChange={(v) => onFieldChange("symptom", v)}
                rows={5}
                placeholder="Patient presents with a 3-day history of right lower quadrant pain, nausea, and low-grade fever..."
            />

            {/* Medical History */}
            <SymptomField
                id="medhistory-field"
                label="Medical History"
                hint="Past medical history, surgical history, allergies, medications, family and social history."
                value={medicalHistory}
                onChange={(v) => onFieldChange("medicalHistory", v)}
                rows={6}
                placeholder="PMH: No significant past medical history. PSH: Appendectomy denied. Allergies: NKDA. Medications: None. FH: Non-contributory..."
            />
        </div>
    );
}


interface SymptomFieldProps {
    id: string;
    label: string;
    hint: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
    placeholder?: string;
}

function SymptomField({ id, label, hint, value, onChange, rows = 4, placeholder }: SymptomFieldProps) {
    return (
        <div className="space-y-1.5 group">
            <label
                htmlFor={id}
                className="text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider block"
            >
                {label}
            </label>
            <p className="text-[10px] text-[#A8BECE] leading-relaxed -mt-0.5">{hint}</p>
            <textarea
                id={id}
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={[
                    "w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px]",
                    "py-2.5 px-3 text-xs text-[#173B67] outline-none leading-relaxed",
                    "transition-all resize-none",
                    "focus:border-[#1BA7D9] focus:bg-white focus:shadow-sm",
                    "placeholder:text-[#C4D3DE]",
                ].join(" ")}
            />
            {value.trim().length > 0 && (
                <p className="text-[9px] text-[#C4D3DE] text-right tabular-nums">
                    {value.length} chars
                </p>
            )}
        </div>
    );
}