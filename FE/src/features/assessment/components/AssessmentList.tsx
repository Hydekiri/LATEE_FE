"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ClockIcon,
    ChartBarIcon
} from "@heroicons/react/24/solid";
import { getCookie } from "@/src/utils/cookies";
interface AssessmentItem {
    assessmentId: string; 
    title: string;
    descriptions?: string;
    topic?: string;
    specialty?: string;
    difficultyLevel: string;
    timeLimitMinutes?: number;
    numQuestions: number;
    isActive: boolean; 
    createdAt: string;
}

export default function AssessmentList() {
    const router = useRouter();
    const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAssessments = useCallback(async () => {
        try {
            const token = getCookie('accessToken');
                    if (!token) {
                        alert("Phiên làm việc hết hạn, vui lòng đăng nhập lại.");
                        return;
                    }   
            const res = await fetch("http://localhost:5000/assessment/api/assessments/all", {
                method: "GET",
                headers: { 
                    "accept": "*/*",
                    "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${token}`
                },
            });
            
            if (!res.ok) throw new Error("Failed to fetch assessments");

            const data: AssessmentItem[] = await res.json();

            const sorted = data
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 3);
            setAssessments(sorted);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initLoad = async () => { await fetchAssessments(); };
        initLoad();

        const handleCreated = () => {
            fetchAssessments();
        };

        window.addEventListener("assessmentCreated", handleCreated);

        return () => {
            window.removeEventListener("assessmentCreated", handleCreated);
        };
    }, [fetchAssessments]);

    const goToDetail = (id: string) => {
        router.push(`/assessment/${id}?tab=about`);
    };

    if (loading) return <div className="mt-12 text-center text-[#235697]">Loading your assessments...</div>;

    return (
        <section className="w-full flex flex-col gap-8 mt-12">
            <div className="flex justify-between items-end">
                <div className="max-w-3xl">
                    <h2 className="text-[32px] font-bold text-[#235697]">Your Assessment</h2>
                    <p className="text-[#0E2A46] text-sm mt-1 opacity-80">
                        Test your knowledge with AI-generated clinical cases.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {assessments.map((item) => (
                    <div
                        key={item.assessmentId}
                        onClick={() => router.push(`/assessment/${item.assessmentId}?tab=about`)}
                        className="group flex flex-col lg:flex-row items-stretch bg-[#F0F8FF] rounded-[18px] border border-[#235697]/10 p-5 gap-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                        <div className="relative w-full lg:w-75 h-45 rounded-xl overflow-hidden shrink-0 shadow-inner">
                            <Image
                                src="/images/quizz1.jpeg"
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#235697]/10 rounded-lg text-[10px] font-bold text-[#235697]">
                                    <ClockIcon className="w-3.5 h-3.5" /> {item.timeLimitMinutes || 20} mins
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#235697]/10 rounded-lg text-[10px] font-bold text-[#235697]">
                                    <ChartBarIcon className="w-3.5 h-3.5" /> {item.difficultyLevel}
                                </span>
                            </div>

                            <h3 className="text-[20px] font-bold text-[#235697] leading-tight mb-1 group-hover:text-[#1BA7D9] truncate">
                                {item.title}
                            </h3>
                            
                            <div className="text-[13px] text-[#0E2A46] opacity-90 mb-4">
                                <p><span className="font-bold text-[#235697]">Topic: </span>{item.topic || "N/A"}</p>
                                {item.descriptions && (
                                    <p className="line-clamp-2"><span className="font-bold text-[#235697]">Desc: </span>{item.descriptions}</p>
                                )}
                            </div>

                            <div className="mt-auto">
                                <span className="text-[12px] font-bold text-[#235697]">
                                    Specialty: <span className="font-normal underline">{item.specialty || "Neurology"}</span>
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0 flex flex-col justify-between items-end pl-4 py-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToDetail(item.assessmentId);
                                }}
                                className="flex items-center gap-2 bg-[#1BA7D9] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#235697] transition-all shadow-md active:scale-95"
                            >
                                Start Now →
                            </button>
                            <span className="text-[11px] text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}