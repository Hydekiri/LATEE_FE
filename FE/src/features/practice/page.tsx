// src/features/practice/page.tsx
"use client";

import { useEffect, useState } from "react";
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection"; 
import Testimonial from "@/src/components/layout/testimonial";
import Footer from "@/src/components/layout/Footer";
import PatientCard from "@/src/features/practice/components/Practice_Card";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { patientService } from "@/src/services/patient-servvice";
import { PatientData } from "@/src/types/practice";

export default function PracticePageFeature() {
    const [patients, setPatients] = useState<PatientData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        
        patientService.getVirtualPatients(1, 9)
            .then((res) => {
                if (isMounted) {
                    setPatients(res.items);
                    setTotalItems(res.total);
                }
            })
            .catch((err: Error) => {
                console.error("[ERROR]: Failed to fetch patients", err.message);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

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
                    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-center mt-10 xl:mt-16.25">
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
                    <div className="w-full min-h-125">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235697]"></div>
                            </div>
                        ) : patients.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5">
                                {patients.map((item) => (
                                    <PatientCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No virtual patients found.</p>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION*/}
                    <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-12 text-[#235697] text-sm bg-white border border-[#235697] px-4 py-3 rounded-lg shadow-sm gap-4">
                        <p className="font-medium">
                            Showing 1 – {patients.length} of {totalItems} items
                        </p>
                        <div className="flex items-center gap-2 text-[14px]">
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition disabled:opacity-50">
                                &lt;
                            </button>
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md bg-[#235697] text-white font-bold shadow-md">
                                1
                            </button>
                            <button className="px-3 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Testimonial />
            <Footer />
        </main>
    );
}