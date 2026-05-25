"use client";

import React from "react";
import { 
    ArrowTrendingUpIcon, 
    UserGroupIcon,
    ShieldCheckIcon
} from "@heroicons/react/24/outline";
import LearnerTable from "@/src/features/expert/components/LearnerTable";

export default function MainAnalytics() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <LearnerTable />
            <div className="lg:col-span-4 space-y-6 flex flex-col">
                <div className="bg-linear-to-l from-[#1384ae] to-[#123b72] rounded-2xl p-6 text-white shadow-xl flex-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-80 transition-all scale-150 rotate-12">
                        <ShieldCheckIcon className="w-20 h-20 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                Clinical Readiness
                            </p>
                            <h3 className="text-2xl font-bold italic tracking-tight underline decoration-[#1BA7D9] decoration-2 underline-offset-4">
                                Avg. Level 3.2
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">
                                Target: Level 4.0 (Proficient)
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center gap-1.5">
                                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#1BA7D9] w-[75%] shadow-[0_0_8px_#1BA7D9]" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">75%</span>
                            </div>
                            <p className="text-emerald-400 text-xs font-bold flex items-center gap-1 mt-2">
                                <ArrowTrendingUpIcon className="w-3 h-3" /> +0.4 pts 
                                <span className="text-slate-400 font-normal ml-1">than last cohort</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Active Now</p>
                            <h4 className="text-xl font-bold text-slate-900 tracking-tighter">24 Learners</h4>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UserGroupIcon className="w-5 h-5 text-[#1BA7D9]" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 -ml-2 first:ml-0 shadow-sm flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 -ml-2 shadow-sm">+19</div>
                    </div>
                </div>
            </div>
        </div>
    );
}