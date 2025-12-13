"use client";

import Image from "next/image";
import Footer from "@/src/components/layout/Footer";
import Home_Header from "@/src/components/layout/Home_Header";
import Testimonial from "@/src/components/layout/testimonial";
import SearchBar from "@/src/components/layout/searchbar";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <main className="w-full flex flex-col items-center overflow-hidden">
            {/* NAVBAR */}
            <Home_Header page="Home" />

            {/* Hero Section */}
            <section className="flex justify-center">
                <Image 
                    src="/images/bghomepage.png" 
                    alt="background" 
                    width={1920} 
                    height={1080} 
                    className="w-full h-auto pointer-events-none absolute top-0 left-0 -z-10"
                    priority // Tải ngay lập tức vì là ảnh lớn nhất (LCP)
                />
            </section>

            {/* Welcome / Greeting Section */}
            <section className="w-full flex flex-col items-center space-y-[10px] mb-[74px]">
                <div className="max-w-[85%] text-white text-[44px] xl:text-[72px] font-lato-black mt-[5%] xl:mt-[10%] mb-1 xl:mb-1 flex justify-center z-10">
                    <p id="greeting" className="">Good morning, Nguyen &apos;s Tu</p>
                </div>
                <div className="w-[auto] xl:w-[375px] max-w-[1219px] px-20 py-0.5 bg-white mb-1 xl:mb-4 flex justify-center items-center z-10">
                    {/* Decorative line/box */}
                </div>
                <div className="w-[auto] xl:w-full max-w-[1219px] text-white font-lato-heavy-i text-[32px] xl:text-[48px] mb-1 xl:mb-2 flex justify-center">
                    <p className="">Welcome to Latee</p>
                </div>
                <div className="w-[auto] xl:w-full max-w-[1219px] italic text-white text-[14px] xl:text-[40px] mb-1 xl:mb-3 flex justify-center">
                    <p className="">A smarter way to practice clinical decision-making.</p>
                </div>
                <div className="w-[auto] xl:w-full max-w-[1219px] text-white font-lato-bold text-[24px] xl:text-[32px] mb-2 xl:mb-10 flex justify-center">
                    <p className="">Choose your module to start now !</p>
                </div>
            </section>

            {/* Search Bar */}
            <SearchBar />

            {/* Learning Modules Section */}
            <section className="w-full flex flex-col items-center mt-10 xl:mt-[65px]">
                <div className="w-[86%] bg-white py-5 xl:py-[47px] rounded-[5px] xl:rounded-[8px]">
                    <div className="w-[92.7%] mb-[31px] mx-auto flex items-center justify-between">
                        <h2 className="relative text-[48px] font-semibold font-inter text-[#000000] w-full inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-10px] after:w-full after:h-[5px] after:bg-gradient-to-r after:from-[#235697] after:to-[#1ba7d9] after:rounded-full">
                            Learning Modules
                        </h2>
                    </div>
                    
                    {/* Modules Grid */}
                    <div className="grid xl:grid-cols-2 gap-8 w-[92.7%] mx-auto">
                        {[
                            {
                                img: "/images/practicemodedoctor.png",
                                title: "Practice Mode",
                                desc: "Engage in interactive clinical scenarios to improve decision-making skills in a risk-free environment.",
                                button: "Start Practice →",
                                link: "/practice"
                            },
                            {
                                img: "/images/assessmentdoctor.png",
                                title: "Take Assessment",
                                desc: "Test your proficiency with structured assessments designed to assess clinical competence.",
                                button: "Join Assessment →",
                                link: "/assessment"
                            },
                            {
                                img: "/images/progressmodule.png",
                                title: "Track Persona Progress",
                                desc: "Monitor your learning journey with detailed analytics on performance, improvement, and skill mastery.",
                                button: "View Progress →",
                                link: "/progress"
                            },
                            {
                                img: "/images/knowledgedoctor.png",
                                title: "Access Knowledge Resource",
                                desc: "Explore curated medical materials, guidelines, and reference documents to support your learning.",
                                button: "View Resource →",
                                link: "/blog"
                            },
                        ].map((m, i) => (
                            <div
                                key={i}
                                className="
                                    relative 
                                    overflow-hidden 
                                    rounded-[20px] 
                                    border-transparent 
                                    h-[600px] 
                                    w-full 
                                    group 
                                    cursor-pointer
                                    shadow-[0_10px_20px_-15px_rgba(0,0,0,0.3)] 
                                    transition-all 
                                    duration-300 
                                    hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]
                                    hover:-translate-y-1
                                "
                                onClick={() => router.push(m.link)}
                            >
                                {/* Ảnh nền Module */}
                                <Image
                                    src={m.img}
                                    alt={m.title}
                                    fill
                                    sizes="(max-width: 1280px) 90vw, 50vw" // Optimize size tải ảnh
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Lớp nội dung bên dưới (Màu trắng) */}
                                <div className="absolute bottom-0 left-0 w-full bg-white p-8 pt-10 rounded-t-[20px] shadow-md text-center flex flex-col items-center z-10">
                                    <h3 className="text-[36px] font-lato-bold text-[#333333] mb-3">
                                        {m.title}
                                    </h3>

                                    <p className="text-[#333333] font-lato-r text-[24px] leading-relaxed mb-6 line-clamp-3">
                                        {m.desc}
                                    </p>

                                    <button className="bg-[#1ba7d9] text-white w-auto h-[50px] px-[24px] py-3 rounded-md text-[16px] font-lato-black cursor-pointer hover:bg-[#158ab8] transition shadow-md hover:shadow-lg transform active:scale-95">
                                        {m.button}
                                    </button>
                                </div>
                            </div>
                        ))}
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