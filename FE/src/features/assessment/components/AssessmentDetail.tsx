'use client';

import { AssessmentData } from '@/src/types/assessment';
import { AssessmentAbout } from "./subComponents/tabs/AssessmentAbout";
import { CaseOverview } from "./subComponents/CaseOverview";
import { CaseInfo } from "./subComponents/CaseInfo";
import Evaluation from "@/src/features/assessment/components/subComponents/tabs/Evaluation";
import Experts from "@/src/features/assessment/components/subComponents/tabs/Expert";
import Results from "@/src/features/assessment/components/subComponents/tabs/Results";
import FAQ from "@/src/features/assessment/components/subComponents/tabs/FAQ";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function AssessmentDetail({ data }: { data: AssessmentData }) {
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'about';

    const tabs = [
        { name: 'About Assessment', slug: 'about' },
        { name: 'Experts', slug: 'experts' },
        { name: 'Insights', slug: 'insights' },
        { name: 'Results', slug: 'results' },
        { name: 'FAQ', slug: 'faq' }
    ];

    const handleTabChange = (slug: string) => {
        router.push(`${pathname}?tab=${slug}`, { scroll: false });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'about': return <AssessmentAbout data={data} />;
            case 'experts': return <Experts />;
            case 'insights': return <Evaluation />;
            case 'results': return <Results data={data} />;
            case 'faq': return <FAQ data={data} />;
            default: return <AssessmentAbout data={data} />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-h-screen">
            <div className="border-b border-gray-200 px-12 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 flex justify-between gap-2.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.slug}
                                onClick={() => handleTabChange(tab.slug)}
                                className={`pb-4 flex-1 text-base font-bold transition-all relative whitespace-nowrap ${activeTab === tab.slug ? 'text-[#235697]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.name}
                                <span className={`absolute bottom-0 left-0 w-full h-1 rounded-full transition-all duration-300 ${activeTab === tab.slug ? 'bg-[#235697] opacity-100' : 'bg-transparent opacity-0'
                                    }`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <CaseInfo data={data} />
                        <div className="mt-8">
                            {renderTabContent()}
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <CaseOverview data={data} />
                    </div>
                </div>
            </div>
        </div>
    );
}