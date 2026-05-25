"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    MoreVertical, Eye, Edit3, Copy, Archive,
    Trash2, Globe, FileText,
} from "lucide-react";
import type { VirtualPatientSummary, VPStatus } from "@/src/types/virtual-patient-expert";
import { VPStatus as VPStatusEnum } from "@/src/types/virtual-patient-expert";

interface VPRowActionsProps {
    readonly item:           VirtualPatientSummary;
    readonly onDelete:       (id: string) => void;
    readonly onDuplicate:    (id: string) => void;
    readonly onStatusChange: (id: string, status: VPStatus) => void;
}

export function VPRowActions({ item, onDelete, onDuplicate, onStatusChange }: VPRowActionsProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) close();
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, close]);

    const isPublished = item.status === VPStatusEnum.Published;
    const isArchived  = item.status === VPStatusEnum.Archived;

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Row actions"
                aria-haspopup="true"
                aria-expanded={open}
                className={[
                    "p-1.5 rounded-[8px] transition-all outline-none",
                    "focus-visible:ring-2 focus-visible:ring-[#1BA7D9]",
                    open
                        ? "bg-[#235697]/10 text-[#235697]"
                        : "text-[#7F96AD] hover:bg-[#EDF6FB] hover:text-[#235697]",
                ].join(" ")}
            >
                <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-9 z-50 w-52 bg-white border border-[#DDE7F0] rounded-xl shadow-lg py-1.5 text-xs font-semibold text-[#4F6F94] overflow-hidden">

                    {/* View */}
                    <Link
                        href={`/expert/virtual-patient/${item.patientId}`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5 text-[#235697]" />
                        View Detail
                    </Link>

                    {/* Edit */}
                    <Link
                        href={`/expert/virtual-patient/${item.patientId}?edit=true`}
                        onClick={close}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Edit3 className="w-3.5 h-3.5 text-[#235697]" />
                        Edit Patient
                    </Link>

                    {/* Duplicate */}
                    <button
                        onClick={() => { onDuplicate(item.patientId); close(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                    >
                        <Copy className="w-3.5 h-3.5 text-[#235697]" />
                        Duplicate
                    </button>

                    <div className="my-1 border-t border-[#DDE7F0]" />

                    {/* Publish */}
                    {!isPublished && !isArchived && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Published); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] text-[#235697] transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            Publish
                        </button>
                    )}

                    {/* Unpublish */}
                    {isPublished && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Draft); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5 text-[#235697]" />
                            Unpublish → Draft
                        </button>
                    )}

                    {/* Archive */}
                    {!isArchived && (
                        <button
                            onClick={() => { onStatusChange(item.patientId, VPStatusEnum.Archived); close(); }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-[#EDF6FB] hover:text-[#1BA7D9] transition-colors"
                        >
                            <Archive className="w-3.5 h-3.5 text-[#235697]" />
                            Archive
                        </button>
                    )}

                    <div className="my-1 border-t border-[#DDE7F0]" />

                    {/* Delete */}
                    <button
                        onClick={() => { onDelete(item.patientId); close(); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}