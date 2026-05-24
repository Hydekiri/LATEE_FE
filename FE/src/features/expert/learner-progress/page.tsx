// "use client";

// import React, { useState } from "react";
// import { LearnerLog } from "@/src/features/expert/types/dashboard";
// import { ShieldAlert, TrendingUp } from "lucide-react";

// const DEMO_LOGS: LearnerLog[] = [
//     { name: "Johnathan Wick", email: "j.wick@medacademy.edu", lastPractice: "2026-05-21", evalScore: 92, entrustment: "Level 4 - Distal Supervision", roadmap: "Cardiology Block", risk: "Low" },
//     { name: "Clarice Starling", email: "c.starling@medacademy.edu", lastPractice: "2026-05-20", evalScore: 78, entrustment: "Level 2 - Direct Oversight", roadmap: "Neurology Block", risk: "Medium" },
//     { name: "Hannibal Lecter", email: "h.lecter@medacademy.edu", lastPractice: "2026-05-18", evalScore: 45, entrustment: "Level 1 - Observation Only", roadmap: "Psychiatry Block", risk: "High" },
// ];

// export default function LearnerProgressFeature() {
//     const [logs] = useState<LearnerLog[]>(DEMO_LOGS);

//     return (
//         <section className="p-6 space-y-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-white">Learner Progress Tracker</h1>
//                 <p className="text-xs text-white/70">Monitor performance analytics and EPA (Entrustable Professional Activities) levels</p>
//             </div>

//             <div className="bg-white rounded-[10px] p-6 shadow-sm overflow-x-auto">
//                 <table className="w-full border-collapse text-left text-xs">
//                     <thead>
//                         <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase tracking-wider">
//                             <th className="pb-3 pl-2">Learner</th>
//                             <th className="pb-3">Active Roadmap</th>
//                             <th className="pb-3">Avg Eval Score</th>
//                             <th className="pb-3">Entrustment Status</th>
//                             <th className="pb-3">Risk Level</th>
//                             <th className="pb-3 text-right pr-2">Last Activity</th>
//                         </tr>
//                     </thead>
//                     <tbody className="text-slate-700 font-medium">
//                         {logs.map((log, index) => (
//                             <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//                                 <td className="py-4 pl-2">
//                                     <div className="flex flex-col">
//                                         <span className="font-bold text-slate-800">{log.name}</span>
//                                         <span className="text-[10px] text-gray-400 font-normal">{log.email}</span>
//                                     </div>
//                                 </td>
//                                 <td className="py-4 font-semibold text-slate-600">{log.roadmap}</td>
//                                 <td className="py-4">
//                                     <div className="flex items-center gap-1.5">
//                                         <TrendingUp size={14} className="text-green-500" />
//                                         <span className="font-bold text-slate-800">{log.evalScore}%</span>
//                                     </div>
//                                 </td>
//                                 <td className="py-4 font-bold text-[#235697]">{log.entrustment}</td>
//                                 <td className="py-4">
//                                     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
//                                         log.risk === "Low" ? "bg-green-50 text-green-600" :
//                                         log.risk === "Medium" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
//                                     }`}>
//                                         {log.risk === "High" && <ShieldAlert size={10} />}
//                                         {log.risk}
//                                     </span>
//                                 </td>
//                                 <td className="py-4 text-right pr-2 text-gray-400 font-bold">{log.lastPractice}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </section>
//     );
// }

"use client";

import React from "react";
import { Clock, Sparkles, Code2, FlaskConical, Stethoscope } from "lucide-react";

export default function LearnerProgressFeature() {
    return (
        <section className="p-6 min-h-screen flex items-center justify-center overflow-hidden relative">

            {/* Decorative blobs */}
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#1BA7D9]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#235697]/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-[#1BA7D9]/5 blur-2xl pointer-events-none" />

            {/* Floating icons */}
            <div className="absolute top-[18%] left-[12%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-[-8deg] animate-bounce" style={{ animationDuration: "3s" }}>
                <FlaskConical className="w-5 h-5 text-[#1BA7D9]" />
            </div>
            <div className="absolute top-[25%] right-[14%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-[6deg] animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                <Stethoscope className="w-5 h-5 text-[#235697]" />
            </div>
            <div className="absolute bottom-[22%] left-[16%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-[10deg] animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>
                <Code2 className="w-5 h-5 text-[#1BA7D9]" />
            </div>
            <div className="absolute bottom-[28%] right-[12%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-[-6deg] animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "0.3s" }}>
                <Sparkles className="w-5 h-5 text-[#235697]" />
            </div>

            {/* Main card */}
            <div className="relative bg-white border border-[#DDE7F0] rounded-3xl shadow-2xl px-14 py-16 flex flex-col items-center gap-7 text-center w-full max-w-lg">

                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1BA7D9]/5 via-transparent to-[#235697]/5 pointer-events-none" />

                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#1BA7D9] to-[#235697]" />

                {/* Icon */}
                <div className="relative mt-2">
                    {/* Outer ring pulse */}
                    <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-[#1BA7D9]/20 animate-ping" style={{ animationDuration: "2.5s" }} />
                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1BA7D9] to-[#235697] flex items-center justify-center shadow-lg shadow-[#1BA7D9]/30">
                        <Clock className="w-11 h-11 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#DDE7F0] flex items-center justify-center shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#1BA7D9]" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-[#173B67] tracking-tight">
                        Coming Soon
                    </h2>
                    <p className="text-sm text-[#7F96AD] font-medium leading-relaxed max-w-sm">
                        <span className="text-[#235697] font-bold">Learner Progress Tracker</span> đang được phát triển tích cực.
                        <br />
                        Tính năng sẽ sớm ra mắt trong phiên bản tiếp theo.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider">
                        <span>Development Progress</span>
                        <span className="text-[#1BA7D9]">68%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EDF6FB] rounded-full overflow-hidden border border-[#DDE7F0]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1BA7D9] to-[#235697]"
                            style={{ width: "68%" }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-[#DDE7F0]" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#EDF6FB] border border-[#DDE7F0] rounded-full px-5 py-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#1BA7D9] animate-pulse" />
                    <span className="text-xs font-bold text-[#4F6F94] uppercase tracking-wider">
                        In Active Development
                    </span>
                </div>

            </div>
        </section>
    );
}