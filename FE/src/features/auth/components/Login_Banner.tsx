import Image from 'next/image';

export default function LoginBanner() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-white flex-col justify-center items-start pl-20 pr-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 italic">
                Lavender Teeducation
            </h2>
            <p className="text-2xl text-gray-700 mb-8 leading-relaxed text-left">
                Enhancing Critical Thinking and Diagnostic Skills through Realistic Simulated Scenarios!
            </p>
            <div className="w-full relative" style={{ aspectRatio: '1/1', maxHeight: '500px' }}>
                <Image
                src="/images/loginbg2.png"
                alt="Background ITS"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-contain object-left"
                priority
                />
            </div>
        </div>
    );
};