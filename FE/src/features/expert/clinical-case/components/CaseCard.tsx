"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Eye, Copy, Trash2, Archive, Globe, MoreVertical,
    Calendar, Users, BarChart2,
} from "lucide-react";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { ClinicalCaseStatus } from "@/src/types/clinical-case";
import type { ClinicalCaseSummary } from "@/src/types/clinical-case";

interface CaseCardProps {
    item: ClinicalCaseSummary;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onStatusChange: (id: string, status: ClinicalCaseStatus) => void;
}

export function CaseCard({ item, onDelete, onDuplicate, onStatusChange }: CaseCardProps) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formattedDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    return (
        <div className="bg-white border border-[#DDE7F0] rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-[#1BA7D9]/40 transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <button
                        onClick={() => router.push(`/expert/clinical-case/${item.caseId}`)}
                        className="text-sm font-bold text-[#173B67] hover:text-[#1BA7D9] text-left leading-snug line-clamp-2 transition-colors"
                    >
                        {item.title}
                    </button>
                    <p className="text-[10px] font-mono text-[#7F96AD] mt-0.5"># {item.caseId}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <CaseStatusBadge status={item.status} />
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((o) => !o)}
                            className="p-1 hover:bg-[#EDF6FB] rounded-lg transition-colors text-[#7F96AD]"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-7 bg-white border border-[#DDE7F0] rounded-xl shadow-xl z-20 min-w-[160px] overflow-hidden">
                                <MenuItem
                                    icon={<Eye className="w-3.5 h-3.5" />}
                                    label="View Detail"
                                    onClick={() => { router.push(`/expert/clinical-case/${item.caseId}`); setMenuOpen(false); }}
                                />
                                <MenuItem
                                    icon={<Copy className="w-3.5 h-3.5" />}
                                    label="Duplicate"
                                    onClick={() => { onDuplicate(item.caseId); setMenuOpen(false); }}
                                />
                                {item.status !== ClinicalCaseStatus.Published && (
                                    <MenuItem
                                        icon={<Globe className="w-3.5 h-3.5" />}
                                        label="Publish"
                                        onClick={() => { onStatusChange(item.caseId, ClinicalCaseStatus.Published); setMenuOpen(false); }}
                                    />
                                )}
                                {item.status !== ClinicalCaseStatus.Archived && (
                                    <MenuItem
                                        icon={<Archive className="w-3.5 h-3.5" />}
                                        label="Archive"
                                        onClick={() => { onStatusChange(item.caseId, ClinicalCaseStatus.Archived); setMenuOpen(false); }}
                                    />
                                )}
                                <div className="border-t border-[#DDE7F0]" />
                                <MenuItem
                                    icon={<Trash2 className="w-3.5 h-3.5" />}
                                    label="Delete"
                                    danger
                                    onClick={() => { onDelete(item.caseId); setMenuOpen(false); }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#7F96AD] leading-relaxed line-clamp-2">{item.description}</p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold text-[#235697] bg-[#235697]/10 px-2 py-0.5 rounded font-mono">
                    {item.type}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    {item.eccid}
                </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-[11px] text-[#7F96AD] font-semibold">
                <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {item.virtualPatientCount} patients
                </span>
                <span className="flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" /> {item.attemptCount} attempts
                </span>
                {item.avgScore > 0 && (
                    <span className="flex items-center gap-1 text-[#1BA7D9]">
                        ⌀ {item.avgScore.toFixed(1)}
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#DDE7F0] pt-2.5 flex items-center justify-between text-[10px] text-[#7F96AD]">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formattedDate(item.createdAt)}
                </span>
                <span className="font-medium">{item.createdByName}</span>
            </div>
        </div>
    );
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick: () => void;
}

function MenuItem({ icon, label, danger, onClick }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors ${
                danger
                    ? "text-rose-500 hover:bg-rose-50"
                    : "text-[#173B67] hover:bg-[#EDF6FB]"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}