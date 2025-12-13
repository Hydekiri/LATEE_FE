import Image from 'next/image';
import { Sparkles, LogOut, Bell } from 'lucide-react';

interface HeaderProps {
    isAiSidebarOpen: boolean;
    onToggleAi: () => void;
}

export const Header = ({ isAiSidebarOpen, onToggleAi }: HeaderProps) => {
    return (
        <header className="h-16 bg-[#235697] flex items-center justify-between px-6 shadow-md shrink-0 z-50">
        <div className="flex items-center gap-2">
            <div className="relative w-[120px] h-10 lg:w-[140px] lg:h-12">
            <Image src="/LATEE2.png" alt="LATEE Logo" fill className="object-contain object-left" priority />
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
            onClick={onToggleAi}
            className="bg-white rounded-[10px] px-4 py-1.5 flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            >
            <Sparkles className="w-4 h-4 text-[#235697]" />
            <span className="text-[#235697] font-semibold text-sm">AI Assistant</span>
            <div className={`w-10 h-5 rounded-full relative ml-2 transition-colors duration-300 ${isAiSidebarOpen ? 'bg-[#235697]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isAiSidebarOpen ? 'right-1' : 'left-1'}`}></div>
            </div>
            </button>

            <button className="bg-white text-[#235697] px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition">
            Log out <LogOut className="w-4 h-4" />
            </button>

            <div className="relative cursor-pointer">
            <Bell className="w-6 h-6 text-white" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#235697]"></span>
            </div>

            <div className="flex items-center gap-2 text-white ml-2">
            <span className="font-semibold text-sm hidden md:block">Nguyen Tu</span>
            <div className="w-9 h-9 rounded-lg bg-gray-300 overflow-hidden border border-white/50">
                <Image src="/ITS_LOGO1.png" width={36} height={36} alt="User" className="object-cover" />
            </div>
            </div>
        </div>
        </header>
    );
};