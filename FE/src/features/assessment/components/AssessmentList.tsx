"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
    MagnifyingGlassIcon, 
    ClockIcon, 
    CalendarDaysIcon, 
    ChartBarIcon,
    ChevronDownIcon
} from "@heroicons/react/24/solid";

const ASSESSMENT_LIST = [
    {
        id: "AS01",
        title: "Kidney Function & Renal Disorders",
        subTitle: "Understanding Edema and Kidney Disease",
        description: "Explore the mechanisms behind fluid retention, nephrotic and nephritic syndromes, and acute versus chronic renal failure through interactive cases.",
        author: "Dr. Jane Carter",
        date: "Nov 6, 2025",
        deadline: "08/11/2025",
        level: "Level 1",
        time: "30 minutes",
        img: "/images/quizz1.jpeg"
    },
    {
        id: "AS02",
        title: "Respiratory System",
        subTitle: "Diagnosing Common Causes of Cough",
        description: "Work through a case of persistent cough and fever. Identify key findings that distinguish pneumonia, bronchitis, and asthma.",
        author: "Dr. Lila Nguyen",
        date: "Nov 8, 2025",
        deadline: "10/11/2025",
        level: "Level 1",
        time: "30 minutes",
        img: "/images/quizz2.jpeg"
    },
    {
        id: "AS03",
        title: "Cardiovascular Assessment",
        subTitle: "Chest Pain and Cardiac Risk Evaluation",
        description: "Assess a patient presenting with chest pain and shortness of breath. Learn to differentiate myocardial infarction, angina, and heart failure.",
        author: "Dr. Michael Reed",
        date: "Nov 8, 2025",
        deadline: "12/11/2025",
        level: "Level 1",
        time: "45 minutes",
        img: "/images/quizz3.jpeg"
    }
];

export default function AssessmentList() {
    const router = useRouter();

    return (
        <section className="w-full flex flex-col gap-8 mt-12">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div className="max-w-3xl">
                    <h2 className="text-[32px] font-lato-bold text-[#235697]">Your Assessment</h2>
                    <p className="text-[#0E2A46] text-sm mt-1 opacity-80 font-lato-r">
                        Test your knowledge with interactive assessments designed for medical learners. Each assessment covers key organ systems and case-based reasoning !
                    </p>
                </div>
                <button className="text-[#235697] font-lato-bold hover:underline text-sm border-b-2 border-[#235697]">
                    View All Assessment
                </button>
            </div>

            {/* SEARCH & FILTERS SECTION - NEW */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-center mt-2">
                {/* Search Bar */}
                <div className="xl:col-span-5 w-full">
                    <div className="flex items-center h-12 border border-[#235697]/20 rounded-lg bg-white px-5 shadow-sm focus-within:border-[#235697]/50 transition-all">
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 h-full outline-none text-[15px] text-[#235697] placeholder-[#235697]/40 font-lato-r"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-[#235697]/60" />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="xl:col-span-7 w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 justify-start xl:justify-end min-w-max">
                        {["Level", "Recently", "Occupation", "Sort by"].map((filter) => (
                            <button 
                                key={filter} 
                                className="flex items-center gap-2 border border-[#235697]/30 px-5 py-2.5 rounded-lg bg-white text-[#235697] font-lato-bold text-[14px] hover:bg-[#235697]/5 transition-all shadow-sm"
                            >
                                {filter}
                                <ChevronDownIcon className="w-4 h-4 opacity-60" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Items */}
            <div className="flex flex-col gap-6">
                {ASSESSMENT_LIST.map((item) => (
                    <div 
                        key={item.id} 
                        className="group flex flex-col lg:flex-row items-stretch bg-[#F0F8FF] rounded-[18px] border border-[#235697]/10 p-5 gap-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
                        onClick={() => router.push(`/assessment/${item.id}`)}
                    >
                        {/* PHẦN 1: ẢNH */}
                        <div className="relative w-full lg:w-[300px] h-[180px] rounded-xl overflow-hidden shrink-0 shadow-inner">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* PHẦN 2: NỘI DUNG */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#235697]/10 rounded-lg text-[10px] font-lato-bold text-[#235697]">
                                    <ClockIcon className="w-3.5 h-3.5" /> {item.time}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#235697]/10 rounded-lg text-[10px] font-lato-bold text-[#235697]">
                                    <CalendarDaysIcon className="w-3.5 h-3.5" /> Deadline: {item.deadline}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#235697]/10 rounded-lg text-[10px] font-lato-bold text-[#235697]">
                                    <ChartBarIcon className="w-3.5 h-3.5" /> {item.level}
                                </span>
                            </div>

                            <h3 className="text-[20px] font-lato-bold text-[#235697] leading-tight mb-1 group-hover:text-[#1BA7D9] transition-colors truncate">
                                {item.title}
                            </h3>
                            
                            <p className="text-[13px] font-lato-bold text-[#235697]/80 mb-2 truncate">
                                Title: <span className="font-lato-r">{item.subTitle}</span>
                            </p>

                            <p className="text-[13px] text-[#0E2A46] font-lato-r opacity-90 leading-relaxed line-clamp-2 mb-4">
                                <span className="font-lato-bold text-[#235697]">Description: </span>
                                {item.description}
                            </p>

                            <div className="mt-auto">
                                <span className="text-[12px] font-lato-bold text-[#235697]">
                                    By <span className="underline">{item.author}</span>
                                </span>
                            </div>
                        </div>

                        {/* PHẦN 3: NÚT BẤM & NGÀY THÁNG */}
                        <div className="shrink-0 flex flex-col justify-between items-end pl-4 py-1">
                            <button
                                className="flex items-center gap-2 bg-[#1BA7D9] text-white px-7 py-3 rounded-xl font-lato-bold text-sm hover:bg-[#235697] transition-all shadow-md group/btn whitespace-nowrap"
                            >
                                Start Now 
                                <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                            </button>

                            <span className="text-[11px] text-gray-500 font-lato-r">
                                {item.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}