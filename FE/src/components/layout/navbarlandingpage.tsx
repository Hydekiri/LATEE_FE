"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

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
                <img src="/images/LATEE2.png" alt="LATEE Logo" className="w-[13%]" />

                {/* Desktop Menu */}
                <div className="max-w-[70%] hidden xl:flex xl:gap-[70px] text-gray-700 font-medium">
                    <div className="flex items-center gap-[80px]">
                        <a
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
                        </a>

                        <a
                            href="/"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("module")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            Module
                        </a>
                        <a
                            href="/"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("blog")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            Blog
                        </a>
                        <a
                            href="/"
                            className={`relative text-[16px] px-4 text-white py-2 transition
                            ${isActive("about")
                                    ? "after:content-[''] font-inter-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-6px] after:w-[80%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-4px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }`}
                        >
                            About us
                        </a>
                    </div>
                    <div className="flex items-center gap-[29px]">
                        <a href="/login"
                            className="text-[16px] bg-white px-6 py-2 rounded-xl hover:text-white hover:bg-blue-400 text-blue-400"
                        >
                            Log in
                        </a>
                        <a href="/signup"
                            className="text-[16px] px-4 py-2 rounded-xl bg-blue-400 hover:text-blue-400 hover:bg-white text-white"
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
                    <div className="w-50 bg-gradient-to-r from-[#1ba7d9] to-[#235697] h-100 shadow-xl p-6 pt-10 relative animate-slide-left rounded-xl">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="flex flex-col gap-6 text-gray-700 text-lg font-medium mt-6">
                            <a
                                href="/"
                                className={`text-white hover:text-white transition text-center ${isActive("home")
                                    ? "border-b-[5px] border-white pb-2"
                                    : "border-b-2 border-transparent hover:border-white"
                                    }`}
                            >
                                Home
                            </a>
                            <a
                                href="/module"
                                className={`text-white hover:text-white transition text-center ${isActive("module")
                                    ? "border-b-[5px] border-white pb-2"
                                    : "border-b-2 border-transparent hover:border-white"
                                    }`}
                            >
                                Module
                            </a>
                            <a
                                href="/blog"
                                className={`text-white hover:text-white transition text-center ${isActive("blog")
                                    ? "border-b-[5px] border-white pb-2"
                                    : "border-b-2 border-transparent hover:border-white"
                                    }`}
                            >
                                Blog
                            </a>
                            <a
                                href="/about"
                                className={`text-white hover:text-white transition text-center ${isActive("about")
                                    ? "border-b-[5px] border-white pb-2"
                                    : "border-b-2 border-transparent hover:border-white"
                                    }`}
                            >
                                About us
                            </a>

                            <a
                                href="/login"
                                className="bg-white rounded-xl hover:text-white hover:bg-blue-400 text-blue-400 text-center py-2"
                            >
                                Log in
                            </a>
                            <a
                                href="/signup"
                                className="rounded-xl bg-blue-400 hover:text-blue-400 hover:bg-white text-white text-center py-2"
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