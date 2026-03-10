'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
    PhoneIcon, 
    EnvelopeIcon, 
    MapPinIcon,
    ChevronRightIcon,
    PlayIcon 
} from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

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
    )
};

interface ExpertData {
    id: string;
    name: string;
    role: string;
    specialty: string;
    image: string;
    bio: string;
    education: string;
    skills: string[];
    phone: string;
    email: string;
    location: string;
}

const EXPERTS_LIST: ExpertData[] = [
    {
        id: 'EX01',
        name: 'Dr. Andrew Nguyen',
        role: 'Specialist in Diagnostic Reasoning',
        specialty: 'Specialist in Diagnostic Reasoning',
        image: '/images/d22.jpg',
        bio: 'Dr. Andrew is a leading expert in analyzing complex clinical cases. With over 15 years of experience, he has developed modern diagnostic consulting models that help medical students shorten their learning curve when approaching real-world diseases.',
        education: 'Doctor of Medicine (MD) in Internal Medicine from Johns Hopkins University. Advanced Medical Education Teaching Certification from Harvard Medical School.',
        skills: ['Clinical Reasoning', 'Diagnostic Strategy', 'Case-based Learning'],
        phone: '(568) 367-987-237',
        email: 'andrew.nguyen@latee.com',
        location: 'Hudson, Wisconsin (WI), 54016'
    },
    {
        id: 'EX02',
        name: 'Dr. Tachibana Hana',
        role: 'Clinical Instructor',
        specialty: 'Clinical Instructor',
        image: '/images/doctorFEMALE.jpeg',
        bio: 'Dr. Tachibana Hana focuses on hands-on clinical practice guidance for students. She is well known for her patient-centered teaching approach and her refined ability to convey healthcare communication skills effectively.',
        education: 'Master’s Degree in Clinical Nursing from Kyoto University. Internationally certified Clinical Simulation Training Specialist.',
        skills: ['Patient Interaction', 'Clinical Supervision', 'Medical Simulation Training'],
        phone: '(568) 333-111-222',
        email: 'hana.tachibana@latee.com',
        location: 'Shibuya, Tokyo, Japan'
    }
];


export default function Experts() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // Để xác định trượt trái hay phải

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev < EXPERTS_LIST.length - 1 ? prev + 1 : 0));
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : EXPERTS_LIST.length - 1));
    };

    useEffect(() => {
        const interval = setInterval(handleNext, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    // Cấu hình animation trượt
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    const selectedExpert = EXPERTS_LIST[currentIndex];

    return (
        <div className="flex flex-col gap-6 pb-10"> 
            <h3 className="text-[#235697] text-2xl font-bold mb-4 uppercase">Experts</h3>
            
            <div className="relative flex items-center w-full">           
                <button 
                    onClick={handlePrev}
                    className="absolute -left-6 p-3 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30 shadow-sm border border-gray-100 bg-white active:scale-90"
                >
                    <PlayIcon className="w-6 h-6 rotate-180" />
                </button>

                <div className="relative w-full min-h-125 flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute w-full"
                        >
                            <div className="w-full bg-[#F0F8FF] rounded-2xl p-8 flex flex-col lg:flex-row gap-10 border border-blue-50 shadow-sm">
                                {/* Cột trái */}
                                <div className="lg:w-1/3 flex flex-col items-center lg:items-start border-r border-gray-200/50 pr-8 shrink-0">
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg mb-6 bg-white">
                                        <Image 
                                            src={selectedExpert.image} 
                                            alt={selectedExpert.name} 
                                            fill 
                                            className="object-cover"
                                        />
                                    </div>
                                    
                                    {/* Social Buttons */}
                                    <div className="flex gap-4 mb-8">
                                        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => {
                                            const Icon = SocialIcons[platform as keyof typeof SocialIcons];
                                            return (
                                                <div key={platform} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#235697] shadow-sm hover:text-[#1BA7D9] hover:shadow-md transition-all cursor-pointer border border-gray-100">
                                                    <Icon />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-4 w-full text-gray-500 text-sm">
                                        <div className="flex items-center gap-3"><PhoneIcon className="w-4 h-4 text-[#235697]" /><span>{selectedExpert.phone}</span></div>
                                        <div className="flex items-center gap-3"><MapPinIcon className="w-4 h-4 text-[#235697]" /><span>{selectedExpert.location}</span></div>
                                        <div className="flex items-center gap-3"><EnvelopeIcon className="w-4 h-4 text-[#235697]" /><span>{selectedExpert.email}</span></div>
                                    </div>

                                    <button className="mt-8 w-full bg-[#1BA7D9] hover:bg-[#235697] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md group">
                                        Contact Us Teacher <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Cột phải */}
                                <div className="lg:w-2/3 flex flex-col justify-start">
                                    <div className="mb-6">
                                        <h2 className="text-[#235697] text-3xl font-bold uppercase tracking-tight">{selectedExpert.name}</h2>
                                        <p className="text-[#1BA7D9] font-bold text-sm mt-1 uppercase tracking-widest">{selectedExpert.role}</p>
                                    </div>
                                    <div className="space-y-6">
                                        <p className="text-gray-500 leading-relaxed italic text-[15px]">&quot;{selectedExpert.bio}&quot;</p>
                                        <div className="pt-4 border-t border-gray-200/40">
                                            <h4 className="text-[#235697] font-bold text-xl mb-3">Education:</h4>
                                            <p className="text-gray-600 leading-relaxed text-[15px]">{selectedExpert.education}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-[#235697] font-bold text-xl mb-3 uppercase">Expertise & Skills:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedExpert.skills.map(skill => (
                                                    <span key={skill} className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-[#235697] shadow-sm hover:border-[#1BA7D9] transition-colors">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button 
                    onClick={handleNext}
                    className="absolute -right-6 p-3 hover:bg-gray-100 rounded-full text-[#235697] transition-all z-30 shadow-sm border border-gray-100 bg-white active:scale-90"
                >
                    <PlayIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Indicator */}
            <div className="flex justify-center gap-2 mt-4">
                {EXPERTS_LIST.map((_, index) => (
                    <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-[#235697]' : 'w-2 bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
}