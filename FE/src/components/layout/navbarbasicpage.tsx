"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
    currentPage?: "home" | "module" | "blog" | "about";
}

export default function Navbar({ currentPage = "home" }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Helper function để check active page
    const isActive = (page: string) => currentPage === page;

    return (
        <nav className="w-full top-0 left-0 bg-gradient-to-r from-[#1ba7d9] to-[#235697] shadow z-50 flex justify-center">
            <div className="w-[86%] flex items-center justify-between border-b-[3px] py-3 border-white">
                
                <div className="relative w-[120px] h-10 sm:w-[150px] sm:h-[50px] lg:w-[200px] lg:h-16">
                    <Image
                        src="/images/LATEE2.png"
                        alt="LATEE Logo"
                        fill
                        sizes="(max-width: 768px) 150px, 200px"
                        className="object-contain object-left"
                        priority
                    />
                </div>

                {/* Desktop Menu */}
                <div className="max-w-[70%] hidden xl:flex xl:gap-[70px] text-gray-700 font-medium">
                    <div className="flex items-center gap-[80px]">
                        <Link
                            href="/"
                            className={`
                            relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("home")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                        `}
                        >
                            Home
                        </Link>

                        <Link
                            href="/module"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("module")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            Module
                        </Link>
                        <Link
                            href="/blog"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("blog")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("about")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            About us
                        </Link>
                    </div>
                    <div className="flex items-center gap-[29px]">
                        <a href="/login"
                            className="text-[16px] bg-white px-6 py-2 rounded-xl hover:text-white hover:bg-blue-400 text-blue-400 font-semibold"
                        >
                            Log in
                        </a>
                        <a href="/signup"
                            className="text-[16px] px-4 py-2 rounded-xl bg-blue-400 hover:text-blue-400 hover:bg-white text-white font-semibold"
                        >
                            Sign up
                        </a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="xl:hidden" onClick={() => setIsOpen(true)}>
                    <Menu className="w-7 h-7 text-white" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-y-0 right-0 z-[60] flex justify-end rounded-xl">
                    <div className="w-64 bg-gradient-to-r from-[#1ba7d9] to-[#235697] h-full shadow-xl p-6 pt-10 relative animate-slide-left rounded-l-xl">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="flex flex-col gap-6 text-gray-700 text-lg font-medium mt-10">
                            <Link
                                href="/"
                                className={`text-white hover:text-gray-200 transition text-center ${isActive("home")
                                    ? "font-bold border-b-2 border-white pb-1"
                                    : ""
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/module"
                                className={`text-white hover:text-gray-200 transition text-center ${isActive("module")
                                    ? "font-bold border-b-2 border-white pb-1"
                                    : ""
                                    }`}
                            >
                                Module
                            </Link>
                            <Link
                                href="/blog"
                                className={`text-white hover:text-gray-200 transition text-center ${isActive("blog")
                                    ? "font-bold border-b-2 border-white pb-1"
                                    : ""
                                    }`}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                className={`text-white hover:text-gray-200 transition text-center ${isActive("about")
                                    ? "font-bold border-b-2 border-white pb-1"
                                    : ""
                                    }`}
                            >
                                About us
                            </Link>

                            <div className="h-[1px] bg-white/30 w-full my-2"></div>

                            <a
                                href="/login"
                                className="bg-white rounded-xl hover:bg-gray-100 text-blue-500 text-center py-2 font-bold"
                            >
                                Log in
                            </a>
                            <a
                                href="/signup"
                                className="rounded-xl border border-white hover:bg-white/10 text-white text-center py-2 font-bold"
                            >
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}