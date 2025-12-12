"use client";

import Image from "next/image";

interface HeroBannerProps {
    image: string;
    title: string;
    content: string;
}

export default function HeroSection({ image, title, content }: HeroBannerProps) {
    return (
        <section className="relative w-full min-h-[300px] max-h-[425px] flex justify-center overflow-hidden">

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
            <div className="absolute w-[86%] flex flex-col items-start space-y-[14px] py-[58px] z-20">

                {/* Title */}
                <h1 className="text-white text-[48px] xl:text-[72px] font-lato-black">
                    {title}
                </h1>

                {/* Content */}
                <p className="text-white font-lato-bold text-[24px] xl:text-[32px]">
                    {content}
                </p>
            </div>

        </section>
    );
}
