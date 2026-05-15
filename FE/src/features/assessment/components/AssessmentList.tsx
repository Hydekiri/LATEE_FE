"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ClockIcon,
    ChartBarIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon
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

type SortField =
    | "createdAt"
    | "title"
    | "difficultyLevel"
    | "specialty";

type SortOrder = "asc" | "desc";

export default function AssessmentList() {
    const router = useRouter();
    const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // ================= FILTER STATES =================
    const [search, setSearch] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All specialties");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const fetchAssessments = useCallback(async () => {
        try {
            const accessToken = getCookie("accessToken");

            const res = await fetch("http://localhost:5000/assessment/api/assessments/all", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch assessments");

            const data: AssessmentItem[] = await res.json();

            // const sorted = data
            //     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            //     .slice(0, 3);
            // setAssessments(sorted);
            setAssessments(data);
            console.log("Fetched assessments:", data);
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

    // ================= SPECIALTY OPTIONS =================
    const specialtyOptions = useMemo(() => {
        const specialties = assessments.map((a) => a.specialty).filter(Boolean);

        return ["All specialties", ...Array.from(new Set(specialties))];
    }, [assessments]);

    // ================= FILTER + SORT =================
    const filteredAssessments = useMemo(() => {
        let filtered = [...assessments];

        // ---------- SEARCH ----------
        if (search.trim()) {
            const keyword = search.toLowerCase();

            filtered = filtered.filter((item) => {
                return (
                    item.assessmentId?.toLowerCase().includes(keyword) ||
                    item.title?.toLowerCase().includes(keyword) ||
                    item.descriptions?.toLowerCase().includes(keyword) ||
                    item.topic?.toLowerCase().includes(keyword)
                );
            });
        }

        // ---------- LEVEL ----------
        if (selectedLevel !== "All") {
            filtered = filtered.filter(
                (item) => item.difficultyLevel === selectedLevel
            );
        }

        // ---------- SPECIALTY ----------
        if (selectedSpecialty !== "All specialties") {
            filtered = filtered.filter(
                (item) => item.specialty === selectedSpecialty
            );
        }

        // ---------- SORT ----------
        filtered.sort((a, b) => {
            let compareValue = 0;

            // TIME FIELD
            if (sortField === "createdAt") {
                compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            // STRING FIELD
            else {
                compareValue = String(a[sortField]).toLowerCase()
                    .localeCompare(String(b[sortField])
                        .toLowerCase());
            }

            return sortOrder === "asc" ? compareValue : -compareValue;
        });

        return filtered;
    }, [assessments, search, selectedLevel, selectedSpecialty, sortField, sortOrder]);

    const goToDetail = (id: string) => {
        router.push(`/assessment/${id}?tab=about`);
    };

    if (loading) return <div className="mt-12 text-center text-[#235697]">Loading your assessments...</div>;

    return (
        <section className="w-full flex flex-col gap-8 mt-12">
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-end">
                <div className="max-w-3xl">
                    <h2 className="text-[32px] font-bold text-[#235697]">Your Assessment</h2>
                    <p className="text-[#0E2A46] text-sm mt-1 opacity-80">
                        Test your knowledge with AI-generated clinical cases.
                    </p>
                </div>
            </div>

            {/* ================= FILTER BAR ================= */}
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

                {/* SEARCH */}
                <div className="relative w-full xl:max-w-xl">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 right-5 text-[#235697]" />

                    <input
                        type="text"
                        placeholder="Search assessment..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-[#235697]/30
                            bg-white
                            px-5
                            py-4
                            pr-14
                            text-[#235697]
                            outline-none
                            focus:border-[#1BA7D9]
                            shadow-sm
                        "
                    />
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-4">

                    {/* LEVEL */}
                    <div className="relative">
                        <select
                            value={selectedLevel}
                            onChange={(e) =>
                                setSelectedLevel(
                                    e.target.value
                                )
                            }
                            className="
                                appearance-none
                                rounded-xl
                                border
                                border-[#235697]/30
                                bg-white
                                px-5
                                py-3
                                pr-10
                                text-[#235697]
                                font-semibold
                                outline-none
                                min-w-[170px]
                            "
                        >
                            <option value="All">
                                All Levels
                            </option>

                            <option value="Beginner">
                                Beginner
                            </option>

                            <option value="Intermediate">
                                Intermediate
                            </option>

                            <option value="Advanced">
                                Advanced
                            </option>

                            <option value="Expert">
                                Expert
                            </option>
                        </select>

                        <ChevronDownIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#235697] pointer-events-none" />
                    </div>

                    {/* RECENTLY */}
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) =>
                                setSortOrder(
                                    e.target
                                        .value as SortOrder
                                )
                            }
                            className="
                                appearance-none
                                rounded-xl
                                border
                                border-[#235697]/30
                                bg-white
                                px-5
                                py-3
                                pr-10
                                text-[#235697]
                                font-semibold
                                outline-none
                                min-w-[160px]
                            "
                        >
                            <option value="desc">
                                Recently Newest
                            </option>

                            <option value="asc">
                                Recently Oldest
                            </option>
                        </select>

                        <ChevronDownIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#235697] pointer-events-none" />
                    </div>

                    {/* SPECIALTY */}
                    <div className="relative">
                        <select
                            value={selectedSpecialty}
                            onChange={(e) =>
                                setSelectedSpecialty(
                                    e.target.value
                                )
                            }
                            className="
                                appearance-none
                                rounded-xl
                                border
                                border-[#235697]/30
                                bg-white
                                px-5
                                py-3
                                pr-10
                                text-[#235697]
                                font-semibold
                                outline-none
                                min-w-[180px]
                            "
                        >
                            {specialtyOptions.map(
                                (specialty) => (
                                    <option
                                        key={specialty}
                                        value={specialty}
                                    >
                                        {specialty}
                                    </option>
                                )
                            )}
                        </select>

                        <ChevronDownIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#235697] pointer-events-none" />
                    </div>

                    {/* SORT FIELD */}
                    <div className="relative">
                        <select
                            value={sortField}
                            onChange={(e) =>
                                setSortField(
                                    e.target
                                        .value as SortField
                                )
                            }
                            className="
                                appearance-none
                                rounded-xl
                                border
                                border-[#235697]/30
                                bg-white
                                px-5
                                py-3
                                pr-10
                                text-[#235697]
                                font-semibold
                                outline-none
                                min-w-[170px]
                            "
                        >
                            <option value="createdAt">
                                Sort: CreatedAt
                            </option>

                            <option value="title">
                                Sort: Title
                            </option>

                            <option value="difficultyLevel">
                                Sort: Level
                            </option>

                            <option value="specialty">
                                Sort: Specialty
                            </option>
                        </select>

                        <ChevronDownIcon className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#235697] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* ================= LIST ================= */}
            <div className="flex flex-col gap-6">
                {filteredAssessments.map((item) => (
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

                            <p className="text-[13px] text-[#0E2A46] opacity-90 mb-4">
                                <span className="font-bold text-[#235697]">Topic: </span>
                                {item.topic || "N/A"}
                                {item.descriptions && (
                                    <p className="line-clamp-2"><span className="font-bold text-[#235697]">Desc: </span>{item.descriptions}</p>
                                )}
                            </p>

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
                ))
                }
            </div >
        </section >
    );
}