"use client";

import React from "react";
import { 
    Bars3Icon, 
    MagnifyingGlassIcon, 
    BellIcon 
} from "@heroicons/react/24/outline";

interface TopbarProps {
    onMenuClick: () => void; 
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="flex justify-between items-center p-4 lg:p-6 bg-linear-to-l from-[#235697] to-[#1BA7D9] backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-all active:scale-95"
                >
                    <Bars3Icon className="w-8 h-8" />
                </button>

                <div className="hidden sm:block">
                    <h1 className="text-lg font-extrabold text-white leading-tight">
                        Hello Nguyen&lsquo;s Tu
                    </h1>
                    <p className="text-[10px] text-white/70 font-medium">
                        3:15 pm 11 Jan 2026
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-5">
                <div className="relative group hidden md:block">
                    <MagnifyingGlassIcon 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1BA7D9] transition-colors w-4 h-4"
                        width={18}
                    />
                    <input 
                        type="text" 
                        placeholder="Type here..." 
                        className="bg-white/95 backdrop-blur-sm rounded-full py-2.5 pl-10 pr-4 text-xs outline-none w-40 lg:w-72 shadow-sm border border-transparent focus:border-[#1BA7D9]/30 transition-all placeholder:text-gray-400"
                    />
                </div>

                {/* Notification Bell */}
                <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all group">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF1CF7] rounded-full border-2 border-[#235697] group-hover:scale-110 transition-transform"></span>
                </button>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 lg:gap-3 bg-white/10 p-1 lg:p-1.5 lg:pr-4 rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-white overflow-hidden shadow-inner shrink-0">
                        <img 
                            src="/images/Profile.png" 
                            alt="User" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <span className="text-xs font-bold text-white hidden lg:block">
                        Nguyen&lsquo;s Tu
                    </span>
                </div>
            </div>
        </header>
    );
}