
// src/features/practice/components/sub-components/PatientInfo.tsx
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const PatientInfo = ({ data }: { data: PatientData }) => {
    return (
        <>
            {/* Header: PatientID & Case */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800">PatientID: {data.id}</h2>
                <h2 className="text-3xl font-bold text-[#235697]">Case: #{data.caseId}</h2>
            </div>

            {/* Profile Summary Section */}
            <div className="flex items-center gap-8 mb-12">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full overflow-hidden relative shrink-0">
                    <Image src={data.img} alt={data.name} fill className="object-cover" />
                </div>

                {/* Content Text */}
                <div className="flex-1">
                    <div className="mb-2">
                        <span className="text-[#235697] font-bold text-xl block">Level {data.level}</span>
                    </div>
                    <p className="text-gray-700 font-medium text-base mb-3 leading-relaxed">
                        {data.description}
                    </p>
                    <span className="text-[#2AA8D8] text-sm font-bold">Times practiced: {data.timesPracticed}</span>
                </div>

                {/* Nút Start */}
                <div>
                    <button className="flex items-center gap-2 bg-[#E0F2FE] text-[#235697] px-8 py-4 rounded-xl font-bold hover:bg-[#235697] hover:text-white transition shadow-sm hover:shadow-md">
                        Start Practice <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};