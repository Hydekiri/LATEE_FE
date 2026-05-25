'use client';

import Image from 'next/image';
import { Sparkles, LogOut, Bell } from 'lucide-react';
import { getCookie } from '@/src/utils/cookies';

interface HeaderProps {
    readonly isAiSidebarOpen: boolean;
    readonly onToggleAi: () => void;
    readonly onRequestExit: () => void;
    readonly sessionId?: string;
    readonly patientId?: string;
}

export const Header = ({
    isAiSidebarOpen,
    onToggleAi,
    onRequestExit,
}: HeaderProps) => {
    const displayName = getCookie('userName') ?? 'Learner';

    return (
        <header className="h-16 bg-[#235697] flex items-center justify-between px-6 shadow-md shrink-0 z-50">
            <div className="flex items-center gap-2">
                <div className="relative w-30 h-10 lg:w-35 lg:h-12">
                    <Image
                        src="/images/LATEE2.png"
                        alt="LATEE Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* AI Assistant toggle */}
                <button
                    onClick={onToggleAi}
                    className="bg-white rounded-[10px] px-4 py-1.5 flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                    aria-label="Toggle AI Assistant"
                    aria-pressed={isAiSidebarOpen}
                >
                    <Sparkles className="w-4 h-4 text-[#235697]" />
                    <span className="text-[#235697] font-semibold text-sm">AI Assistant</span>
                    <div
                        className={`w-10 h-5 rounded-full relative ml-2 transition-colors duration-300 ${isAiSidebarOpen ? 'bg-[#235697]' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isAiSidebarOpen ? 'right-1' : 'left-1'
                                }`}
                        />
                    </div>
                </button>

                {/* Exit — triggers confirmation modal instead of hard logout */}
                <button
                    onClick={onRequestExit}
                    className="bg-white text-[#235697] px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition"
                    aria-label="Exit practice session"
                >
                    Exit <LogOut className="w-4 h-4" />
                </button>

                {/* Notifications */}
                <div className="relative cursor-pointer" aria-label="Notifications">
                    <Bell className="w-6 h-6 text-white" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#235697]" />
                </div>

                {/* User */}
                <div className="flex items-center gap-2 text-white ml-2">
                    <span className="font-semibold text-sm hidden md:block">{displayName}</span>
                    <div className="w-9 h-9 rounded-lg bg-gray-300 overflow-hidden border border-white/50">
                        <Image
                            src="/images/ava1.jpg"
                            width={36}
                            height={36}
                            alt="User avatar"
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};