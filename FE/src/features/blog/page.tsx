'use client';
import React from 'react';
import Image from 'next/image';
import { BlogSidebar } from './components/BlogSidebar';
import { BlogList } from './components/BlogList';
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection";
import Footer from '@/src/components/layout/Footer';

export default function BlogFeature() {
    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Home_Header page="Blog" />
            
            <HeroSection
                image="/images/Banner2.jpeg"
                title="Lavender Teeducation"
                content="Explore medical insights. Read, learn, and stay ahead! Dive into expert-written 
                        blogs, case studies, and clinical updates to sharpen your diagnostic skills, 
                        broaden your medical knowledge, and stay at the forefront of modern healthcare."
            />

            {/* --- MAIN CONTENT SECTION --- */}
            <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-12 gap-16">
                <BlogList />
                <div className="col-span-12 lg:col-span-4">
                    <BlogSidebar />
                </div>
            </main>

            {/* --- TESTIMONIAL SECTION --- */}
            <section className="bg-gray-50 py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-12 gap-12 items-center">
                    <div className="col-span-12 lg:col-span-5">
                        <h2 className="text-[#1BA7D9] text-4xl font-black mb-4 tracking-tight uppercase">
                            LATEE – Learn, Analyze, Think, Evolve !
                        </h2>
                        <p className="text-gray-500 italic text-xl font-medium">Transform the way you learn medicine !</p>
                    </div>
                    <div className="col-span-12 lg:col-span-7 bg-white p-12 rounded-[3rem] shadow-2xl relative border border-blue-50 transition-transform hover:scale-[1.01]">
                        <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Image key={s} src="/images/star.png" alt="star" width={22} height={22} />
                            ))}
                        </div>
                        <p className="text-gray-600 text-xl leading-relaxed mb-10 italic font-medium">
                            &ldquo;LATEE makes learning clinical reasoning more intuitive and effective. It keeps me motivated and helps me continuously improve.&rdquo;
                        </p>
                        <div className="flex items-center gap-5">
                            <Image src="/images/VP1.jpeg" alt="user" width={70} height={70} className="rounded-full border-4 border-blue-50 shadow-sm" />
                            <div>
                                <h6 className="text-[#235697] font-extrabold text-xl">Thomas</h6>
                                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">3rd year medical student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}