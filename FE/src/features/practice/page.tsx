'use client';

import { Suspense } from 'react';
import Home_Header from '@/src/components/layout/Home_Header';
import HeroSection from '@/src/components/layout/herosection';
import Testimonial from '@/src/components/layout/testimonial';
import Footer from '@/src/components/layout/Footer';
import { PracticeListContent } from '@/src/features/practice/components/PracticeListContent';

export default function PracticePageFeature() {
    return (
        <main className="w-full flex flex-col items-center overflow-hidden bg-gray-50">
            <Home_Header page="Practice" />

            <HeroSection
                image="/images/bgLearner2.jpg"
                title="Lavender Teeducation"
                content="Develop critical thinking and enhance your diagnostic skills through realistic clinical simulations!"
            />

            <section
                className="relative w-full flex flex-col items-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/bgLearner5.jpeg')" }}
            >
                <div className="w-[90%] xl:w-[86%] flex flex-col items-center gap-8 xl:gap-12 pb-20">
                    <Suspense
                        fallback={
                            <div className="w-full flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235697]" />
                            </div>
                        }
                    >
                        <PracticeListContent />
                    </Suspense>
                </div>
            </section>

            <Testimonial />
            <Footer />
        </main>
    );
}