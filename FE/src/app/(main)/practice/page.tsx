"use client";

import Image from "next/image";
import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/navbarbasicpage";
import Testimonial from "@/src/components/layout/testimonial";
import HeroSection from "@/src/components/layout/herosection";
import { useRouter } from "next/dist/client/components/navigation";
import { use } from "react";

export default function Home() {
    const router = useRouter();

    const abdominalIssues = [
        "Acute appendicitis",
        "Gallbladder inflammation",
        "Irritable bowel syndrome (IBS)",
        "Peptic ulcer pain",
        "Acute pancreatitis",
        "Small bowel obstruction"
    ];

    const data = Array.from({ length: 9 }).map((_, i) => ({
        id: `PT00${i + 1}`,
        img: `/images/VirtualPatient/VP${i + 1}.jpeg`, // đổi lại đường dẫn hình của bạn
        level: "Level 1",
        time: "10 - 20 mins",
        occupation: i % 2 === 0 ? "Child" : "Old woman",
        description: "Clinically relevant. Real-world scenarios.",
        chiefConcern: abdominalIssues[Math.floor(Math.random() * abdominalIssues.length)],
        date: "Sep 20, 2023",
        feedback: Math.floor(Math.random() * 100) + 1,
    }));

    return (
        <main className="w-full flex flex-col items-center overflow-hidden">
            {/* NAVBAR */}
            <Navbar currentPage="practice" />

            {/* Hero Section */}
            <HeroSection
                image="/images/bgLearner2.jpg"
                title="Lavender Teeducation"
                content="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
            />


            {/* Practice Mode Modules Section */}
            <section className="relative w-full flex flex-col items-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bgLearner5.jpeg')" }}
            >
                <div className="w-[86%] flex flex-col items-center gap-12">

                    {/* SEARCH + FILTER */}
                    <div className="w-full h-12 grid grid-cols-400 justify-between items-center mt-10 xl:mt-[65px]">
                        {/* Search */}
                        <div className="col-span-179 flex items-center h-full border border-gray-300 rounded-lg bg-white px-6">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full h-full font-inter-semibold text-4 placeholder-[#235697]"
                                />
                            </div>
                            <div className="flex">
                                <Image
                                    src="/images/searchicon.png"
                                    alt="searchicon"
                                    width={24}
                                    height={24}
                                    className="w-4 h-4 xl:w-[23px] xl:h-[23px]"
                                />
                            </div>
                        </div>

                        <div className="col-span-25"></div>

                        {/* Filters */}
                        <div className="justify-between col-span-196 flex h-full gap-5 text-[#235697] font-inter-semibold text-4">
                            <button className="border px-8 py-2 rounded-lg bg-white hover:bg-gray-100">
                                New +
                            </button>
                            <button className="border px-8 py-2 rounded-lg bg-white hover:bg-gray-100">
                                Level
                            </button>
                            <button className="border px-8 py-2 rounded-lg bg-white hover:bg-gray-100">
                                Occupation
                            </button>
                            <button className="border px-8 py-2 rounded-lg bg-white hover:bg-gray-100">
                                Sort by
                            </button>
                        </div>
                    </div>

                    {/* GRID LIST */}
                    <div className="w-full">
                        <div className="
                        grid
                        grid-cols-1 
                        lg:grid-cols-3
                        gap-[30px]
                        ">
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative h-[480px] bg-white border-transparent rounded-[20px] shadow-sm overflow-hidden hover:shadow-lg transition"
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={item.img}
                                        alt={item.id}
                                        className="w-full h-7/12 object-cover"
                                    />

                                    {/* CONTENT */}
                                    <div className="absolute h-7/12 bottom-0 left-0 w-full bg-white rounded-t-[20px] p-5 flex flex-col gap-3">

                                        {/* Row 1 */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-[#235697] font-lato-bold text-[16px]">{item.id}</span>

                                            <div className="flex items-center gap-3">
                                                {/* ICON LEVEL */}
                                                <span className="h-4 w-4">📶</span>
                                                <span className="font-lato-r text-4 text-[#293241]">Level {item.level}</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* ICON CLOCK */}
                                                <span>⏱️</span>
                                                <span className="font-lato-r text-4 text-[#293241]">{item.time}</span>
                                            </div>
                                        </div>

                                        {/* Row 2 */}
                                        <div className="flex items-center gap-3 text-[13px] text-gray-600">
                                            <div className="flex items-center gap-1">
                                                {/* ICON CALENDAR */}
                                                <span>📅</span>
                                                <span className="font-lato-r text-[14px] text-[#235697]">{item.date}</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {/* ICON FEEDBACK */}
                                                <span>💬</span>
                                                <span className="font-lato-r text-[14px] text-[#235697]">Feedback ({item.feedback})</span>
                                            </div>
                                        </div>

                                        {/* Introduction */}
                                        <p className="text-[#235697] font-inter-bold mt-1 text-[16px]">
                                            Introduction
                                        </p>
                                        <p className="text-[#0e2a46] font-lato-r text-[14px] leading-snug">
                                            {item.description}
                                        </p>

                                        {/* Chief Concern */}
                                        <p className="text-[#235697] font-inter-bold text-[16px]">
                                            Chief concern
                                        </p>

                                        <div className="flex justify-between items-center">
                                            <p className="text-[#0e2a46] font-lato-r text-[14px] leading-snug">
                                                {item.chiefConcern}
                                            </p>

                                            {/* Button */}
                                            <button
                                                onClick={() => router.push(`/practice/${item.id}`)}
                                                className="
                                                bg-[#E4F3FF]
                                                text-[#235697]
                                                px-6 py-4
                                                rounded-lg text-[16px] font-lato-medium
                                                hover:bg-[#d3ebff]
                                                transition flex items-center justify-center
                                            "
                                            >
                                                Join Practice →
                                            </button>
                                        </div>



                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="w-full flex justify-between items-center mb-12 text-gray-700 text-sm bg-white px-4 py-2 rounded-md">
                        <p>1 – 9 of 13 items</p>

                        <div className="flex items-center gap-2 text-[14px]">
                            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                                &lt;
                            </button>
                            <button className="px-3 py-1 border rounded-md bg-[#235697] text-white">
                                1
                            </button>
                            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                                2
                            </button>
                            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <Testimonial />

            {/* FOOTER */}
            <Footer />

        </main >
    );
}