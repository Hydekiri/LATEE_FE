"use client";

import type { GenerateRoadmapResponse, RoadmapItem } from '@/src/services/roadmap-service';
import React, { useEffect, useState } from "react";
import { ChevronRight, Star, Sparkles, CalendarDays, Target, Clock3 } from "lucide-react";
import generateRoadmap, { getLatestRoadmap, updateRoadmapWithId } from "@/src/services/roadmap-service";

export interface RoadmapData {
    roadmap_id: string;
    roadmap_version: string;
    total_days: number;
    title: string;
    goal: string;
    roadmap: RoadmapItem[];
};

const roadmapData: RoadmapData = {
    roadmap_id: "roadmap-1",
    roadmap_version: "1.0",
    total_days: 0,
    title: "Abdominal Pain Management Roadmap",
    goal: "Master the assessment and management of patients with abdominal pain",
    roadmap: [],
};

function ProgressBar({ value }: { value: number }) {
    const progress = Math.min(100, Math.max(0, value));

    return (
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
                className="h-full w-full rounded-full bg-linear-to-r from-[#235697] to-[#1BA7D9] transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${100 - progress}%)` }}
            />
        </div>
    );
}

export default function RoadmapPage() {
    const [roadmapListState, setRoadmapListState] = useState<RoadmapData>(roadmapData);
    const [loadLastedRoadmap, setLoadLastedRoadmap] = useState<boolean>(false);
    
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    
    const [selectedRoadmapItem, setSelectedRoadmapItem] = useState<RoadmapItem | null>(null);
    const [showCreateRoadmapModal, setShowCreateRoadmapModal] = useState<boolean>(false);
    const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState<boolean>(false);
    const [createRoadmapForm, setCreateRoadmapForm] = useState({
        historyPractice: "",
        userTarget: "",
        totalDaysAvailable: 0
    });

    const totalDays = roadmapListState.total_days;
    const progress = roadmapListState.roadmap.length > 0
        ? Math.round((roadmapListState.roadmap.filter(item => item.status === "done").length / roadmapListState.roadmap.length) * 100)
        : 0;
        
    const cumulativeDays = roadmapListState.roadmap.reduce<number[]>((acc, item) => {
        const prev = acc.length ? acc[acc.length - 1] : 0;
        acc.push(prev + item.amount_of_time_days);
        return acc;
    }, []);

    useEffect(() => {
        if (!loadLastedRoadmap) {
            getLatestRoadmap().then(async (result) => {
                if (result && result.content) {
                    const content = result.content;
                    setRoadmapListState({
                        roadmap_id: result.roadmap_id,
                        roadmap_version: result.version,
                        total_days: content.total_days,
                        title: content.roadmap_title,
                        goal: content.goal,
                        roadmap: content.roadmap.map((item: GenerateRoadmapResponse['roadmap'][number], index: number) => ({
                            order_id: index + 1,
                            recommended_content: item.recommended_content,
                            detailed_explain: item.detailed_explain,
                            amount_of_time_days: item.amount_of_time_days,
                            start_date: item.start_date ? new Date(item.start_date) : null,
                            status: item.status ?? "in_progress"
                        }))
                    });
                    setLoadLastedRoadmap(true);
                }
            }).catch(err => {
                console.error("Failed to load roadmap:", err);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [loadLastedRoadmap]);


    function getDateLabel(index: number) {
        if (index === 0 && !roadmapListState.roadmap[0].start_date) {
            setRoadmapListState(prev => {
                const updatedRoadmap = [...prev.roadmap];
                updatedRoadmap[0].start_date = new Date();
                return { ...prev, roadmap: updatedRoadmap };
            })
        }
        else if (index > 0 && !roadmapListState.roadmap[index].start_date) {
            const prevItem = roadmapListState.roadmap[index - 1];
            const prevStartDate = prevItem.start_date ?? new Date();
            const newStartDate = new Date(prevStartDate.getTime() + prevItem.amount_of_time_days * 24 * 60 * 60 * 1000);
            setRoadmapListState(prev => {
                const updatedRoadmap = [...prev.roadmap];
                updatedRoadmap[index].start_date = newStartDate;
                return { ...prev, roadmap: updatedRoadmap };
            });
        }

        return roadmapListState.roadmap[index].start_date?.toLocaleDateString("vn-VN", { month: "short", day: "numeric" }) ?? "";
    }

    function getMilestoneLabel(index: number, total: number) {
        let start = 0;
        for (let i = 0; i < index; i++) {
            start += roadmapListState.roadmap[i].amount_of_time_days;
        }
        start += 1;
        const end = Math.min(start + roadmapListState.roadmap[index].amount_of_time_days - 1, total);
        return `Day ${start} - ${end}`;
    }

    function updateRoadmapItem(order_id: number): void {
        setRoadmapListState(prev => ({
            ...prev,
            roadmap: prev.roadmap.map(item =>
                item.order_id === order_id
                    ? { ...item, status: item.status === "done" ? "in_progress" : "done" }
                    : item
            )
        }));
    }

    function closeRoadmapPopup(): void {
        setSelectedRoadmapItem(null);
    }

    function closeCreateRoadmapModal(): void {
        setShowCreateRoadmapModal(false);
        setCreateRoadmapForm({
            historyPractice: "",
            userTarget: "",
            totalDaysAvailable: 15
        });
    }

    async function handleCreateRoadmap(): Promise<void> {
        if (!createRoadmapForm.historyPractice.trim() || !createRoadmapForm.userTarget.trim()) {
            alert("Please fill in all fields");
            return;
        }

        setIsGeneratingRoadmap(true);
        try {
            const result = await generateRoadmap(
                createRoadmapForm.historyPractice,
                createRoadmapForm.userTarget,
                createRoadmapForm.totalDaysAvailable
            );
            
            if (result && result.content) {
                setRoadmapListState({
                    roadmap_id: result.roadmap_id,
                    roadmap_version: result.version,
                    total_days: result.content.total_days,
                    title: result.content.roadmap_title,
                    goal: result.content.goal,
                    roadmap: result.content.roadmap.map((item: GenerateRoadmapResponse['roadmap'][number], index: number) => ({
                        order_id: index + 1,
                        recommended_content: item.recommended_content,
                        detailed_explain: item.detailed_explain,
                        amount_of_time_days: item.amount_of_time_days,
                        start_date: null,
                        status: "in_progress"
                    }))
                });
            }
            closeCreateRoadmapModal();
        } catch (error) {
            console.error("Error creating roadmap:", error);
            alert("Failed to create roadmap. Please try again.");
        } finally {
            setIsGeneratingRoadmap(false);
            setLoadLastedRoadmap(false);
        }
    }

    async function handleUpdateRoadmap(): Promise<void> {
        try {
            await updateRoadmapWithId(roadmapListState.roadmap_id, roadmapListState);
            console.log("Requesting backend to update roadmap progress...");
        } catch (error) {
            console.error("Error updating roadmap:", error);
            alert("Failed to update roadmap. Please try again.");
        }
    }

    return (
        <div className="w-full min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/bg111.jpg')" }}>
            <div className="mx-auto max-w-[90%] px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] overflow-hidden">
                    <RoadmapOverview 
                        title={roadmapListState.title} 
                        goal={roadmapListState.goal} 
                        progress={progress} 
                        totalDays={totalDays} 
                        latestVersion={roadmapListState.roadmap_version} 
                        numberOfSteps={roadmapListState.roadmap.length} 
                        numberOfDoneSteps={roadmapListState.roadmap.filter(item => item.status === "done").length} 
                        onCreateRoadmap={() => setShowCreateRoadmapModal(true)} 
                    />

                    <div className="px-6 py-8 lg:px-8 min-h-[400px]">
                        {isLoading ? (
                            <div className="flex w-full items-center justify-center h-64">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1BA7D9] border-t-transparent" />
                            </div>
                        ) : (
                            <div className="relative overflow-x-auto pb-4">
                                <div className="min-w-[920px]">
                                    <div className="relative mt-2">
                                        <div className="absolute left-10 right-10 top-7 h-[2px] bg-slate-200" />
                                        <div id="roadmapWrapper" className="grid gap-6 px-4 mx-auto max-w-5xl [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                                            {roadmapListState.roadmap.map((item, index) => {
                                                const finishedByThisStep = cumulativeDays[index];
                                                const stepProgress = Math.round((finishedByThisStep / totalDays) * 100);

                                                return (
                                                    <div key={item.order_id} className="relative flex flex-col items-center">
                                                        <div className="flex w-full flex-col items-center">
                                                            <span>{getDateLabel(index)}</span>
                                                            <div className="mt-2 h-6 w-px bg-slate-200" />
                                                        </div>

                                                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-linear-to-r from-[#235697] to-[#1BA7D9] text-white shadow-lg">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
                                                                {item.order_id}
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 w-full rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_-22px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.28)]">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                                    {item.status === "in_progress" ? "In Progress" : "Done"}
                                                                </span>
                                                                <div className="flex items-center gap-1 text-amber-400">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateRoadmapItem(item.order_id)}
                                                                        aria-label={item.status === "done" ? "Mark as in progress" : "Mark as done"}
                                                                        className="flex items-center justify-center rounded-full p-1 transition-colors hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-[#1BA7D9]"
                                                                    >
                                                                        <Star className={`h-4 w-4 ${item.status === "done" ? "fill-current" : ""}`} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 text-sm font-medium text-slate-500">
                                                                {getMilestoneLabel(index, totalDays)}
                                                            </div>

                                                            <h3 className="mt-2 text-base font-semibold leading-6 text-slate-900">
                                                                {item.recommended_content}
                                                            </h3>

                                                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                                                                <Clock3 className="h-3.5 w-3.5" />
                                                                {item.amount_of_time_days} day{item.amount_of_time_days > 1 ? "s" : ""}
                                                                <span className="mx-1 h-1 w-1 rounded-full bg-slate-300" />
                                                                {stepProgress}% path
                                                            </div>

                                                            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                                                                {item.detailed_explain}
                                                            </p>

                                                            <button
                                                                type="button"
                                                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1BA7D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1596c1]"
                                                                onClick={() => setSelectedRoadmapItem(item)}
                                                            >
                                                                View Detail
                                                                <ChevronRight className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <button
                                id="updateRoadmapButton"
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#235697] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1596c1]"
                                onClick={() => handleUpdateRoadmap()}
                            >
                                Update Progress
                            </button>
                        </div>

                        <div className="mt-8 rounded-[24px] bg-slate-50 p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <Sparkles className="h-4 w-4 text-[#235697]" />
                                Learning tips
                            </div>
                            <div className="mt-3 grid gap-3 md:grid-cols-3">
                                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                                    Study each item in order. Do not skip the anatomy refresher.
                                </div>
                                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                                    Review the detailed explanations before moving to the next step.
                                </div>
                                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                                    Track completion against the total day plan to stay on pace.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Roadmap Item */}
            {selectedRoadmapItem ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#235697]">Roadmap item detail</p>
                                <h2 className="mt-2 text-xl font-bold text-slate-900">{selectedRoadmapItem.recommended_content}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeRoadmapPopup}
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Order ID</div>
                                <div className="mt-2 text-lg font-semibold text-slate-900">{selectedRoadmapItem.order_id}</div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</div>
                                <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                                    {selectedRoadmapItem.status === "done" ? "Done" : "In Progress"}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Estimated time</div>
                                <div className="mt-2 text-lg font-semibold text-slate-900">
                                    {selectedRoadmapItem.amount_of_time_days} day{selectedRoadmapItem.amount_of_time_days > 1 ? "s" : ""}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Start date</div>
                                <div className="mt-2 text-lg font-semibold text-slate-900">
                                    {selectedRoadmapItem.start_date
                                        ? selectedRoadmapItem.start_date.toLocaleDateString("vn-VN", { month: "short", day: "numeric" })
                                        : "Not set"}
                                </div>
                            </div>

                            <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Description</div>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedRoadmapItem.detailed_explain}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeRoadmapPopup}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    updateRoadmapItem(selectedRoadmapItem.order_id);
                                    closeRoadmapPopup();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1BA7D9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1596c1]"
                            >
                                <Star className="h-4 w-4 fill-current" />
                                Mark as {selectedRoadmapItem.status === "done" ? "In Progress" : "Done"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Modal New Roadmap */}
            {showCreateRoadmapModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)]">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#235697]">Create New Roadmap</p>
                                <h2 className="mt-2 text-xl font-bold text-slate-900">Generate a personalized learning roadmap</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeCreateRoadmapModal}
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                            >
                                Close
                            </button>
                        </div>

                        <div className="space-y-4 px-6 py-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Practice History</label>
                                <textarea
                                    value={createRoadmapForm.historyPractice}
                                    onChange={(e) => setCreateRoadmapForm(prev => ({ ...prev, historyPractice: e.target.value }))}
                                    placeholder="Describe your practice history and experience..."
                                    className="mt-2 h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Your Target / Goal</label>
                                <textarea
                                    value={createRoadmapForm.userTarget}
                                    onChange={(e) => setCreateRoadmapForm(prev => ({ ...prev, userTarget: e.target.value }))}
                                    placeholder="What is your learning goal? What would you like to improve?"
                                    className="mt-2 h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Total Days Available</label>
                                <input
                                    type="number"
                                    value={createRoadmapForm.totalDaysAvailable}
                                    onChange={(e) => setCreateRoadmapForm(prev => ({ ...prev, totalDaysAvailable: parseInt(e.target.value) || 15 }))}
                                    min="1"
                                    max="365"
                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1BA7D9] focus:ring-2 focus:ring-[#1BA7D9]/20"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeCreateRoadmapModal}
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateRoadmap}
                                disabled={isGeneratingRoadmap}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1BA7D9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1596c1] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGeneratingRoadmap && (
                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-[28px]">
                                        <div className="h-10 w-10 border-4 border-[#1BA7D9] border-t-transparent rounded-full animate-spin" />
                                        <p className="mt-3 text-sm font-medium text-slate-600">
                                            Generating roadmap... Please wait a moment.
                                        </p>
                                    </div>
                                )}
                                {!isGeneratingRoadmap ? "Create Roadmap" : "Generating..."}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div >
    );
}

