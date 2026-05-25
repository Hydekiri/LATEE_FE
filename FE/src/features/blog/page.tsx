'use client';
import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { BlogSidebar } from './components/BlogSidebar';
import { BlogList } from './components/BlogList';
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection";
import Footer from '@/src/components/layout/Footer';
import Testimonial from '@/src/components/layout/testimonial';
import { getKnowledgeResources } from '@/src/services/knowledge-resources-service';
import { KnowledgeResource } from '@/src/types/knowledge-resources';

export default function BlogFeature() {
    const [blogs, setBlogs] = useState<KnowledgeResource[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getKnowledgeResources();
                setBlogs(res);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filtered =
        useMemo(() => {

            return blogs.filter(
                (x: KnowledgeResource) =>
                    x.title
                        ?.toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )
            );

        }, [blogs, search]);

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
                <BlogList
                    loading={loading}
                    blogs={filtered}
                />

                <div className="col-span-12 lg:col-span-4">
                    <BlogSidebar
                        search={search}
                        setSearch={setSearch}
                        blogs={blogs}
                    />
                </div>

            </main>

            <Testimonial />

            <Footer />
        </div>
    );
}