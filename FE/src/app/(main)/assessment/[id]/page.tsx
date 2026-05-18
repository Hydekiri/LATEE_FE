import AssessmentDetail from "@/src/features/assessment/components/AssessmentDetail";
import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection";
import Footer from "@/src/components/layout/Footer";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { cookies } from "next/headers";
import { AssessmentData } from "@/src/types/assessment";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getAssessmentData(id: string) {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    console.log('[INFO]: Learner is logged in, fetching assessment data for id:', id);

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const learnerId = cookieStore.get("userId")?.value;

    console.log('[INFO]: Fetching assessment data for id:', id);

    const res = await fetch(`http://localhost:5000/assessment/api/assessments/${id}/learner/${learnerId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        cache: 'no-store'
    });

    if (!res.ok) return null;

    const data: AssessmentData = await res.json();
    //console.log('[INFO]: Fetched assessment detail data:', data);

    return data;
}

export default async function AssessmentDetailPage(props: PageProps) {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }
    const params = await props.params;
    const assessmentId = params.id;

    const assessmentData = await getAssessmentData(assessmentId);

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
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/bgLearner5.jpeg"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-white/10" />
                </div>

                <div className="relative z-10 max-w-[90%] xl:max-w-[86%] mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-[#235697] mb-6 font-medium pl-2">
                        <Link href="/assessment" className="hover:underline">Assessment</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Case #{assessmentData.assessmentId}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#235697] underline underline-offset-4">About Assessment</span>
                    </div>

                    <AssessmentDetail data={assessmentData} />
                </div>
            </div>

            <Footer />
        </div>
    );
}