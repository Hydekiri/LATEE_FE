
import Image from 'next/image';

interface HeroSectionProps {
    title: string,
    description: string,
    backgroundImage: string,
    alt?: string,
}


export default function HeroSection({
    title,
    description,
    backgroundImage,
    alt='LATEE Slide Background',
}: HeroSectionProps) {
    return (
        <section className="relative w-full h-125 ">

            <div className="absolute inset-0 z-0">
                {/* Background Image*/}
                <Image
                    src={backgroundImage}
                    alt={alt}
                    fill
                    className="object-cover w-full h-full"
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-start text-left text-white w-[86%] mx-auto">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    {title}
                </h1>
                <p className="text-xl leading-relaxed drop-shadow-md max-w-3xl">
                    {description}
                </p>
            </div>
            

        </section>
    );
}