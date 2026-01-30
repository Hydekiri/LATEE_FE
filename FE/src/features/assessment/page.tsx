"use client";

import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection";
import Footer from "@/src/components/layout/Footer";
import Testimonial from "@/src/components/layout/testimonial";
import AssessmentOverview from "./components/AssessmentOverview";
import ContinueAssessment from "./components/ContinueAssessment";
import AssessmentList from "./components/AssessmentList";

export default function AssessmentPageFeature() {
    return (
        <main className="w-full flex flex-col items-center bg-gray-50">
            <Home_Header page="Assessment" />

            <HeroSection
                image="/images/bgAssessment.jpeg"
                title="Lavender Teeducation"
                content="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
            />

            <section 
                className="w-full py-16 flex flex-col items-center bg-cover bg-center bg-no-repeat"
            >
                <div className="w-[90%] xl:w-[86%] flex flex-col gap-16">
                    <AssessmentOverview />
                    <ContinueAssessment />
                    <AssessmentList />
                </div>
            </section>

            <Testimonial />
            <Footer />
        </main>
    );
}