"use client";

import React from "react";
import { Pencil, Scan } from "lucide-react";
import type { RadiologyReportEntity } from "@/src/types/clinical-case";

interface Props {
    radiology: RadiologyReportEntity[];
    onUpdateRad: (radId: number, text: string) => Promise<void>;
}

export function TabRadiology({ radiology, onUpdateRad }: Props) {
    if (!radiology || radiology.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="p-4 bg-[#EDF6FB] rounded-2xl">
                    <Scan className="w-8 h-8 text-[#7F96AD]" />
                </div>
                <p className="text-sm font-bold text-[#173B67]">No Radiology Records</p>
                <p className="text-xs text-[#7F96AD]">
                    No imaging studies have been attached to this case yet.
                </p>
            </div>
        );
    }
}

function RadiologyCard({
    rad,
    onUpdate,
}: {
    rad: RadiologyReportEntity;
    onUpdate: (id: number, text: string) => Promise<void>;
}) {
    const [text, setText] = React.useState(rad.text);
    const isDirty = text !== rad.text;

    const handleBlur = async () => {
        if (isDirty) await onUpdate(rad.id, text);
    };

    return (
        <div className="border border-[#DDE7F0] rounded-xl p-5 space-y-3 bg-white shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#D6F5FF] text-[#235697] text-[10px] font-black px-2 py-0.5 rounded font-mono">
                    {rad.noteId}
                </span>
                <h4 className="text-sm font-bold text-[#173B67]">{rad.examName}</h4>
                <span className="text-[11px] text-slate-400 font-semibold">
                    [{rad.modality} · {rad.region}]
                </span>
            </div>
            <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-[#7F96AD] block">
                    Clinical Findings
                </label>
                <div className="relative">
                    <textarea
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleBlur}
                        className={`w-full rounded-[10px] p-3 pr-10 text-xs outline-none font-mono leading-relaxed border transition-all ${
                            isDirty
                                ? "bg-amber-50 border-amber-300 text-amber-900"
                                : "bg-[#F7FAFC] border-[#DDE7F0] text-slate-800"
                        } focus:border-[#1BA7D9] focus:bg-white`}
                    />
                    <Pencil
                        className={`w-3.5 h-3.5 absolute right-3 bottom-3 pointer-events-none ${isDirty ? "text-amber-500 animate-pulse" : "text-slate-300"}`}
                    />
                </div>
            </div>
        </div>
    );
}