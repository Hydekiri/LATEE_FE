"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCookie, deleteCookie } from "@/src/utils/cookies";
import { logoutApi } from '@/src/services/auth-service';

type PageType = "Home" | "Practice" | "Assessment" | "Progress" | "Blog" | "About";

interface NavbarProps {
    page?: PageType;
}

export default function Navbar({ page }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [userInfo] = useState<{ name: string; email: string } | null>(() => {
        const email = getCookie("userEmail");
        const userName = getCookie("username");
        if (email && userName) {
            return {
                email,
                name: userName.charAt(0).toUpperCase() + userName.slice(1),
            };
        }
        return null;
    });

    // --- LOGIC: Đăng xuất ---
    const handleLogout = async () => {

        /*
         * Process logout API call here if needed, e.g. to invalidate refresh token on server 
        */
        try {
            await logoutApi();
        } catch (error) {
            console.error("[LOGOUT] Logout API call failed", error);
        }

        router.replace("/login");
    };

    const getLinkClasses = (path: string, targetPage: PageType) => {
        let isActive = false;

        if (page) {
            isActive = page === targetPage;
        } else {
            isActive = path === "/" ? pathname === "/home" : pathname.startsWith(path);
        }

        return `relative text-base px-2 py-2 text-white transition whitespace-nowrap
        ${isActive
                ? "font-inter-semibold after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[4px] after:bg-white after:rounded-full"
                : "font-inter-medium after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[4px] after:bg-white/50 after:rounded-full hover:after:w-full transition-all duration-300"
            }`;

    };

    return (
        <nav className="w-full top-0 left-0 bg-linear-to-r from-[#1ba7d9] to-[#235697] shadow-md z-50 flex justify-center sticky">
            <div className="w-[86%] flex items-center justify-between py-3">

                {/* --- 1. LOGO --- */}
                <div className="shrink-0">
                    <Link href="/home" className="relative block w-30 h-10 sm:w-37.5 sm:h-12 lg:w-45 lg:h-14">
                        <Image
                            src="/images/LATEE2.png"
                            alt="LATEE Logo"
                            fill
                            sizes="(max-width: 768px) 120px, 180px"
                            className="object-contain object-left"
                            priority
                        />
                    </Link>
                </div>

                {/* --- 2. DESKTOP MENU --- */}
                <div className="hidden xl:flex items-center">

                    {/* A. MENU LINKS */}
                    <div className="flex items-center gap-5 2xl:gap-10">
                        <Link href="/home" className={getLinkClasses("/home", "Home")}>Home</Link>
                        <Link href="/practice" className={getLinkClasses("/practice", "Practice")}>Practice Mode</Link>
                        <Link href="/assessment" className={getLinkClasses("/assessment", "Assessment")}>Assessment</Link>
                        <Link href="/progress" className={getLinkClasses("/progress", "Progress")}>Progress</Link>
                        <Link href="/blog" className={getLinkClasses("/blog", "Blog")}>Blog</Link>
                        <Link href="/about" className={getLinkClasses("/about", "About")}>About us</Link>
                    </div>

                    {/* B. SPACER */}
                    <div className="h-8 w-px bg-white/20 ml-7.5 mr-7.5 2xl:ml-12.5 2xl:mr-12.5"></div>

                    {/* C. USER ACTION AREA */}
                    <div className="flex items-center gap-4">
                        {userInfo ? (
                            <>
                                <button className="relative p-2 hover:bg-white/10 rounded-full transition">
                                    <Bell className="w-6 h-6 text-white" />
                                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#235697]"></span>
                                </button>

                                <div className="flex items-center gap-3 pl-2">
                                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden relative border-2 border-white/50">
                                        <Image src="/images/ava1.jpg" alt="Avatar" fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col text-white">
                                        <span className="font-bold text-sm max-w-25 truncate">{userInfo.name}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-xs text-blue-200 hover:text-white text-left underline transition"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-[16px] bg-white text-[#235697] px-6 py-2 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm whitespace-nowrap">
                                    Login
                                </Link>
                                <Link href="/signup" className="text-[16px] text-white px-6 py-2 rounded-xl font-bold border-2 border-white hover:bg-white/10 transition whitespace-nowrap">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* --- 3. MOBILE MENU BUTTON --- */}
                <button className="xl:hidden" onClick={() => setIsOpen(true)}>
                    <Menu className="w-8 h-8 text-white" />
                </button>
            </div>

            {/* --- 4. MOBILE MENU OVERLAY --- */}
            {isOpen && (
                <div className="fixed inset-y-0 right-0 z-60 flex justify-end w-full">
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

                    <div className="w-72 bg-linear-to-b from-[#1ba7d9] to-[#235697] h-full shadow-2xl p-6 pt-10 relative animate-slide-left z-50 flex flex-col overflow-y-auto">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 hover:bg-white/10 rounded-full p-1 transition">
                            <X className="w-7 h-7 text-white" />
                        </button>

                        {/* Mobile User Info */}
                        {userInfo && (
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/20">
                                <div className="w-12 h-12 rounded-full bg-white overflow-hidden relative border-2 border-white">
                                    <Image src="/images/LVP1.jpeg" alt="Avatar" fill className="object-cover" />
                                </div>
                                <div className="text-white">
                                    <p className="font-bold text-lg">{userInfo.name}</p>
                                    <p className="text-blue-100 text-xs">{userInfo.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4 text-lg font-medium mt-4">
                            {/* Mobile Links - Cập nhật truyền tham số thứ 2 giống Desktop */}
                            <Link href="/" className={getLinkClasses("/home", "Home")}>Home</Link>
                            <Link href="/practice" className={getLinkClasses("/practice", "Practice")}>Practice Mode</Link>
                            <Link href="/assessment" className={getLinkClasses("/assessment", "Assessment")}>Assessment</Link>
                            <Link href="/progress" className={getLinkClasses("/progress", "Progress")}>Progress</Link>
                            <Link href="/blog" className={getLinkClasses("/blog", "Blog")}>Blog</Link>
                            <Link href="/about" className={getLinkClasses("/about", "About")}>About us</Link>

                            <div className="h-px bg-white/20 w-full my-4"></div>

                            {/* Mobile Buttons */}
                            {userInfo ? (
                                <button onClick={handleLogout} className="bg-white rounded-xl text-red-500 hover:bg-red-50 text-center py-3 font-bold shadow-md w-full">
                                    Log out
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" className="bg-white text-[#235697] rounded-xl text-center py-3 font-bold shadow-md hover:bg-gray-100">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="border-2 border-white text-white rounded-xl text-center py-3 font-bold hover:bg-white/10">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}