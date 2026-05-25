"use client";
import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";

const ACTIVITY_PULSE = [
    { hour: "00", val: 15 }, { hour: "04", val: 5 }, { hour: "08", val: 95 },
    { hour: "12", val: 156 }, { hour: "16", val: 110 }, { hour: "20", val: 135 },
    { hour: "23", val: 30 },
];

export default function ActivityCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Activity Pulse</h3>
                    <p className="text-xl font-bold text-slate-800 tracking-tighter">Session Density (24h)</p>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ACTIVITY_PULSE}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#cbd5e1'}} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}} />
                            <Bar dataKey="val" fill="#235697" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Growth Index</h3>
                        <p className="text-xl font-bold text-slate-800 tracking-tighter">Cumulative Engagement</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+20.4%</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ACTIVITY_PULSE}>
                            <defs>
                                <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1BA7D9" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#1BA7D9" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'}} />
                            <Area type="monotone" dataKey="val" stroke="#1BA7D9" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}