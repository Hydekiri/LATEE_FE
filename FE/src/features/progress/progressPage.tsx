"use client";
import Home_Header from "@/src/components/layout/Home_Header";
import Footer from "@/src/components/layout/Footer";
import Testimonial from "@/src/components/layout/testimonial";
import RoadmapPage from "./roadmap";

const ProgressPage = () => {
    return (
        <main className="w-full flex flex-col items-center bg-gray-50">
            <Home_Header page="Progress" />

            <RoadmapPage />

            <Testimonial />
            <Footer />
        </main>
    );
}

export default ProgressPage;