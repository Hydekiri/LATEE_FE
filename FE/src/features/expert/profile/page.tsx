"use client";

import React from "react";
import { Award, Mail, Key, ShieldCheck } from "lucide-react";

export default function ExpertProfileFeature() {
    return (
        <section className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Expert Profile Configuration</h1>
                <p className="text-xs text-white/70">Manage clinical credentials and access definitions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-white rounded-[10px] p-6 shadow-sm text-center space-y-4 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-[#1BA7D9]/20 shadow-inner">
                        <img src="/images/Profile.png" alt="Expert Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-slate-800">Nguyen&lsquo;s Tu</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Senior Clinical Consultant</p>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">
                        <ShieldCheck size={12} /> Authenticated Expert Account
                    </span>
                </div>

                {/* Detail Form Fields (Read-only representation matching layout criteria) */}
                <div className="lg:col-span-2 bg-white rounded-[10px] p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-800 border-b pb-2 border-gray-100 uppercase tracking-wider">Meta Context</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                            <label className="text-gray-400 font-bold">Email Interface</label>
                            <div className="bg-gray-50 p-3 rounded-xl font-semibold text-slate-700 flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" /> n.tu@lavender-teeducation.edu
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-gray-400 font-bold">Clinical Specialization</label>
                            <div className="bg-gray-50 p-3 rounded-xl font-semibold text-slate-700 flex items-center gap-2">
                                <Award size={14} className="text-gray-400" /> Cardiovascular Pathologies
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="flex items-center gap-2 bg-[#235697] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#1b4377] transition-all">
                            <Key size={14} /> Request Security Token Reset
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}