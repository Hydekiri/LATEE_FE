// src/features/practice/page.tsx
"use client";

import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection"; // Check casing: HeroSection vs herosection
import Testimonial from "@/src/components/layout/testimonial";
import Footer from "@/src/components/layout/Footer";
import PatientCard from "@/src/features/practice/components/Practice_Card";
import { MOCK_PATIENTS } from "@/src/data/mockData"; // IMPORT SHARED DATA
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function PracticePageFeature() {
    // Use the shared mock data directly. No need for useEffect/useState for static mock data.
    const data = MOCK_PATIENTS;

    return (
        <main className="w-full flex flex-col items-center overflow-hidden bg-gray-50">
            <Home_Header page="Practice" />

            <HeroSection
                image="/images/bgLearner2.jpg"
                title="Lavender Teeducation"
                content="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
            />

            <section className="relative w-full flex flex-col items-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bgLearner5.jpeg')" }}
            >
                <div className="w-[90%] xl:w-[86%] flex flex-col items-center gap-8 xl:gap-12 pb-20">

                    {/* SEARCH + FILTER */}
                    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-center mt-10 xl:mt-[65px]">
                        <div className="xl:col-span-5 w-full">
                            <div className="flex items-center h-12 border border-[#235697] rounded-lg bg-white px-4 xl:px-6 w-full shadow-sm hover:shadow-md transition">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full h-full font-inter-semibold text-base placeholder-[#235697]/60 outline-none text-[#235697]"
                                    />
                                </div>
                                <div className="flex cursor-pointer text-[#235697]">
                                    <MagnifyingGlassIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-7 w-full overflow-x-auto scrollbar-hide">
                            <div className="flex gap-3 xl:gap-4 justify-start xl:justify-end min-w-max pb-2 xl:pb-0">
                                {["New +", "Level", "Occupation", "Sort by"].map((filter) => (
                                    <button 
                                        key={filter} 
                                        className="border border-[#235697] px-4 xl:px-6 py-2.5 rounded-lg bg-white text-[#235697] font-semibold text-sm xl:text-base hover:bg-[#235697] hover:text-white transition-all shadow-sm whitespace-nowrap"
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* GRID LIST */}
                    <div className="w-full min-h-[500px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-[30px]">
                            {data.map((item) => (
                                <PatientCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-12 text-[#235697] text-sm bg-white border border-[#235697] px-4 py-3 rounded-lg shadow-sm gap-4">
                        <p className="font-medium">Showing 1 – {data.length} of {data.length} items</p>
                        <div className="flex items-center gap-2 text-[14px]">
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition disabled:opacity-50">&lt;</button>
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md bg-[#235697] text-white font-bold shadow-md">1</button>
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition">&gt;</button>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial />
            <Footer />
        </main >
    );
}