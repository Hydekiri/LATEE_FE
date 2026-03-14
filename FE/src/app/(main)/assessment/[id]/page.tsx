import { getAssessmentById } from "@/src/services/assessment-servvice";
import AssessmentDetail from "@/src/features/assessment/components/AssessmentDetail"; 
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection"; 
import Footer from "@/src/components/layout/Footer";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AssessmentDetailPage(props: PageProps) {
    const params = await props.params;
    const assessmentId = params.id;

    // Fetch data using the corrected service
    const assessmentData = await getAssessmentById(assessmentId);

    if (!assessmentData) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Home_Header page="Assessment" />
            
            <HeroSection
                image="/images/bgLearner2.jpg"
                title="Lavender Teeducation"
                content="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
            />

            <div className="relative w-full py-16">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/bgLearner5.jpeg" 
                        alt="Background" 
                        fill 
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10" /> 
                </div>
                
                <div className="relative z-10 max-w-[90%] xl:max-w-[86%] mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[#235697] mb-6 font-medium pl-2 px-4 py-1">
                        <Link href="/assessment" className="hover:underline">Assessment</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Case #{assessmentData.id}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#235697] underline decoration-[#235697] underline-offset-4">About Assessment</span>
                    </div>

                    {/* Main Detail Component */}
                    <AssessmentDetail data={assessmentData} />
                </div>
            </div>

            <Footer />
        </div>
    );
}