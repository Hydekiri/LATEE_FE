// "use client";

// import React, { useState } from "react";
// import { AssessmentEntity } from "../types/dashboard";
// import { Search, Plus, Calendar, ShieldCheck, HelpCircle } from "lucide-react";

// const INITIAL_EXAMS: AssessmentEntity[] = [
//     { assessmentId: "EX-B3", moduleId: "EPA_STANDARD_V1", specialty: "Internal Medicine", topic: "Diagnostics", subtopic: "Abdominal pain core", difficultyLevel: "Intermediate", title: "Internal Medicine Comprehensive Assessment Block", descriptions: "Rigorous testing structure mapped to dynamic multi-case metrics.", goal: "Evaluate HPI accuracy.", numQuestions: 10, timeLimitMinutes: 60, passingScorePercentage: 80.00, maxAttempts: 1, allowedQuestionTypes: '["MultipleChoice"]', isActive: true, createdAt: "2026-05-15", updatedAt: "2026-05-15" }
// ];

// export default function AssessmentFeature() {
//     const [exams] = useState<AssessmentEntity[]>(INITIAL_EXAMS);

//     return (
//         <section className="p-6 space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold text-white tracking-tight">Assessments Engine (assessments)</h1>
//                     <p className="text-xs text-white/70">Configure testing configurations, limit tracking scopes, and pass criteria parameters.</p>
//                 </div>
//                 <button className="flex items-center gap-2 bg-[#1BA7D9] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md"><Plus size={16} /> Create Exam Block</button>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-md space-y-5">
//                 <div className="relative max-w-sm">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input type="text" placeholder="Search assessments schema..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-800 outline-none" />
//                 </div>

//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 text-xs font-semibold text-slate-600">
//                     {exams.map((exam) => (
//                         <div key={exam.assessmentId} className="border border-gray-150 rounded-xl p-5 space-y-4 bg-white hover:border-blue-300 transition-all flex flex-col justify-between">
//                             <div className="space-y-2.5">
//                                 <div className="flex justify-between items-center">
//                                     <span className="font-mono text-[10px] font-black text-[#235697] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{exam.assessmentId}</span>
//                                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${exam.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-400"}`}>● {exam.isActive ? "Active" : "Inactive"}</span>
//                                 </div>
//                                 <h4 className="font-bold text-slate-800 text-sm leading-snug">{exam.title}</h4>
//                                 <p className="text-gray-400 font-normal leading-relaxed text-[11px] italic">{exam.descriptions}</p>
//                             </div>

//                             <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-gray-50 font-medium">
//                                 <div>Module Context: <span className="text-slate-800 font-bold">{exam.moduleId}</span></div>
//                                 <div className="text-right">Specialty Area: <span className="text-slate-800 font-bold">{exam.specialty}</span></div>
//                                 <div>Topic Sequence: <span className="text-slate-800 font-bold">{exam.topic} ({exam.subtopic})</span></div>
//                                 <div className="text-right">Difficulty Bound: <span className="text-slate-800 font-bold">{exam.difficultyLevel}</span></div>
//                             </div>

//                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-dashed border-gray-100 text-center text-slate-500 text-[11px]">
//                                 <div className="bg-gray-50 p-2 border rounded-lg"><div>Questions</div><strong className="text-slate-800 text-xs font-black">{exam.numQuestions}</strong></div>
//                                 <div className="bg-gray-50 p-2 border rounded-lg"><div>Time Limit</div><strong className="text-slate-800 text-xs font-black">{exam.timeLimitMinutes} m</strong></div>
//                                 <div className="bg-gray-50 p-2 border rounded-lg"><div>Pass Ratio</div><strong className="text-[#1BA7D9] text-xs font-black">{exam.passingScorePercentage}%</strong></div>
//                                 <div className="bg-gray-50 p-2 border rounded-lg"><div>Max Attempt</div><strong className="text-slate-800 text-xs font-black">{exam.maxAttempts}</strong></div>
//                             </div>

//                             <div className="pt-3 flex justify-between items-center text-[10px] uppercase font-black text-gray-400 tracking-wider">
//                                 <span className="flex items-center gap-1"><HelpCircle size={12} /> Types: {exam.allowedQuestionTypes}</span>
//                                 <span className="flex items-center gap-1"><Calendar size={12} /> Goal: {exam.goal}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
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

            {/* Floating icons */}
            <div className="absolute top-[18%] left-[12%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-[-8deg] animate-bounce" style={{ animationDuration: "3s" }}>
                <FlaskConical className="w-5 h-5 text-[#1BA7D9]" />
            </div>
            <div className="absolute top-[25%] right-[14%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-6 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                <Stethoscope className="w-5 h-5 text-[#235697]" />
            </div>
            <div className="absolute bottom-[22%] left-[16%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-10 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>
                <Code2 className="w-5 h-5 text-[#1BA7D9]" />
            </div>
            <div className="absolute bottom-[28%] right-[12%] bg-white border border-[#DDE7F0] rounded-2xl p-3 shadow-lg opacity-60 rotate-6 animate-bounce" style={{ animationDuration: "2.8s", animationDelay: "0.3s" }}>
                <Sparkles className="w-5 h-5 text-[#235697]" />
            </div>

            {/* Main card */}
            <div className="relative bg-white border border-[#DDE7F0] rounded-3xl shadow-2xl px-14 py-16 flex flex-col items-center gap-7 text-center w-full max-w-lg">

                {/* Subtle inner glow */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-[#1BA7D9]/5 via-transparent to-[#235697]/5 pointer-events-none" />

                {/* Top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-linear-to-r from-[#1BA7D9] to-[#235697]" />

                {/* Icon */}
                <div className="relative mt-2">
                    <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-[#1BA7D9]/20 animate-ping" style={{ animationDuration: "2.5s" }} />
                    <div className="relative w-24 h-24 rounded-2xl bg-linear-to-br from-[#1BA7D9] to-[#235697] flex items-center justify-center shadow-lg shadow-[#1BA7D9]/30">
                        <Clock className="w-11 h-11 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#DDE7F0] flex items-center justify-center shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#1BA7D9]" />
                    </div>
                </div>

                {/* Coming Soon text — nổi bật */}
                <div className="space-y-3 relative">
                    {/* Glow behind text */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 blur-2xl bg-linear-to-r from-[#1BA7D9]/20 via-[#235697]/20 to-[#1BA7D9]/20 pointer-events-none rounded-full" />

                    <h2 className="relative text-4xl font-black tracking-tight bg-linear-to-r from-[#1BA7D9] via-[#235697] to-[#1BA7D9] bg-clip-text text-transparent drop-shadow-sm">
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
                            className="h-full rounded-full bg-linear-to-r from-[#1BA7D9] to-[#235697] transition-all"
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