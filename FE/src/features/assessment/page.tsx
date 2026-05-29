"use client";

import Home_Header from "@/src/components/layout/Home_Header";
import HeroSection from "@/src/components/layout/herosection";
import Footer from "@/src/components/layout/Footer";
import Testimonial from "@/src/components/layout/testimonial";
import AssessmentOverview from "@/src/features/assessment/components/AssessmentOverview";
import ContinueAssessment from "@/src/features/assessment/components/ContinueAssessment";
import AssessmentList from "@/src/features/assessment/components/AssessmentList";

export default function AssessmentPageFeature({ learnerName }: { learnerName: string }) {
    return (
        <main className="w-full flex flex-col items-center bg-gray-50">
            <Home_Header page="Assessment" />

            <HeroSection
                image="/images/bgAssessment.jpeg"
                title="Lavender Teeducation"
                content="Develop critical thinking, strengthen clinical reasoning, and enhance diagnostic accuracy through immersive clinical simulations designed to replicate real-world patient interactions and healthcare decision-making scenarios!"
            />

            <section
                className="w-full py-16 flex flex-col items-center bg-cover bg-center bg-no-repeat"
            >
                <div className="w-[90%] xl:w-[86%] flex flex-col gap-16">
                    <AssessmentOverview learnerName={learnerName} />
                    <ContinueAssessment />
                    <AssessmentList />
                </div>
            </section>

            <Testimonial />
            <Footer />
        </main>
    );
}