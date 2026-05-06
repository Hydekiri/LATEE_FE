"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeftStartOnRectangleIcon,
    Squares2X2Icon as DashboardIcon,
    UserCircleIcon as VPIcon,
    BriefcaseIcon as CaseIcon,
    UsersIcon as ProgressIcon,
    ChartBarIcon as AssessmentIcon,
    ChatBubbleLeftRightIcon as FeedbackIcon,
} from "@heroicons/react/24/outline";


import {
    Squares2X2Icon as DashboardSolid,
    UserCircleIcon as VPSolid,
    BriefcaseIcon as CaseSolid,
    UsersIcon as ProgressSolid,
    ChartBarIcon as AssessmentSolid,
    ChatBubbleLeftRightIcon as FeedbackSolid,
} from "@heroicons/react/24/solid";

const menuItems = [
    { name: "Dashboard", href: "/expert", outline: DashboardIcon, solid: DashboardSolid },
    { name: "Virtual Patient", href: "/expert/virtual-patient", outline: VPIcon, solid: VPSolid },
    { name: "Clinical Cases", href: "/expert/clinical-case", outline: CaseIcon, solid: CaseSolid },
    { name: "Learner Progress", href: "/expert/learner-progress", outline: ProgressIcon, solid: ProgressSolid },
    { name: "Assessment", href: "/expert/assessment", outline: AssessmentIcon, solid: AssessmentSolid },
    { name: "Issues & Feedback", href: "/expert/feedback", outline: FeedbackIcon, solid: FeedbackSolid },
    { name: "Profile", href: "/expert/profile", outline: VPIcon, solid: VPSolid },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
        {isOpen && (
            <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={onClose} 
            />
        )}

        <aside className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white p-6 shadow-xl transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
        `}>
            <div className="shrink-0 mb-4 flex justify-center border-b-2 border-[#1BA7D9] pb-1"> 
                <Link href="/expert" className="relative block w-full max-w-50 h-16">
                    <Image
                        src="/images/LATEE1.png"
                        alt="LATEE Logo"
                        fill
                        className="object-contain" 
                        priority
                    />
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = isActive ? item.solid : item.outline;

                    return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                        isActive 
                        ? "bg-linear-to-l from-[#1BA7D9] to-[#235697] text-white shadow-lg" 
                        : "text-[#00140E]/80 hover:bg-[#878787]/20 hover:text-[#235697]"
                        }`}
                    >
                        <Icon className="w-5 h-5" />
                        {item.name}
                    </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button className="flex items-center gap-3 px-4 py-3 text-gray-400 font-bold text-sm mt-auto hover:bg-red-500 hover:text-white transition-all">
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Log out
            </button>
        </aside>
        </>
    );
}