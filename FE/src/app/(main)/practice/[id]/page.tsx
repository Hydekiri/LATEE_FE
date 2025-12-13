import { getPatientById } from "@/src/services/patient-servvice";
import PracticeDetail from "@/src/features/practice/components/Practice_Details"; 
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/common/HeroSection";
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

export default async function PatientDetailPage(props: PageProps) {
    const params = await props.params;
    const practiceId = params.id;

    // Fetch data using the corrected service
    const patientData = await getPatientById(practiceId);

    if (!patientData) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Home_Header page="Practice" />
            
            <HeroSection 
                title="Lavender Teeducation"
                description="Develop critical thinking and enhance your diagnostic skills!"
                backgroundImage="/images/bgLearner2.jpg"
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
                    <div className="flex items-center gap-2 text-sm text-[#235697] mb-6 font-medium pl-2 bg-white/60 w-fit px-4 py-1 rounded-full backdrop-blur-sm shadow-sm">
                        <Link href="/practice" className="hover:underline">Practice Mode</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Case #{patientData.id}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#235697] underline decoration-[#235697] underline-offset-4">About Patient</span>
                    </div>

                    {/* Main Detail Component */}
                    <PracticeDetail data={patientData} />
                </div>
            </div>

            <Footer />
        </div>
    );
}