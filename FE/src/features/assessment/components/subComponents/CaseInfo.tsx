// src/features/assessment/components/subComponents/CaseInfo.tsx
import Image from 'next/image';
import { AssessmentData } from '@/src/types/assessment';

export const CaseInfo = ({ data }: { data: AssessmentData }) => {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">Case: #{data.id}</h2>
            </div>

            <div className="flex items-center gap-8">
                <div className="w-36 h-36 relative rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <Image src={data.img} alt="case thumbnail" fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-2">{data.title}</h3>
                    <div className="space-y-1">
                        <p className="text-[#235697] font-bold text-xl">Difficulty Level: Level {data.level}</p>
                        <p className="text-[#2AA8D8] font-bold text-lg">Times practiced: {data.timesPracticed}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};