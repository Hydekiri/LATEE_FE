// src/features/practice/components/sub-components/tabs/AboutPatient.tsx
import Image from 'next/image';

const experts = [
    { name: 'Dr. Andrew Nguyen', role: 'Specialist in Diagnostic Reasoning', img: '/expert1.jpg' },
    { name: 'Dr. Tachibana Keji', role: 'Clinical Instructor in Internal Medicine', img: '/expert2.jpg' },
    { name: 'Dr. Sofia Tran', role: 'Instructor in Clinical Skills and Communication', img: '/expert3.jpg' },
    { name: 'Dr. Michael Park', role: 'AI & Medical Education Researcher', img: '/expert4.jpg' },
];

export const AboutPatient = () => {
    return (
        <>
            {/* ROW 1: Patient Information & Vital Signs */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 relative">
                {/* Left Side: Info */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">Patient Information</h3>
                    <ul className="space-y-3 text-gray-700 text-sm">
                        <li><span className="text-[#235697] font-semibold">Name:</span> Abigail Park</li>
                        <li><span className="text-[#235697] font-semibold">Age:</span> 52</li>
                        <li><span className="text-[#235697] font-semibold">Gender:</span> Female</li>
                        {/* ... Các mục khác ... */}
                    </ul>
                </div>

                <div className="hidden md:block w-1 bg-slate-300 rounded-full mx-2 self-stretch opacity-60"></div>

                {/* Right Side: Vital Signs */}
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">Vital Signs</h3>
                    <ul className="space-y-3 text-gray-700 text-sm">
                        <li><span className="text-[#235697] font-semibold">Blood Pressure:</span> 120/70</li>
                        <li><span className="text-[#235697] font-semibold">Heart Rate:</span> 88</li>
                        {/* ... Các mục khác ... */}
                    </ul>
                </div>
            </div>

            {/* ROW 2: Instructions (Rút gọn cho ngắn code demo) */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 relative">
                <div className="flex-1">
                    <h3 className="text-[#235697] font-bold text-lg mb-4">Case Instructions</h3>
                    <p className="text-sm text-gray-700">Enter the virtual consultation room...</p>
                </div>
            </div>

            {/* What you will learn */}
            <div className="bg-slate-50 rounded-xl p-8 mb-12">
                <h3 className="text-[#235697] text-xl font-bold mb-4">What you will learn</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 font-medium">
                    <li>Strengthen your clinical reasoning...</li>
                </ol>
            </div>

            {/* Experts */}
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Experts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {experts.map((exp, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-100 relative">
                                <div className="absolute inset-0 bg-gray-200" />
                                {/* Nhớ check path ảnh */}
                                <Image src={exp.img} alt={exp.name} fill className="object-cover" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{exp.name}</h4>
                            <p className="text-xs text-gray-500">{exp.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};