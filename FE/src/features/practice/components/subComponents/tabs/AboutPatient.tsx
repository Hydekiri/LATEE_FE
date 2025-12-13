import { PatientData } from "@/src/types/practice";
import Image from "next/image";
import React from "react";

export const AboutPatient = ({ data }: { data: PatientData }) => {
    return (
        <div className="flex flex-col gap-14 text-[#293241]">

            {/* ================= ROW 1: INFO & VITAL SIGNS ================= */}
            <div className="flex flex-col md:flex-row gap-8 relative">

                {/* LEFT */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">
                        Patient Information
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li><span className="font-bold text-[#235697]">Name:</span> {data.name}</li>
                        <li><span className="font-bold text-[#235697]">Age:</span> {data.age}</li>
                        <li><span className="font-bold text-[#235697]">Gender:</span> {data.gender}</li>
                        <li><span className="font-bold text-[#235697]">Pronouns:</span> {data.pronouns}</li>
                        <li><span className="font-bold text-[#235697]">Ethnicity:</span> {data.ethnicity}</li>
                        <li><span className="font-bold text-[#235697]">Setting:</span> {data.setting}</li>
                        <li><span className="font-bold text-[#235697]">Chief Concern:</span> {data.chiefConcern}</li>
                    </ul>
                </div>

                {/* LINE DỌC */}
                <div className="hidden md:block w-1 bg-slate-300 rounded-full mx-2 self-stretch opacity-60" />

                {/* RIGHT */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">
                        Vital Signs
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li><span className="font-bold text-[#235697]">Blood Pressure:</span> {data.vitalSigns.bp}</li>
                        <li><span className="font-bold text-[#235697]">Heart Rate:</span> {data.vitalSigns.hr}</li>
                        <li><span className="font-bold text-[#235697]">Oxygen Saturation:</span> {data.vitalSigns.spo2}</li>
                        <li><span className="font-bold text-[#235697]">Respiratory Rate:</span> {data.vitalSigns.rr}</li>
                        <li><span className="font-bold text-[#235697]">Temperature:</span> {data.vitalSigns.temp}</li>
                    </ul>
                </div>
            </div>

            {/* ================= ROW 2: CASE INSTRUCTIONS ================= */}
            <div className="flex flex-col md:flex-row gap-8 relative border-t border-gray-200 pt-10">

                {/* LEFT */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">
                        Case Instructions (1)
                    </h3>

                    <div className="space-y-4 text-sm leading-relaxed">
                        <p>
                            <span className="font-bold text-[#235697]">Your Role:</span>{" "}
                            {data.instructions.role}
                        </p>
                        <p>
                            <span className="font-bold text-[#235697]">Task:</span>{" "}
                            {data.instructions.task}
                        </p>

                        <div>
                            <span className="font-bold text-[#235697] block mb-1">
                                Procedure:
                            </span>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                                {data.instructions.procedure.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>

                {/* LINE DỌC */}
                <div className="hidden md:block w-1 bg-slate-300 rounded-full mx-2 self-stretch opacity-60" />

                {/* RIGHT */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">
                        Case Instructions (2)
                    </h3>

                    <div className="space-y-4 text-sm leading-relaxed">
                        <div>
                            <span className="font-bold text-[#235697]">
                                Rules: You have up to {data.caseRules.totalTime} to complete the following:
                            </span>
                            <ol className="list-decimal pl-5 space-y-1 mt-1 text-gray-700">
                                {data.caseRules.rules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ol>
                        </div>

                        <div>
                            <span className="font-bold text-[#235697]">
                                Total Time:  {data.caseRules.totalTime}
                            </span> 
                            <ol className="list-decimal pl-5 space-y-1 mt-1 text-gray-700">
                                {data.caseRules.timeBreakdown.map((time, idx) => (
                                    <li key={idx}>{time}</li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= ROW 3: WHAT YOU WILL LEARN ================= */}
            <div className="bg-[#F8FAFC] rounded-2xl p-8">
                <h3 className="text-[#235697] font-bold text-2xl mb-5">
                    What you will learn
                </h3>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700 text-base">
                    {data.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                    ))}
                </ol>
            </div>

            {/* ================= ROW 4: EXPERTS ================= */}
            <div>
                <h3 className="text-gray-800 font-bold text-2xl mb-8">
                    Experts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {data.experts.map((expert, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 relative rounded-full overflow-hidden mb-4 border-4 border-gray-100 shadow-md">
                                <Image
                                    src={expert.img}
                                    alt={expert.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <h4 className="font-bold text-gray-900 text-base">
                                {expert.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 leading-snug px-1">
                                {expert.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
