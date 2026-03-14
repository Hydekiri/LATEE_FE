"use client";

import Image from "next/image";

interface HeroBannerProps {
    image: string;
    title: string;
    content: string;
}

export default function HeroSection({ image, title, content }: HeroBannerProps) {
    return (
        <section className="relative w-full min-h-75 max-h-45 flex justify-center overflow-hidden">

            {/* Background Image */}
            <Image
                src={image}
                alt="banner"
                width={1920}
                height={1080}
                className="w-full h-auto object-cover pointer-events-none top-0 left-0 z-10 
                            brightness-[0.63] contrast-[1.05]"
            />

            {/* Text Content */}
            <div className="absolute w-[86%] flex flex-col items-start space-y-3.5 py-14.5 z-20">

                {/* Title */}
                <h1 className="text-white text-12 xl:text-18 font-lato-black">
                    {title}
                </h1>

                {/* Content */}
                <p className="text-white font-lato-medium text-[24px] xl:text-[32px]">
                    {content}
                </p>
            </div>

        </section>
    );
}
