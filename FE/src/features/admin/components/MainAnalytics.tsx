"use client";

import {
    Activity,
    ArrowUpRight,
    Bell,
    Clock3,
    ShieldCheck,
    Users,
    UserCheck,
    Sparkles,
    TrendingUp,
} from "lucide-react";

import UsersTable from "@/src/features/admin/components/UsersTable";
import { useState } from "react";
import { AdminDashboardStats } from "../types/user";

export default function MainAnalytics({ dashboardStats }: { dashboardStats: AdminDashboardStats | null }) {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const learnersPercentage = (dashboardStats?.total_learners ? dashboardStats.total_learners / (dashboardStats.total_learners + dashboardStats.total_experts + dashboardStats.total_admins) * 100 : 0).toFixed(2);
    const expertsPercentage = (dashboardStats?.total_experts ? dashboardStats.total_experts / (dashboardStats.total_learners + dashboardStats.total_experts + dashboardStats.total_admins) * 100 : 0).toFixed(2);
    const adminsPercentage = (dashboardStats?.total_admins ? dashboardStats.total_admins / (dashboardStats.total_learners + dashboardStats.total_experts + dashboardStats.total_admins) * 100 : 0).toFixed(2);

    const refreshUsers = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

            {/* LEFT */}
            <div className="space-y-6 xl:col-span-8">
                {/* SECONDARY GRID */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* ROLE DISTRIBUTION */}
                    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Role Distribution
                                </h3>

                                <p className="mt-1 text-sm text-neutral-900">
                                    User segmentation by role
                                </p>
                            </div>

                            <div className="bg-[#1BA7D9] p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <div className="mt-8 space-y-5">

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-neutral-700">
                                        Learners
                                    </span>

                                    <span className="text-sm text-neutral-500">
                                        {learnersPercentage}%
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                    <div className="h-full rounded-full bg-black" style={{
                                        width: `${learnersPercentage}%`,
                                    }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-neutral-700">
                                        Experts
                                    </span>

                                    <span className="text-sm text-neutral-500">
                                        {expertsPercentage}%
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                    <div className="h-full rounded-full bg-neutral-500" style={{
                                        width: `${expertsPercentage}%`,
                                    }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-medium text-neutral-700">
                                        Admins
                                    </span>

                                    <span className="text-sm text-neutral-500">
                                        {adminsPercentage}%
                                    </span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-neutral-100">
                                    <div className="h-full rounded-full bg-neutral-300" style={{
                                        width: `${adminsPercentage}%`,
                                    }} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SYSTEM HEALTH */}
                    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    System Health
                                </h3>

                                <p className="mt-1 text-sm text-neutral-900">
                                    Platform operational metrics
                                </p>
                            </div>

                            <div className="bg-[#1BA7D9] p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        <div className="mt-8 space-y-5">

                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">

                                <div>
                                    <p className="text-sm font-medium text-neutral-700">
                                        API Uptime
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Last 30 days
                                    </p>
                                </div>

                                <span className="text-lg font-bold text-green-500">
                                    99.98%
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">

                                <div>
                                    <p className="text-sm font-medium text-neutral-700">
                                        Average Response
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Global average latency
                                    </p>
                                </div>

                                <span className="text-lg font-bold text-neutral-900">
                                    128ms
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4">

                                <div>
                                    <p className="text-sm font-medium text-neutral-700">
                                        Queue Health
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-500">
                                        Background processing
                                    </p>
                                </div>

                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                                    Stable
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* USERS TABLE */}
                <UsersTable
                    search={search}
                    role={role}
                    status={status}
                    date={date}
                    refreshKey={refreshKey}
                    onRefresh={refreshUsers}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>

            {/* RIGHT */}
            <div className="space-y-6 xl:col-span-4 bg-white rounded-3xl p-5 shadow-sm">

                {/* REALTIME */}
                <section className="rounded-3xl border border-neutral-200 bg-linear-to-r from-[#235697] to-[#1BA7D9] p-6 text-white shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-lg font-bold text-white/90">
                                Active User
                            </p>

                            <h3 className="mt-2 text-3xl font-bold">
                                {dashboardStats?.total_active_users || 0}
                            </h3>

                            <p className="mt-2 text-sm text-neutral-400">
                                Users currently active on the platform
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-3">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-green-500">
                        <span>
                            12.4 % from previous hour
                        </span>
                    </div>
                </section>

                {/* INSIGHTS */}
                <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <h3 className="text-lg font-bold text-slate-800]">
                                AI Insights
                            </h3>

                            <p className="mt-1 text-sm text-neutral-900">
                                Generated platform observations
                            </p>
                        </div>

                        <div className="bg-[#1BA7D9] p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">

                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <p className="text-sm font-medium text-neutral-800">
                                Learner engagement increased by 18%
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                                Compared to previous week
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <p className="text-sm font-medium text-neutral-800">
                                Peak activity occurs at 8:00 PM
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                                Based on recent sessions
                            </p>
                        </div>

                        <div className="rounded-2xl border border-neutral-200 p-4">
                            <p className="text-sm font-medium text-neutral-800">
                                Expert retention remains stable
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                                91% monthly retention rate
                            </p>
                        </div>
                    </div>
                </section>

                {/* Notifications Right Panel */}
                <div className="border border-neutral-200 rounded-3xl shadow-sm p-7 bg-white">

                    <h2 className="text-lg font-bold text-slate-800 mb-6">Notifications</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="flex gap-4 items-start relative">
                                <div className="w-1.5 h-full absolute left-3.75 top-8 bg-gray-50 z-0" />
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${n === 1 ? 'bg-emerald-100 text-emerald-500' : 'bg-blue-100 text-[#1BA7D9]'}`}>
                                    <Bell size={14} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[11px] font-bold text-slate-800">
                                        {n === 1 ? "$2400, Design change" : `New order #${4219423 + n}`}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">22 DEC 7:20 PM</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}