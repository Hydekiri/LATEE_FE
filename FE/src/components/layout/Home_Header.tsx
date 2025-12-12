'use client';

import { useState } from 'react'; // Bỏ useEffect
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCookie, deleteCookie } from '@/src/utils/cookies';
import { Bell } from 'lucide-react';

export default function Home_Header() {
    const router = useRouter();
    const pathname = usePathname(); 

    const [userInfo] = useState<{name: string, email: string} | null>(() => {
        if (typeof window !== 'undefined') {
            const email = getCookie('userEmail');
            if (email) {
                const namePart = email.split('@')[0];
                const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._-]/g, ' ');
                return { email, name: formattedName };
            }
        }
        return null;
    });

    const handleLogout = () => {
        console.log('🚪 Logging out...');
        deleteCookie('isLoggedIn');
        deleteCookie('userEmail');
        router.replace('/login');
    };

    const getLinkClass = (path: string) => {
        const isActive = pathname === path;
        return isActive 
            ? "text-white font-bold border-b-[3px] border-white pb-1 transition-all whitespace-nowrap" 
            : "text-white font-medium hover:text-gray-200 border-b-[3px] border-transparent pb-1 transition-all whitespace-nowrap"; 
    };

    return (
        <header className="bg-linear-to-l from-[#235697] to-[#1BA7D9] w-full py-3 shadow-md">
            <div className="w-[86%] mx-auto flex flex-col"> 
            
                {/* --- ROW 1: Logo | Desktop Nav | User Info --- */}
                <div className="flex justify-between items-center w-full">
                    {/* Left - Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-30 h-10 sm:w-37.5 sm:h-12.5 lg:w-50 lg:h-16">
                            <Image 
                                src="/images/LATEE2.png" 
                                alt="LATEE Logo" 
                                fill
                                sizes="(max-width: 768px) 150px, 200px"
                                className="object-contain object-left" 
                                priority
                            />
                        </div>
                    </div>

                    {/* Center - Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/home" className={getLinkClass('/home')}>Home</Link>
                        <Link href="/practice/patientDetail" className={getLinkClass('/practice/patientDetail')}>Practice mode</Link>
                        <Link href="/assessment" className={getLinkClass('/assessment')}>Assessment</Link>
                        <a href="#" className={getLinkClass('/progress')}>Progress</a>
                        <a href="#" className={getLinkClass('/blog')}>Blog</a>
                        <a href="#" className={getLinkClass('/about-us')}>About Us</a>
                    </nav>

                    {/* Right - Notification, User Profile, and Logout */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-white/10 rounded-full transition">
                            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white overflow-hidden flex items-center justify-center relative">
                                    <Image 
                                        src="/images/LVP1.jpeg" 
                                        alt="User Avatar" 
                                        fill
                                        sizes="40px"
                                        className="object-cover"
                                    />
                                </div>
                                
                                <span 
                                    suppressHydrationWarning={true}
                                    className="text-white font-semibold hidden sm:block text-sm sm:text-base min-w-7.5"
                                >
                                    {userInfo ? userInfo.name : ''} 
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="bg-white text-[#235697] px-3 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold hover:bg-red-600 hover:text-white transition text-xs sm:text-base"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ROW 2: Mobile Navigation --- */}
                <nav className="lg:hidden flex items-center gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full">
                    <Link href="/home" className={getLinkClass('/home')}>Home</Link>
                    <Link href="#" className={getLinkClass('/practice/patientDetail')}>Practice mode</Link>
                    <Link href="/assessment" className={getLinkClass('/assessment')}>Assessment</Link>
                    <a href="#" className={getLinkClass('/progress')}>Progress</a>
                    <a href="#" className={getLinkClass('/blog')}>Blog</a>
                    <a href="#" className={getLinkClass('/about-us')}>About Us</a>
                </nav>

            </div>
        </header>
    );
}