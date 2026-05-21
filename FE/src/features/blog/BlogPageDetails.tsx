"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import HeroSection from "@/src/components/layout/herosection";
import Footer from "@/src/components/layout/Footer";
import Home_Header from "@/src/components/layout/Home_Header";
import { KnowledgeResource } from "@/src/types/knowledge-resources";
import Link from "next/dist/client/link";

// Reading-progress hook 
function useReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return progress;
}

// Component 
const BlogPageDetails = ({ data }: { data: KnowledgeResource }) => {
    const progress = useReadingProgress();
    const articleRef = useRef<HTMLElement>(null);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <p className="font-mono text-sm text-neutral-500 tracking-widest uppercase">
                    Resource not found
                </p>
            </div>
        );
    }

    const publishedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;1,8..60,300;1,8..60,400&family=JetBrains+Mono:wght@400;500&display=swap');

                :root {
                    --ink: #0a0a0a;
                    --ink-faint: #6b6b6b;
                    --surface: #f9f9f8;
                    --border: rgba(0,0,0,0.08);
                    --accent: #0066ff;
                    --accent-warm: #ff4d00;
                }

                /* ── Reading progress bar ── */
                .progress-bar {
                    position: fixed;
                    top: 0; left: 0;
                    height: 2px;
                    background: var(--accent);
                    transition: width 0.1s linear;
                    z-index: 9999;
                    box-shadow: 0 0 8px rgba(0,102,255,0.5);
                }

                /* ── Hero grain overlay ── */
                .hero-grain::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 120px;
                    pointer-events: none;
                    opacity: 0.6;
                }

                /* ── Hero title font ── */
                .hero-title {
                    font-family: 'Bricolage Grotesque', sans-serif;
                    font-weight: 800;
                }

                .mono-label {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                /* ── Article body prose ── */
                .article-body {
                    font-family: 'Source Serif 4', Georgia, serif;
                    font-size: 19px;
                    line-height: 1.85;
                    color: #1a1a1a;
                }
                .article-body h1,
                .article-body h2,
                .article-body h3,
                .article-body h4 {
                    font-family: 'Bricolage Grotesque', sans-serif;
                    font-weight: 700;
                    color: #0a0a0a;
                    letter-spacing: -0.025em;
                    line-height: 1.2;
                }
                .article-body h2 {
                    font-size: 2rem;
                    margin-top: 3.5rem;
                    margin-bottom: 1.25rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                }
                .article-body h3 {
                    font-size: 1.375rem;
                    margin-top: 2.5rem;
                    margin-bottom: 0.875rem;
                }
                .article-body p {
                    margin-bottom: 1.625rem;
                }
                .article-body a {
                    color: var(--accent);
                    text-decoration: underline;
                    text-decoration-color: rgba(0,102,255,0.35);
                    text-underline-offset: 3px;
                    transition: text-decoration-color 0.2s;
                }
                .article-body a:hover {
                    text-decoration-color: var(--accent);
                }
                .article-body blockquote {
                    margin: 2.5rem 0;
                    padding: 1.25rem 1.75rem;
                    background: #f4f4f2;
                    border-left: 3px solid var(--accent);
                    border-radius: 0 8px 8px 0;
                    font-style: italic;
                    color: #444;
                }
                .article-body ul {
                    list-style: none;
                    padding: 0;
                    margin: 1.5rem 0;
                }
                .article-body ul li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .article-body ul li::before {
                    content: '—';
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                    font-weight: 500;
                }
                .article-body ol {
                    padding-left: 1.5rem;
                }
                .article-body ol li {
                    margin-bottom: 0.75rem;
                    color: #1a1a1a;
                }
                .article-body code {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.8em;
                    background: #f0f0ee;
                    padding: 0.15em 0.4em;
                    border-radius: 4px;
                    color: var(--accent-warm);
                }
                .article-body pre {
                    background: #0a0a0a;
                    border-radius: 12px;
                    padding: 1.5rem;
                    overflow-x: auto;
                    margin: 2rem 0;
                }
                .article-body pre code {
                    background: transparent;
                    color: #e2e2e2;
                    font-size: 0.875rem;
                    padding: 0;
                }
                .article-body strong {
                    font-weight: 600;
                    color: #0a0a0a;
                }
                .article-body img {
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    width: 100%;
                    height: auto;
                }

                /* ── Sidebar share button ── */
                .share-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    border: 1px solid rgba(0,0,0,0.12);
                    background: white;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    color: #0a0a0a;
                }
                .share-btn:hover {
                    background: #0a0a0a;
                    color: white;
                    border-color: #0a0a0a;
                }

                /* ── Meta pill ── */
                .meta-pill {
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                    padding: 12px 20px;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    backdrop-filter: blur(12px);
                }

                /* ── Cover image wrapper ── */
                .cover-wrapper {
                    overflow: hidden;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                    box-shadow: 0 32px 96px -16px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
                }

                /* ── Scroll-reveal animation ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-up-1 { animation: fadeUp 0.65s ease both 0.05s; }
                .fade-up-2 { animation: fadeUp 0.65s ease both 0.18s; }
                .fade-up-3 { animation: fadeUp 0.65s ease both 0.3s; }
                .fade-up-4 { animation: fadeUp 0.65s ease both 0.42s; }
                .fade-up-5 { animation: fadeUp 0.65s ease both 0.54s; }
            `}</style>

            {/* Reading progress bar */}
            <div className="progress-bar" style={{ width: `${progress}%` }} />

            <div className="min-h-screen bg-[#f9f9f8]" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>

                <Home_Header page="Blog" />

                <main>

                    {/* ═══════════════════════════════════════
                        HERO  —  dark, editorial
                    ════════════════════════════════════════ */}
                    <section
                        className="relative overflow-hidden hero-grain bg-gradient-to-r from-[#235697] to-[#1ba7d9]"
                    //style={{ background: "linear-gradient(160deg, #0d0d0d 0%, #111 60%, #161616 100%)" }}
                    >
                        {/* Accent glow */}

                        <HeroSection
                            image="/images/Banner2.jpeg"
                            title="Lavender Teeducation"
                            content="Explore medical insights. Read, learn, and stay ahead! Dive into expert-written 
                                                blogs, case studies, and clinical updates to sharpen your diagnostic skills, 
                                                broaden your medical knowledge, and stay at the forefront of modern healthcare."
                        />
                        <div
                            className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)",
                                transform: "translateY(-50%)",
                            }}
                        />
                        {/* Warm accent glow */}
                        <div
                            className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
                            style={{
                                background: "radial-gradient(circle, rgba(255,77,0,0.05) 0%, transparent 70%)",
                            }}
                        />

                        <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12 pt-28 pb-20">

                            {/* Category badge */}
                            <div className="fade-up-1 inline-flex items-center gap-2.5 mb-8">
                                <span
                                    className="mono-label text-white/100"
                                >
                                    Knowledge resource
                                </span>
                                <span className="w-px h-3 bg-white/40" />
                                <span
                                    className="mono-label px-3 py-1 rounded-md text-white/100"
                                // style={{
                                //     background: "rgba(0,102,255,0.15)",
                                //     color: "rgba(100,160,255,1)",
                                //     border: "1px solid rgba(0,102,255,0.2)"
                                // }}
                                >
                                    Medical Education
                                </span>
                            </div>

                            {/* Title */}
                            <h1
                                className="hero-title fade-up-2 text-white"
                                style={{
                                    fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
                                    lineHeight: 1.05,
                                    letterSpacing: "-0.03em",
                                    maxWidth: "fit-content",
                                }}
                            >
                                {data.title}
                            </h1>

                            {/* Divider line */}
                            <div
                                className="fade-up-3 mt-10 mb-8 h-px"
                                style={{ background: "linear-gradient(to right, rgba(255,255,255,0.12), transparent)" }}
                            />

                            {/* Meta pills */}
                            <div className="fade-up-4 flex flex-wrap gap-3">

                                <div className="meta-pill">
                                    <span className="mono-label" style={{ color: "rgba(255,255,255,0.35)" }}>Author</span>
                                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                                        {data.authorlist}
                                    </span>
                                </div>

                                <div className="meta-pill">
                                    <span className="mono-label" style={{ color: "rgba(255,255,255,0.35)" }}>Published</span>
                                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                                        {publishedDate}
                                    </span>
                                </div>

                                {/* <div className="meta-pill">
                                    <span className="mono-label" style={{ color: "rgba(255,255,255,0.35)" }}>Read time</span>
                                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                                        10 min
                                    </span>
                                </div> */}

                            </div>

                        </div>
                    </section>


                    {/* ═══════════════════════════════════════
                        COVER IMAGE
                    ════════════════════════════════════════ */}
                    <section className="px-6 lg:px-12 -mt-6 relative z-10">
                        <div className="max-w-[1320px] mx-auto">
                            <div className="cover-wrapper fade-up-5">
                                <Image
                                    src={data.imageUrl || "/images/das2.jpeg"}
                                    alt={data.title}
                                    width={2000}
                                    height={1200}
                                    priority
                                    sizes="(max-width: 768px) 100vw, 1320px"
                                    className="w-full object-cover"
                                    style={{ height: "clamp(220px, 40vw, 560px)" }}
                                />
                            </div>
                        </div>
                    </section>


                    {/* ═══════════════════════════════════════
                        CONTENT
                    ════════════════════════════════════════ */}
                    <section className="max-w-[1320px] mx-auto px-6 lg:px-12 py-20">

                        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-16 xl:gap-24">

                            {/* ── Sidebar ── */}
                            <aside className="hidden lg:block">
                                <div className="sticky top-28 space-y-8">

                                    {/* Author card */}
                                    <div
                                        className="p-5 rounded-xl"
                                        style={{
                                            border: "1px solid rgba(0,0,0,0.08)",
                                            background: "white",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
                                        }}
                                    >
                                        {/* Avatar placeholder */}
                                        {/* <div
                                            className="w-10 h-10 rounded-full mb-3 flex items-center justify-center"
                                            style={{
                                                background: "linear-gradient(135deg, #0066ff, #00c9ff)",
                                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                                fontWeight: 700,
                                                fontSize: 16,
                                                color: "white",
                                            }}
                                        >
                                            {String(data.authorlist || "A").charAt(0).toUpperCase()}
                                        </div> */}
                                        <div className="mono-label mb-1" style={{ color: "#aaa" }}>Written by</div>
                                        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, fontSize: 14, color: "#0a0a0a" }}>
                                            {data.authorlist}
                                        </div>
                                    </div>

                                    {/* Published date */}
                                    <div>
                                        <div className="mono-label mb-1.5" style={{ color: "#aaa" }}>Published</div>
                                        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: "#444" }}>
                                            {publishedDate}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />

                                    {/* Share */}
                                    <button className="share-btn">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                        </svg>
                                        Share
                                    </button>

                                    {/* Copy link */}
                                    <button className="share-btn" style={{ marginTop: 8 }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                        </svg>
                                        Copy link
                                    </button>

                                </div>
                            </aside>


                            {/* ── Article ── */}
                            <article
                                ref={articleRef}
                                className="article-body min-w-0"
                                style={{ maxWidth: "780px" }}
                                dangerouslySetInnerHTML={{ __html: data.content }}
                            />

                        </div>

                    </section>

                    {/* ═══════════════════════════════════════
                        BOTTOM CTA STRIP  (Vercel-style)
                    ════════════════════════════════════════ */}
                    <section
                        className="mt-4 mb-16 mx-6 lg:mx-12 rounded-2xl overflow-hidden bg-gradient-to-r from-[#235697] to-[#1ba7d9]"
                        style={{
                            // background: "linear-gradient(120deg, #0a0a0a 0%, #111 100%)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div className="max-w-[1320px] mx-auto px-8 lg:px-14 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="mono-label mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                                    Explore more
                                </div>
                                <h3
                                    className="hero-title text-white"
                                    style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", letterSpacing: "-0.025em" }}
                                >
                                    Continue reading knowledge resources
                                </h3>
                            </div>
                            <Link
                                href="/blog"
                                className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    fontFamily: "'Bricolage Grotesque', sans-serif",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    background: "white",
                                    color: "#0a0a0a",
                                    textDecoration: "none",
                                }}
                            >
                                View all articles
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </section>

                </main>

                <Footer />

            </div>
        </>
    );
};

export default BlogPageDetails;