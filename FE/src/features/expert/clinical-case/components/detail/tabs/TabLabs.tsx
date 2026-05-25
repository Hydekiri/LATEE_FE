"use client";

import React from "react";
import { Pencil } from "lucide-react";
import type { LabTestItemJoined } from "@/src/types/clinical-case";

interface Props {
    labs: LabTestItemJoined[];
    onUpdateLab: (labId: number, value: string) => Promise<void>;
}

export function TabLabs({ labs, onUpdateLab }: Props) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE7F0]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7F96AD]">
                    Lab Test Records
                </span>
            </div>
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-[#DDE7F0] text-[#7F96AD] font-bold text-[10px] uppercase tracking-wider">
                            <th className="pb-2.5">Item ID</th>
                            <th className="pb-2.5">Biomarker</th>
                            <th className="pb-2.5">Fluid</th>
                            <th className="pb-2.5">Category</th>
                            <th className="pb-2.5 w-[180px]">Value</th>
                            <th className="pb-2.5">Ref Range</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#173B67] font-semibold">
                        {labs.map((lab) => (
                            <LabRow key={lab.id} lab={lab} onUpdate={onUpdateLab} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function LabRow({ lab, onUpdate }: { lab: LabTestItemJoined; onUpdate: (id: number, v: string) => Promise<void> }) {
    const [value, setValue] = React.useState(lab.value);
    const isDirty = value !== lab.value;

    const handleBlur = async () => {
        if (isDirty) await onUpdate(lab.id, value);
    };

    return (
        <tr className="border-b border-gray-50 hover:bg-[#EDF6FB]/40">
            <td className="py-3 text-[#235697] font-mono">{lab.itemId}</td>
            <td className="py-3 font-bold">{lab.label}</td>
            <td className="py-3 text-[#4F6F94]">{lab.fluid}</td>
            <td className="py-3 text-slate-400">{lab.category}</td>
            <td className="py-2">
                <div className="relative max-w-[160px]">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        className={`w-full pr-7 pl-2 py-1 rounded text-xs font-bold outline-none border transition-all font-mono ${
                            isDirty
                                ? "bg-amber-50 border-amber-300 text-amber-700 shadow-inner"
                                : "bg-[#F7FAFC] border-[#DDE7F0] text-[#173B67]"
                        } focus:border-[#1BA7D9] focus:bg-white`}
                    />
                    <Pencil className={`w-2.5 h-2.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isDirty ? "text-amber-500" : "text-slate-300"}`} />
                </div>
            </td>
            <td className="py-3 text-[#7F96AD] font-mono">{lab.rangeLower} – {lab.rangeUpper}</td>
        </tr>
    );
}