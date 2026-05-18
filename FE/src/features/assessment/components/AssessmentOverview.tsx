"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    CheckCircle,
    Star,
    BarChart3,
    ChevronDown,
    Calendar,
    Activity
} from "lucide-react";
import AssessmentCreateForm from "@/src/features/assessment/components/subComponents/AssessmentCreateForm";
import { getCookie } from "@/src/utils/cookies";

interface AssessmentActivityItem {
    time: string;
    title: string;
    attemptNo: number;
}

export interface AssessmentOverviewAnalytics {
    assessmentMonthlyGrowth: number;
    completionMonthlyRate: number;
    averageMonthlyScore: number;
    todayAssessments: AssessmentActivityItem[];
    recentActivities: AssessmentActivityItem[];
}

export default function AssessmentOverview({ learnerName }: { learnerName: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState<AssessmentOverviewAnalytics | null>(null);

    const handleSuccess = (id: string) => {
        alert("Create successful!");
        setIsModalOpen(false);

        window.dispatchEvent(new Event("assessmentCreated"));
    };

    useEffect(() => {
        const fetchAssessmentOverviewAnalytics = async () => {
            try {
                const accessToken = getCookie("accessToken");
                const learnerId = getCookie("userId");

                const response = await fetch(`http://localhost:5000/assessment/api/assessments/learner/${learnerId}/analytics`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch assessment overview analytics");
                }

                const data: AssessmentOverviewAnalytics = await response.json();
                setAnalytics(data);

            } catch (error) {
                console.error("Error fetching assessment overview analytics:", error);
            }
        };

        fetchAssessmentOverviewAnalytics();
    }, []);

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);

        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);

        return `${diffInDays}d ago`;
    };

    return (
        <div className="w-full flex flex-col gap-6 relative">
            {/* --- Header Section --- */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-[#235697]">Assessment Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Welcome back, Dr. {learnerName}. Here&apos;s your performance summary.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select className="border border-gray-200 rounded-lg px-5 pl-3 pr-10 py-2.5 text-sm outline-none bg-white cursor-pointer hover:border-gray-300 transition-colors appearance-none w-full">
                            <option>Today</option>
                            <option>Yesterday</option>
                        </select>
                        <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={16}
                        />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#235697] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#1a4171] transition-all active:scale-95"
                    >
                        + New Assessment
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <AssessmentCreateForm
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={handleSuccess}
                    />
                </div>
            )}

            {/* --- Analytics & Summary --- */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#235697] flex items-center gap-2">
                        <BarChart3 size={18} /> Monthly Analytics Overview
                    </h3>
                    <span className="text-xs text-gray-400">Updated for {new Date().getMonth() + 1}/{new Date().getFullYear()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            label: "Assessment Growth",
                            value: analytics?.assessmentMonthlyGrowth || 18,
                            display: `${analytics?.assessmentMonthlyGrowth || 18}%`,
                            icon: <TrendingUp className="text-blue-500" />,
                            color: "bg-blue-400",
                            progress: Math.min(analytics?.assessmentMonthlyGrowth || 18, 100)
                        },
                        {
                            label: "Completion Rate",
                            value: analytics?.completionMonthlyRate || 94,
                            display: `${analytics?.completionMonthlyRate || 94}%`,
                            icon: <CheckCircle className="text-blue-500" />,
                            color: "bg-blue-600",
                            progress: Math.min(analytics?.completionMonthlyRate || 94, 100)
                        },
                        {
                            label: "Average Score",
                            value: analytics?.averageMonthlyScore || 8.4,
                            display: `${analytics?.averageMonthlyScore || 8.4}/10`,
                            icon: <Star className="text-blue-500" />,
                            color: "bg-cyan-400",
                            progress: ((analytics?.averageMonthlyScore || 8.4) / 10) * 100
                        }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {stat.label}
                                </span>
                                {stat.icon}
                            </div>

                            <span className="text-2xl font-bold text-[#235697]">
                                {stat.display}
                            </span>

                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                                    style={{
                                        width: `${stat.progress}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-[#235697] text-sm flex items-center gap-2 mb-4">
                        <Calendar size={16} /> Today&apos;s Assessment
                    </h4>
                    <div className="space-y-3 mb-4">
                        {analytics?.todayAssessments.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs border-b border-gray-50 pb-2">
                                <span className="text-gray-400">{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '9:00'} AM</span>
                                <span className="font-semibold text-[#235697]">{item.title.slice(0, 40)}... #{item.attemptNo}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 bg-[#235697] text-white rounded-lg text-xs font-bold hover:bg-[#1a4171] transition">Monthly Assessment</button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-[#235697]">
                    <h4 className="font-bold text-sm flex items-center gap-2 mb-4">
                        <Activity size={16} /> Recent Activity
                    </h4>
                    <div className="space-y-4">
                        {analytics?.recentActivities.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />

                                <div className="flex-1 border-b border-gray-50 pb-2">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-semibold text-[#235697] text-xs">
                                            {item.title.slice(0, 40)}... #{item.attemptNo}
                                        </span>

                                        <span className="text-gray-400 text-[11px] whitespace-nowrap">
                                            {formatTimeAgo(item.time)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-[#235697]">
                    <h4 className="font-bold text-sm flex items-center gap-2 mb-4">
                        <BarChart3 size={16} /> Performance
                    </h4>
                    <div className="space-y-2 mb-4 ">
                        <div className="flex justify-between text-xs pb-2 border-b border-gray-50">
                            <span className="text-gray-500">Average Score</span>
                            <span className="font-bold text-[#235697]">{analytics?.averageMonthlyScore || "8.4/10.0"}/10</span>
                        </div>
                        <div className="flex justify-between text-xs pb-2 border-b border-gray-50">
                            <span className="text-gray-500">Completion Rate</span>
                            <span className="font-bold text-[#235697]">{analytics?.completionMonthlyRate || "94%"}%</span>
                        </div>
                        <div className="flex justify-between text-xs pb-2">
                            <span className="text-gray-500">Assessment Growth</span>
                            <span className="font-bold text-[#235697]">{analytics?.assessmentMonthlyGrowth || "+18%"}%</span>
                        </div>
                    </div>
                    <button className="w-full py-2 border border-[#235697] text-[#235697] rounded-lg text-xs font-bold hover:bg-[#235697] hover:text-white transition">View Analytics</button>
                </div>
            </div>
        </div>
    );
}