function RoadmapOverview({ title, goal, progress, totalDays, latestVersion, numberOfSteps, numberOfDoneSteps, onCreateRoadmap }: { title: string, goal: string, progress: number, totalDays: number, latestVersion: string, numberOfSteps: number, numberOfDoneSteps: number, onCreateRoadmap: () => void }) {
    return (
        <div className="flex flex-col gap-6 border-b border-slate-100 px-6 py-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
            <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf4fb] px-3 py-1 text-xs font-semibold text-[#235697]">
                    <Sparkles className="h-3.5 w-3.5" />
                    LATEST ROADMAP VERSION: {latestVersion}
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    Learning Roadmap for{" "}
                    <span className="bg-linear-to-r from-[#235697] to-[#1BA7D9] bg-clip-text text-transparent">
                        {title}
                    </span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                    Goal: {goal}
                </p>
                
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Target className="h-4 w-4" />
                            Goal progress
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">{progress}%</div>
                        <div className="mt-3">
                            <ProgressBar value={progress} />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <CalendarDays className="h-4 w-4" />
                            Total duration
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">{totalDays} days</div>
                        <div className="mt-1 text-sm text-slate-500">{numberOfSteps} learning steps</div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Clock3 className="h-4 w-4" />
                            Suggested pace
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">Recommended pacing</div>
                        <div className="mt-1 text-sm text-slate-500">Varies by topic complexity</div>
                    </div>
                </div>
            </div>

            <button type="button" onClick={onCreateRoadmap} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#235697]/30 bg-white px-4 py-3 text-sm font-semibold tracking-wide text-[#235697] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                Create New Roadmap
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}