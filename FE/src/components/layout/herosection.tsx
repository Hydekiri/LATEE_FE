'use client';

import Image from 'next/image';

interface HeroBannerProps {
    image: string;
    title: string;
    content: string;
}

export default function HeroSection({
    image,
    title,
    content,
}: HeroBannerProps) {
    return (
        <section className="relative w-full h-100 md:h-100 overflow-hidden">
            {/* Background Image */}
            <Image
                src={image}
                alt="banner"
                fill
                priority
                fetchPriority="high"
                quality={85}
                sizes="100vw"
                className="object-cover brightness-[0.63] contrast-[1.05] pointer-events-none"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 z-10" />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 xl:px-24">
                <h1 className="text-white/85 text-5xl md:text-6xl xl:text-7xl font-lato-black whitespace-nowrap">
                    {title}
                </h1>

                <p className="mt-4 w-full text-white/80 text-lg md:text-2xl xl:text-3xl font-lato-medium leading-relaxed">
                    {content}
                </p>
            </div>
        </section>
    );
}