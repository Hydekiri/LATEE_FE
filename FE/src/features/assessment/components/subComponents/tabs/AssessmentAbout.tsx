// src/features/assessment/components/subComponents/tabs/AssessmentAbout.tsx
import { ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { AssessmentData } from '@/src/types/assessment';

export const AssessmentAbout = ({ data }: { data: AssessmentData }) => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-12">
            <div className="bg-[#D1F1FF]/40 border border-[#BDE6F5] rounded-[32px] p-10 relative">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm">
                            <DocumentTextIcon className="w-8 h-8 text-[#1BA7D9]" />
                        </div>
                        <h3 className="text-3xl font-bold text-[#235697]">General Info</h3>
                    </div>
                    <button 
                        onClick={() => router.push(`/assessment/${data.id}/take`)}
                        className="flex items-center gap-2 bg-white text-[#235697] px-6 py-3 rounded-xl font-bold border border-white hover:border-[#235697] transition-all shadow-md active:scale-95"
                    >
                        Join Assessment <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-8 text-lg">
                    <div><span className="text-[#235697] font-bold">Time Required:</span> <span className="text-gray-700 ml-1">{data.timeRequired}</span></div>
                    <div><span className="text-[#235697] font-bold">Max times practiced:</span> <span className="text-gray-700 ml-1">{data.maxPracticed}</span></div>
                    <div><span className="text-[#235697] font-bold">Deadline:</span> <span className="text-gray-700 ml-1">{data.deadline}</span></div>
                    <div><span className="text-[#235697] font-bold">Release Date:</span> <span className="text-gray-700 ml-1">{data.releaseDate}</span></div>
                </div>

                <div className="space-y-4">
                    <p className="text-xl font-bold text-[#235697]">Title: <span className="font-normal text-gray-800">{data.subTitle}</span></p>
                    <p className="text-lg text-gray-700 leading-relaxed"><span className="font-bold text-[#235697]">Description:</span> {data.description}</p>
                    <div className="mt-6">
                        <p className="text-[#235697] font-bold text-lg">Author: {data.author}</p>
                        <p className="text-[#1BA7D9] text-base">{data.authorRole}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-[32px] p-10">
                <h3 className="text-3xl font-bold text-[#235697] mb-6 tracking-tight">What you will learn</h3>
                <ol className="list-decimal pl-5 space-y-4 text-lg text-gray-700">
                    {data.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ol>
            </div>
        </div>
    );
};