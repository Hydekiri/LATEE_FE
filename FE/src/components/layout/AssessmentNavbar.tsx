"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BellIcon } from '@heroicons/react/24/outline'
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { getCookie } from "@/src/utils/cookies";

export default function AssessmentNavbar() {
    const router = useRouter();

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

    const handleExit = () => {
        if (confirm("Are you sure you want to exit? Your progress may not be saved.")) {
            router.push("/assessment");
        }
    };

    return (
        <nav className="w-full top-0 left-0 bg-linear-to-r from-[#1ba7d9] to-[#235697] shadow-md z-50 flex justify-center sticky">
            <div className="w-[86%] flex items-center justify-between py-3">

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

                {/* <div className="hidden md:flex flex-col items-center">
                    <span className="text-white text-2xl font-bold tracking-wide">
                        Assessment Workspace
                    </span>
                    <div className="w-32 h-1 bg-white rounded-full mt-1 opacity-80"></div>
                </div> */}

                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-white/10 rounded-full transition group">
                        <BellIcon className="w-6 h-6 text-white group-hover:scale-110" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#235697]"></span>
                    </button>
                    {userInfo && (
                        <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                            <div className="w-10 h-10 rounded-full bg-white overflow-hidden relative border-2 border-white/50 shadow-sm">
                                <Image
                                    src="/images/ava1.jpg"
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col text-white text-left sm:flex">
                                <span className="font-bold text-sm truncate w-24">
                                    {userInfo.name}
                                </span>
                                <span className="text-[10px] opacity-70">Student</span>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}