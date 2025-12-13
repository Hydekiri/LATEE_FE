"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



type PageType = "Home" | "Module" | "Blog" | "About";

interface NavbarProps {
    page?: PageType; 
}

export default function Navbar({ page }: NavbarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

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
    }

    return (
        <nav className="w-full top-0 left-0 bg-linear-to-r from-[#1ba7d9] to-[#235697] z-50 flex justify-center sticky">
            <div className="w-[86%] py-3 border-b-[3px] border-white flex justify-between items-center">
                
                {/* --- PHẦN 1: LOGO (Luôn nằm bên trái) --- */}
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/" className="relative w-[120px] h-10 sm:w-[150px] sm:h-12 lg:w-[180px] lg:h-14 block">
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

                {/* --- DESKTOP MENU (Ẩn trên mobile, hiện trên lg hoặc xl) --- */}
                <div className="hidden xl:flex flex-1 justify-end items-center">
                    
                    {/* --- PHẦN 2: LINKS  --- */}
                    <div className="flex items-center gap-4 2xl:gap-8 mr-8 2xl:mr-16">
                        <Link href="/home" className={getLinkClasses("/home", "Home")}>Home</Link>
                        <Link href="/module" className={getLinkClasses("/module", "Module")}>Module</Link>
                        <Link href="/blog" className={getLinkClasses("/blog", "Blog")}>Blog</Link>
                        <Link href="/about" className={getLinkClasses("/about", "About")}>About us</Link>
                    </div>

                    {/* --- PHẦN 3: AUTH BUTTONS (Căn phải ngoài cùng) --- */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Link href="/login"
                            className="text-base bg-white text-[#1BA7D9] px-5 py-2 rounded-[10px] font-inter-semibold hover:bg-gray-100 transition shadow-sm whitespace-nowrap"
                        >
                            Login
                        </Link>
                        <Link href="/signup"
                            className="text-base text-white bg-[#1BA7D9] px-5 py-2 rounded-[10px] font-inter-semibold border-[1.5px] border-white hover:bg-[#01C4FE] transition whitespace-nowrap"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>

                {/* --- MOBILE MENU TRIGGER (Chỉ hiện khi < xl) --- */}
                <button className="xl:hidden p-1" onClick={() => setIsOpen(true)}>
                    <Menu className="w-8 h-8 text-white" />
                </button>
            </div>

            {/* --- MOBILE MENU OVERLAY --- */}
            {isOpen && (
                <div className="fixed inset-y-0 right-0 z-15 flex justify-end w-full">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
                    
                    {/* Drawer Content */}
                    <div className="w-72 bg-linear-to-b from-[#1ba7d9] to-[#235697] h-full shadow-2xl p-6 pt-10 relative animate-slide-left z-50 flex flex-col">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 hover:bg-white/10 rounded-full p-1 transition"
                        >
                            <X className="w-7 h-7 text-white" />
                        </button>

                        <div className="flex flex-col gap-4 text-lg font-medium mt-8">
                            <Link href="/" className={`text-white hover:translate-x-2 transition p-2 ${pathname === "/" ? "font-bold border-l-4 border-white pl-4 bg-white/10" : ""}`}>
                                Home
                            </Link>
                            <Link href="/module" className={`text-white font-lato-r hover:translate-x-2 transition p-2 ${pathname.startsWith("/module") ? "font-bold border-l-4 border-white pl-4 bg-white/10" : ""}`}>
                                Module
                            </Link>
                            <Link href="/blog" className={`text-white font-lato-r hover:translate-x-2 transition p-2 ${pathname.startsWith("/blog") ? "font-bold border-l-4 border-white pl-4 bg-white/10" : ""}`}>
                                Blog
                            </Link>
                            <Link href="/about" className={`text-white font-lato-r hover:translate-x-2 transition p-2 ${pathname.startsWith("/about") ? "font-bold border-l-4 border-white pl-4 bg-white/10" : ""}`}>
                                About us
                            </Link>

                            <div className="h-[1px] w-full bg-white/20 my-4"></div>

                            <div className="flex flex-col gap-3">
                                <Link href="/login" className="bg-white text-[#235697] rounded-xl text-center py-3 font-inter-semibold shadow-md hover:bg-gray-100">
                                    Login
                                </Link>
                                <Link href="/signup" className="border-2 border-white bg-[#1BA7D9] text-white rounded-xl text-center py-3 font-inter-semibold hover:bg-white/10">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}