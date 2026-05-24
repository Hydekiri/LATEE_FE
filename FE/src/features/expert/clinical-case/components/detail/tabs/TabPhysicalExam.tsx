import React from "react";
import type { FragmentedPhysicalExam } from "@/src/types/clinical-case";

interface Props {
    exam: FragmentedPhysicalExam;
    onFieldChange: (field: keyof FragmentedPhysicalExam, val: string) => void;
}

const INPUT = "w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2 px-3 text-xs text-[#173B67] outline-none focus:border-[#1BA7D9] focus:bg-white transition-all font-mono";
const LABEL = "text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider block mb-1";

export function TabPhysicalExam({ exam, onFieldChange }: Props) {
    return (
        <div className="space-y-5">
            {/* Vitals */}
            <div>
                <p className="text-[11px] font-bold text-[#7F96AD] uppercase tracking-wider mb-3 border-b border-[#DDE7F0] pb-2">
                    Admission Vitals
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(["temp", "hr", "resp", "o2sat"] as const).map((field) => (
                        <div key={field}>
                            <label className={LABEL}>{field === "o2sat" ? "O₂ Sat" : field.toUpperCase()}</label>
                            <input
                                className={INPUT}
                                type="text"
                                value={exam[field]}
                                onChange={(e) => onFieldChange(field, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Exam Findings */}
            <div>
                <p className="text-[11px] font-bold text-[#7F96AD] uppercase tracking-wider mb-3 border-b border-[#DDE7F0] pb-2">
                    Physical Exam Findings
                </p>
                <div className="space-y-3">
                    {(["general", "cardiac", "pulmonary", "abdomen", "extremities"] as const).map((field) => (
                        <div key={field}>
                            <label className={LABEL}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <textarea
                                className={INPUT}
                                rows={2}
                                value={exam[field]}
                                onChange={(e) => onFieldChange(field, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}