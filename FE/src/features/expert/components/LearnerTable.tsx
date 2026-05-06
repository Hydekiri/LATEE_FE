"use client";
import React from "react";
import { 
    ArrowUpRightIcon,
    ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";

const LEARNER_DATA = [
    { name: "Esthera Jackson", lastPractice: "VP: Acute Heart Failure", score: 85, level: "Lvl 3", roadmap: "Improving PE Skills", risk: "Low" },
    // { name: "Alexa Liras", lastPractice: "Assessment: Neurology", score: 92, level: "Lvl 4", roadmap: "Completed", risk: "Low" },
    { name: "Laurent Michael", lastPractice: "VP: Acute Stroke", score: 45, level: "Lvl 1", roadmap: "New Roadmap Required", risk: "High" },
    { name: "Freduardo Hill", lastPractice: "VP: Anaphylaxis", score: 78, level: "Lvl 3", roadmap: "In Progress", risk: "Medium" },
];

export default function LearnerTable() {
    return (
        <div className="lg:col-span-8 bg-white rounded-[10px] border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
            
            {/* Header Section tích hợp sẵn */}
            <div className="p-6 flex justify-between items-center border-b border-slate-50 shrink-0">
                <div>
                    <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Learner Monitoring</h2>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">Real-time clinical performance</p>
                </div>
                <button className="text-[10px] font-bold text-[#1BA7D9] hover:text-[#235697] flex items-center gap-1 transition-all uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    View All <ArrowUpRightIcon className="w-3 h-3" />
                </button>
            </div>

            {/* Table Section với UX tối ưu */}
            <div className="flex-1 overflow-auto no-scrollbar max-h-112.5">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20 bg-white/95 backdrop-blur-md">
                        <tr className="text-[10px] uppercase text-slate-400 font-black tracking-widest border-b border-slate-50">
                            <th className="px-6 py-4 border-b border-slate-100">Learner & Session</th>
                            <th className="py-4 text-center border-b border-slate-100">Performance</th>
                            <th className="py-4 text-center border-b border-slate-100">Roadmap</th>
                            <th className="py-4 text-center border-b border-slate-100">Risk</th>
                            <th className="px-6 py-4 border-b border-slate-100"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {LEARNER_DATA.map((learner, i) => (
                            <tr key={i} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-[11px] bg-linear-to-br from-[#235697] to-[#1BA7D9] shadow-sm shrink-0">
                                            {learner.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{learner.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium italic truncate tracking-tight">{learner.lastPractice}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <span className={`text-xs font-black ${learner.score < 50 ? "text-red-500" : "text-[#235697]"}`}>
                                            {learner.score}%
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {learner.level}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 text-center">
                                    <span className="inline-block text-[10px] font-black text-slate-600 bg-slate-100/60 px-2.5 py-1 rounded-lg border border-slate-200/40">
                                        {learner.roadmap}
                                    </span>
                                </td>
                                <td className="py-4 text-center">
                                    <div className="flex justify-center">
                                        {learner.risk === "High" ? (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-tighter animate-pulse">
                                                <ExclamationTriangleIcon className="w-3 h-3" /> at risk
                                            </span>
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${learner.risk === "Medium" ? "bg-amber-400 shadow-[0_0_8px_#fbbf24]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"}`} />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-300 hover:text-[#1BA7D9] transition-all opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1">
                                        <ArrowUpRightIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}