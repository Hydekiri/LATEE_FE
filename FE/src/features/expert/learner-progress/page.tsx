"use client";

import React, { useState } from "react";
import { LearnerLog } from "@/src/features/expert/types/dashboard";
import { ShieldAlert, TrendingUp } from "lucide-react";

const DEMO_LOGS: LearnerLog[] = [
    { name: "Johnathan Wick", email: "j.wick@medacademy.edu", lastPractice: "2026-05-21", evalScore: 92, entrustment: "Level 4 - Distal Supervision", roadmap: "Cardiology Block", risk: "Low" },
    { name: "Clarice Starling", email: "c.starling@medacademy.edu", lastPractice: "2026-05-20", evalScore: 78, entrustment: "Level 2 - Direct Oversight", roadmap: "Neurology Block", risk: "Medium" },
    { name: "Hannibal Lecter", email: "h.lecter@medacademy.edu", lastPractice: "2026-05-18", evalScore: 45, entrustment: "Level 1 - Observation Only", roadmap: "Psychiatry Block", risk: "High" },
];

export default function LearnerProgressFeature() {
    const [logs] = useState<LearnerLog[]>(DEMO_LOGS);

    return (
        <section className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Learner Progress Tracker</h1>
                <p className="text-xs text-white/70">Monitor performance analytics and EPA (Entrustable Professional Activities) levels</p>
            </div>

            <div className="bg-white rounded-[10px] p-6 shadow-sm overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Learner</th>
                            <th className="pb-3">Active Roadmap</th>
                            <th className="pb-3">Avg Eval Score</th>
                            <th className="pb-3">Entrustment Status</th>
                            <th className="pb-3">Risk Level</th>
                            <th className="pb-3 text-right pr-2">Last Activity</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 font-medium">
                        {logs.map((log, index) => (
                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 pl-2">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">{log.name}</span>
                                        <span className="text-[10px] text-gray-400 font-normal">{log.email}</span>
                                    </div>
                                </td>
                                <td className="py-4 font-semibold text-slate-600">{log.roadmap}</td>
                                <td className="py-4">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={14} className="text-green-500" />
                                        <span className="font-bold text-slate-800">{log.evalScore}%</span>
                                    </div>
                                </td>
                                <td className="py-4 font-bold text-[#235697]">{log.entrustment}</td>
                                <td className="py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                                        log.risk === "Low" ? "bg-green-50 text-green-600" :
                                        log.risk === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                                    }`}>
                                        {log.risk === "High" && <ShieldAlert size={10} />}
                                        {log.risk}
                                    </span>
                                </td>
                                <td className="py-4 text-right pr-2 text-gray-400 font-bold">{log.lastPractice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}