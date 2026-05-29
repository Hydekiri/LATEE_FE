'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/solid';
import Home_Header from '@/src/components/layout/Home_Header';

// --- ICONS ---
const SocialIcons = {
    Facebook: () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
    ),
    Twitter: () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    Instagram: () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    LinkedIn: () => (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    ),
};

// --- HARDCODED DATA ---
const teamMembers = [
    {
        name: "Nguyen Minh Tu",
        role: "Fullstack Developer",
        img: "/images/VirtualPatient/VP8.jpeg",
        phone: "0934 870 910",
        location: "Ho Chi Minh City, Vietnam",
        email: "tu.nguyenhydekiri@hcmut.edu.vn",
        email2: "minhtupm123@gmail.com",
        bio: "Passionate about building impactful software solutions.",
        education: "Ho Chi Minh City University of Technology (HCMUT), Vietnam National University Ho Chi Minh City (VNU-HCM)",
        skills: ["Fullstack Development", "Problem Solving", "UI/UX Design", "Teamwork"]
    },
    {
        name: "Dang Van Tan",
        role: "Fullstack Developer",
        img: "/images/VirtualPatient/VP6.jpeg",
        phone: "+84 XXX XXX XXX",
        location: "Ho Chi Minh City, Vietnam",
        email: "tan.dang170604@hcmut.edu.vn",
        email2: "tan.dang170604@gmail.com",
        bio: "Dedicated software engineering student with a keen interest in modern web technologies.",
        education: "Ho Chi Minh City University of Technology (HCMUT), Vietnam National University Ho Chi Minh City (VNU-HCM)",
        skills: ["Backend Development", "Teamwork", "Problem Solving"]
    }
];

// --- MEMBER CARD COMPONENT ---
function MemberCard({ member }: { member: typeof teamMembers[0] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="w-full bg-[#F4F9FF] rounded-3xl p-6 md:p-8 flex flex-col shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 cursor-pointer"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Ảnh đại diện */}
            <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden mb-6 shadow-sm bg-white">
                <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                />
            </div>

            {/* Tên & Chức vụ */}
            <div className="text-center mb-6">
                <h2 className="text-[#235697] text-2xl md:text-3xl font-bold uppercase tracking-tight">
                    {member.name}
                </h2>
                <p className="text-[#1BA7D9] font-bold text-sm mt-1 uppercase tracking-widest">
                    {member.role}
                </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mb-8">
                {(['Facebook', 'Twitter', 'Instagram', 'LinkedIn'] as const).map((platform) => {
                    const Icon = SocialIcons[platform];
                    return (
                        <div key={platform} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#235697] shadow-sm hover:text-[#1BA7D9] hover:shadow-md transition-all cursor-pointer border border-gray-100">
                            <Icon />
                        </div>
                    );
                })}
            </div>

            <div className="space-y-4 w-full text-gray-600 text-sm md:text-base px-2">
                {member.phone && (
                    <div className="flex items-center gap-3">
                        <PhoneIcon className="w-5 h-5 text-[#235697] shrink-0" />
                        <span>{member.phone}</span>
                    </div>
                )}
                {member.location && (
                    <div className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-[#235697] shrink-0" />
                        <span>{member.location}</span>
                    </div>
                )}
                {member.email && (
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-[#235697] shrink-0" />
                        <span className="break-all">{member.email}</span>
                    </div>
                )}
                {member.email2 && (
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-[#235697] shrink-0" />
                        <span className="break-all">{member.email2}</span>
                    </div>
                )}
            </div>

            <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-gray-200/60 pt-6 space-y-6">
                        {member.bio && (
                            <p className="text-gray-500 leading-relaxed italic text-sm md:text-base">
                                &quot;{member.bio}&quot;
                            </p>
                        )}
                        {member.education && (
                            <div>
                                <h4 className="text-[#235697] font-bold text-lg mb-2">Education:</h4>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    {member.education}
                                </p>
                            </div>
                        )}
                        {member.skills && member.skills.length > 0 && (
                            <div>
                                <h4 className="text-[#235697] font-bold text-lg mb-3 uppercase">
                                    Expertise & Skills:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs md:text-sm font-bold text-[#235697] shadow-sm cursor-default"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Nút bấm ở cuối */}
            <button className="mt-8 w-full bg-[#1BA7D9] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors hover:bg-[#235697] text-lg">
                {isExpanded ? 'Show Less' : 'Contact Me'}
                <ChevronRightIcon 
                    className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} 
                />
            </button>
        </div>
    );
}


export default function AboutUsPage() {
    return (
        <main className="w-full flex flex-col items-center bg-gray-50">
            <Home_Header page="About" />
            
            <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
                {/* Header Section */}
                <div className="max-w-4xl text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[#235697] tracking-tight sm:text-5xl">
                        About Us
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Meet the dedicated team behind LATEE platform.
                    </p>
                </div>

                {/* Danh sách thành viên (Chỉnh sửa thành Grid 2 cột) */}
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
                    {teamMembers.map((member, index) => (
                        <MemberCard key={index} member={member} />
                    ))}
                </div>
            </div>
        </main>
    );
}