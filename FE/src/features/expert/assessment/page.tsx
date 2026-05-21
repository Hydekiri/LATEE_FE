"use client";

import React, { useState } from "react";
import { AssessmentEntity } from "../types/dashboard";
import { Search, Plus, Calendar, ShieldCheck, HelpCircle } from "lucide-react";

const INITIAL_EXAMS: AssessmentEntity[] = [
    { assessmentId: "EX-B3", moduleId: "EPA_STANDARD_V1", specialty: "Internal Medicine", topic: "Diagnostics", subtopic: "Abdominal pain core", difficultyLevel: "Intermediate", title: "Internal Medicine Comprehensive Assessment Block", descriptions: "Rigorous testing structure mapped to dynamic multi-case metrics.", goal: "Evaluate HPI accuracy.", numQuestions: 10, timeLimitMinutes: 60, passingScorePercentage: 80.00, maxAttempts: 1, allowedQuestionTypes: '["MultipleChoice"]', isActive: true, createdAt: "2026-05-15", updatedAt: "2026-05-15" }
];

export default function AssessmentFeature() {
    const [exams] = useState<AssessmentEntity[]>(INITIAL_EXAMS);

    return (
        <section className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Assessments Engine (assessments)</h1>
                    <p className="text-xs text-white/70">Configure testing configurations, limit tracking scopes, and pass criteria parameters.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#1BA7D9] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md"><Plus size={16} /> Create Exam Block</button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md space-y-5">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Search assessments schema..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-800 outline-none" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 text-xs font-semibold text-slate-600">
                    {exams.map((exam) => (
                        <div key={exam.assessmentId} className="border border-gray-150 rounded-xl p-5 space-y-4 bg-white hover:border-blue-300 transition-all flex flex-col justify-between">
                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] font-black text-[#235697] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{exam.assessmentId}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${exam.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-400"}`}>● {exam.isActive ? "Active" : "Inactive"}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm leading-snug">{exam.title}</h4>
                                <p className="text-gray-400 font-normal leading-relaxed text-[11px] italic">{exam.descriptions}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-gray-50 font-medium">
                                <div>Module Context: <span className="text-slate-800 font-bold">{exam.moduleId}</span></div>
                                <div className="text-right">Specialty Area: <span className="text-slate-800 font-bold">{exam.specialty}</span></div>
                                <div>Topic Sequence: <span className="text-slate-800 font-bold">{exam.topic} ({exam.subtopic})</span></div>
                                <div className="text-right">Difficulty Bound: <span className="text-slate-800 font-bold">{exam.difficultyLevel}</span></div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-dashed border-gray-100 text-center text-slate-500 text-[11px]">
                                <div className="bg-gray-50 p-2 border rounded-lg"><div>Questions</div><strong className="text-slate-800 text-xs font-black">{exam.numQuestions}</strong></div>
                                <div className="bg-gray-50 p-2 border rounded-lg"><div>Time Limit</div><strong className="text-slate-800 text-xs font-black">{exam.timeLimitMinutes} m</strong></div>
                                <div className="bg-gray-50 p-2 border rounded-lg"><div>Pass Ratio</div><strong className="text-[#1BA7D9] text-xs font-black">{exam.passingScorePercentage}%</strong></div>
                                <div className="bg-gray-50 p-2 border rounded-lg"><div>Max Attempt</div><strong className="text-slate-800 text-xs font-black">{exam.maxAttempts}</strong></div>
                            </div>

                            <div className="pt-3 flex justify-between items-center text-[10px] uppercase font-black text-gray-400 tracking-wider">
                                <span className="flex items-center gap-1"><HelpCircle size={12} /> Types: {exam.allowedQuestionTypes}</span>
                                <span className="flex items-center gap-1"><Calendar size={12} /> Goal: {exam.goal}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}