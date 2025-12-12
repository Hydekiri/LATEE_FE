// src/app/practice/[id]/page.tsx
import Home_Header from '@/src/components/layout/Home_Header';
import HeroSection from '@/src/components/common/HeroSection'; 
import Footer from '@/src/components/layout/Footer';
import { PracticeDetail } from '@/src/features/practice/components/Practice_Details';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';


interface PageProps {
    params: {
        id: string;
    };
}


export default function PatientDetailPage({ params }: PageProps) {
    const practiceId = params.id;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Home_Header />
            
            <HeroSection 
                title="Lavender Teeducation"
                description="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
                backgroundImage="/images/bgLearner2.jpg"
            />

            <div className="relative w-full py-16">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/bgLearner5.jpeg" 
                        alt="Geometric Background" 
                        fill 
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10" /> 
                </div>
                
                <div className="relative z-10 max-w-[86%] mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[#235697] mb-6 font-medium pl-2 shadow-black/20 drop-shadow-md">
                        <span>Practice Mode</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Case#TH1872</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#235697] underline decoration-[#235697] underline-offset-4">About Patient</span>
                    </div>


                    <PracticeDetail sessionId={practiceId} />
                </div>
            </div>

            <Footer />
        </div>
    );
}