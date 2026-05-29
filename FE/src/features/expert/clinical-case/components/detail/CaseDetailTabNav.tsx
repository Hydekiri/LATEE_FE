"use client";

import React, { useRef, useEffect } from "react";
import { FileText, User, Stethoscope, FlaskConical, Scan } from "lucide-react";

export type DetailTab = "overview" | "symptoms" | "exam" | "labs" | "radiology";

interface TabDef {
    id: DetailTab;
    label: string;
    icon: React.ReactNode;
}

const TAB_DEFS: TabDef[] = [
    { id: "overview", label: "Overview", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "symptoms", label: "Symptoms & History", icon: <User className="w-3.5 h-3.5" /> },
    { id: "exam", label: "Physical Exam", icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: "labs", label: "Lab Tests", icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: "radiology", label: "Imaging", icon: <Scan className="w-3.5 h-3.5" /> },
];

interface CaseDetailTabNavProps {
    activeTab: DetailTab;
    onTabChange: (tab: DetailTab) => void;
    labCount?: number;
    radCount?: number;
}

export function CaseDetailTabNav({
    activeTab,
    onTabChange,
    labCount,
    radCount,
}: CaseDetailTabNavProps) {
    const tabRefs = useRef<Map<DetailTab, HTMLButtonElement>>(new Map());
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentId: DetailTab) => {
        const ids = TAB_DEFS.map((t) => t.id);
        const idx = ids.indexOf(currentId);

        let nextIdx: number | null = null;
        if (e.key === "ArrowRight") nextIdx = (idx + 1) % ids.length;
        if (e.key === "ArrowLeft") nextIdx = (idx - 1 + ids.length) % ids.length;
        if (e.key === "Home") nextIdx = 0;
        if (e.key === "End") nextIdx = ids.length - 1;

        if (nextIdx !== null) {
            e.preventDefault();
            const nextId = ids[nextIdx];
            onTabChange(nextId);
            tabRefs.current.get(nextId)?.focus();
        }
    };

    useEffect(() => {
        tabRefs.current.get(activeTab)?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [activeTab]);

    const getBadge = (tabId: DetailTab): number | undefined => {
        if (tabId === "labs") return labCount;
        if (tabId === "radiology") return radCount;
        return undefined;
    };

    return (
        <div
            role="tablist"
            aria-label="Clinical case sections"
            className="flex gap-1 overflow-x-auto no-scrollbar mb-0"
        >
            {TAB_DEFS.map((tab) => {
                const isActive = activeTab === tab.id;
                const badge = getBadge(tab.id);

                return (
                    <button
                        key={tab.id}
                        ref={(el) => {
                            if (el) tabRefs.current.set(tab.id, el);
                            else tabRefs.current.delete(tab.id);
                        }}
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`tabpanel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onTabChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, tab.id)}
                        className={[
                            "flex items-center gap-1.5 shrink-0 px-4 py-2.5 text-xs font-bold",
                            "rounded-t-xl border transition-all outline-none",
                            "focus-visible:ring-2 focus-visible:ring-[#1BA7D9] focus-visible:ring-offset-1",
                            isActive
                                ? "bg-white text-[#235697] border-[#DDE7F0] border-b-white z-10 shadow-sm"
                                : "bg-[#F7FAFC] text-[#7F96AD] border-transparent hover:text-[#235697] hover:bg-[#EDF6FB]",
                        ].join(" ")}
                    >
                        {/* Icon */}
                        {tab.icon}

                        {/* Label */}
                        {tab.label}

                        {/* Count Badge */}
                        {badge !== undefined && badge > 0 && (
                            <span
                                className={[
                                    "ml-0.5 rounded px-1.5 py-px text-[10px] font-black tabular-nums",
                                    isActive
                                        ? "bg-[#235697]/10 text-[#235697]"
                                        : "bg-[#DDE7F0] text-[#7F96AD]",
                                ].join(" ")}
                                aria-label={`${badge} items`}
                            >
                                {badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}