"use client";
import React from "react";
import {
    BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
    AreaChart, Area
} from "recharts";

const BAR_DATA = [
    { name: "A", val: 400 }, { name: "B", val: 300 }, { name: "C", val: 500 },
    { name: "D", val: 280 }, { name: "E", val: 590 }, { name: "F", val: 320 },
    { name: "G", val: 450 }, { name: "H", val: 380 }, { name: "I", val: 480 },
];

const LINE_DATA = [
    { month: "Jan", score: 40 }, { month: "Feb", score: 35 }, { month: "Mar", score: 55 },
    { month: "Apr", score: 45 }, { month: "May", score: 70 }, { month: "Jun", score: 65 },
];

export default function ActivityCharts() {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col h-full">
                <div className="h-40 w-full bg-[#235697] rounded-2xl mb-5 p-4 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BAR_DATA}>
                    <Bar dataKey="val" fill="#FFFFFF" radius={[4, 4, 0, 0]} barSize={6} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
                
                <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Người dùng đang hoạt động</h3>
                <p className="text-[11px] text-green-500 font-bold">
                    (+23) <span className="text-gray-400 font-normal italic">than last week</span>
                </p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {[
                    { label: "Users", value: "32,984", progress: 60 },
                    { label: "Clicks", value: "2.42m", progress: 80 },
                    { label: "Sales", value: "2,400$", progress: 40 },
                    { label: "Items", value: "320", progress: 50 },
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-tight">{item.label}</p>
                    <p className="font-bold text-slate-700 text-sm">{item.value}</p>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-1">
                        <div className="h-full bg-[#1BA7D9] rounded-full" style={{ width: `${item.progress}%` }} />
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-800 text-sm mb-1">Tổng quan về doanh thu</h3>
                <p className="text-[11px] text-green-500 font-bold mb-4">(+20%) <span className="text-gray-400 font-normal">15/05/2025</span></p>
                
                <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={LINE_DATA}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1BA7D9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1BA7D9" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip cursor={false} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#1BA7D9" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                    />
                    </AreaChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}