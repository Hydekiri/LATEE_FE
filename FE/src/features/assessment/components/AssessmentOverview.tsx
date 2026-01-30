"use client";

import { TrendingUp, CheckCircle, Star, Calendar, Activity, BarChart3 } from "lucide-react";

export default function AssessmentOverview() {
    return (
        <div className="w-full flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-end">
            <div>
            <h2 className="text-2xl font-bold text-[#235697]">Assessment Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back, Dr. Nguyen. Here&apos;s your performance summary.</p>
            </div>
            <div className="flex gap-3">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                <option>Today</option>
            </select>
            <button className="bg-[#235697] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
                + New Assessment
            </button>
            </div>
        </div>

        {/* Monthly Analytics Cards */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#235697] flex items-center gap-2">
                <BarChart3 size={18} /> Monthly Analytics Overview
            </h3>
            <span className="text-xs text-gray-400">Updated for October 2023</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { label: "Assessment Growth", value: "+18%", icon: <TrendingUp className="text-blue-500"/>, color: "bg-blue-400" },
                { label: "Completion Rate", value: "94%", icon: <CheckCircle className="text-blue-500"/>, color: "bg-blue-600" },
                { label: "Average Score", value: "8.4/10.0", icon: <Star className="text-blue-500"/>, color: "bg-cyan-400" }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                    {stat.icon}
                </div>
                <span className="text-2xl font-bold text-[#235697]">{stat.value}</span>
                <div className="w-full h-1.5 bg-gray-100 rounded-full">
                    <div className={`h-full ${stat.color} rounded-full w-[70%]`} />
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Small Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Assessment */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-[#235697] text-sm flex items-center gap-2 mb-4">
                <Calendar size={16} /> Today&apos;s Assessment
            </h4>
            <div className="space-y-3 mb-4">
                {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between text-xs border-b border-gray-50 pb-2">
                    <span className="text-gray-400">9 AM</span>
                    <span className="font-semibold text-[#235697]">Clinical Patient Case #{i+1}</span>
                </div>
                ))}
            </div>
            <button className="w-full py-2 bg-[#235697] text-white rounded-lg text-xs font-bold">Monthly Assessment</button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-[#235697]">
            <h4 className="font-bold text-sm flex items-center gap-2 mb-4">
                <Activity size={16} /> Recent Activity
            </h4>
            <div className="space-y-4">
                <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div>
                    <p className="text-xs font-bold">Kidney Case #1</p>
                    <p className="text-[10px] text-gray-400">1 day ago</p>
                </div>
                </div>
                {/* Thêm các item khác tương tự */}
            </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-[#235697]">
            <h4 className="font-bold text-sm flex items-center gap-2 mb-4">
                <BarChart3 size={16} /> Performance
            </h4>
            <div className="space-y-2 mb-4 ">
                <div className="flex justify-between text-xs pb-2">
                    <span className="text-gray-500">Average Score</span>
                    <span className="font-bold">8.4 / 10.0</span>
                </div>
                <div className="flex justify-between text-xs pb-2">
                    <span className="text-gray-500">Completion Rate</span>
                    <span className="font-bold">94%</span>
                </div>
                <div className="flex justify-between text-xs pb-2">
                    <span className="text-gray-500">Assessment Growth</span>
                    <span className="font-bold">+18%</span>
                </div>
            </div>
            <button className="w-full py-2 border border-[#235697] text-[#235697] rounded-lg text-xs font-bold hover:bg-[#235697] hover:text-white transition">View Analytics</button>
            </div>
        </div>
        </div>
    );
}