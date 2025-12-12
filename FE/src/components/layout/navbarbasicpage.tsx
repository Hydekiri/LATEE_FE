"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
    currentPage?:
    | "home"
    | "practice"
    | "assessment"
    | "progress"
    | "blog"
    | "aboutUs";
}

export default function Navbar({ currentPage = "home" }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const userRouter = useRouter();
    const isActive = (page: string) => currentPage === page;

    const hasNotifications = false;
    const notificationImageUrl = hasNotifications
        ? "/images/notiwithalert.png"
        : "/images/noti.png";

    return (
        <nav className="w-full top-0 left-0 bg-gradient-to-r from-[#1ba7d9] to-[#235697] shadow z-50 flex justify-center">
            <div className="w-[90%] flex items-center justify-between py-[22px]">

                {/* Logo */}
                <img src="/images/LATEE2.png" alt="LATEE Logo" className="w-[13%]" />

                {/* Desktop Menu */}
                <div className="max-w-[80%] hidden xl:flex items-center gap-[54px] text-white">

                    {/* Navigation */}
                    <div className="flex items-center gap-[40px]">

                        {/* HOME */}
                        <a
                            onClick={() => userRouter.push('/home')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("home")
                                    ? "after:content-[''] after:absolute font-inter-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[5px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato-r hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            Home
                        </a>

                        {/* PRACTICE MODE */}
                        <a
                            onClick={() => userRouter.push('/practice')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("practice")
                                    ? "after:content-[''] after:absolute font-inter after:font-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[3px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            Practice Mode
                        </a>

                        {/* ASSESSMENT */}
                        <a
                            onClick={() => userRouter.push('/assessment')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("assessment")
                                    ? "after:content-[''] after:absolute font-inter after:font-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[3px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            Assessment
                        </a>

                        {/* PROGRESS */}
                        <a
                            onClick={() => userRouter.push('/progress')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("progress")
                                    ? "after:content-[''] after:absolute font-inter after:font-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[3px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            Progress
                        </a>

                        {/* BLOG */}
                        <a
                            onClick={() => userRouter.push('/blog')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("blog")
                                    ? "after:content-[''] after:absolute font-inter after:font-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[3px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            Blog
                        </a>

                        {/* ABOUT */}
                        <a
                            onClick={() => userRouter.push('/aboutUs')}
                            className={`relative text-[16px] transition px-2
                                ${isActive("about")
                                    ? "after:content-[''] after:absolute font-inter after:font-semibold after:left-1/2 after:-translate-x-1/2 after:bottom-[-9px] after:w-[110%] after:h-[3px] after:bg-white after:rounded-full"
                                    : "hover:after:content-[''] font-lato hover:after:absolute hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bottom-[-7px] hover:after:w-[80%] hover:after:h-[1px] hover:after:bg-white hover:after:rounded-full"
                                }
                            `}
                        >
                            About us
                        </a>
                    </div>

                    {/* User Area */}
                    <div className="flex items-center gap-[10px]">
                        <Image
                            src={notificationImageUrl}
                            alt="Notifications"
                            width={24}
                            height={24}
                            className="cursor-pointer w-[30px] h-[28px]"
                        />
                        <span className="text-[16px] px-4 py-2">Nguyen's Tu</span>

                        <Image
                            src="/images/VirtualPatient/VP5.jpeg"
                            alt="student"
                            width={50}
                            height={50}
                            className="rounded-xl w-[48px] h-[48px] cursor-pointer"
                        />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="xl:hidden" onClick={() => setIsOpen(true)}>
                    <Menu className="w-7 h-7 text-white" />
                </button>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="fixed inset-y-0 right-0 z-[60] flex justify-end">
                    <div className="w-50 bg-gradient-to-r from-[#1ba7d9] to-[#235697] shadow-xl p-6 pt-10 relative animate-slide-left rounded-xl">

                        {/* Close */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Mobile Nav */}
                        <div className="flex flex-col gap-6 text-white mt-6 text-center text-[14px] font-medium">

                            {[
                                ["home", "Home"],
                                ["practice", "Practice Mode"],
                                ["assessment", "Assessment"],
                                ["progress", "Progress"],
                                ["blog", "Blog"],
                                ["aboutUs", "About us"],
                            ].map(([key, label]) => (
                                <a
                                    key={key}
                                    onClick={() => userRouter.push(`/${key}`)}
                                    className={`transition text-center ${isActive(key)
                                        ? "border-b-[5px] border-white pb-1"
                                        : "border-b-2 border-transparent hover:border-white"
                                        }`}
                                >
                                    {label}
                                </a>
                            ))}

                            {/* Avatar */}
                            <div className="flex justify-center">
                                <Image
                                    src="/images/VirtualPatient/VP5.jpeg"
                                    alt="student"
                                    width={60}
                                    height={60}
                                    className="rounded-xl mt-4"
                                />
                            </div>

                            <p className="text-white mt-2">Nguyen's Tu</p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
