"use client";

import { useState } from "react";
import Sidebar from "@/src/features/expert/components/Sidebar";
import Topbar from "@/src/features/expert/components/Topbar";

export default function ExpertLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#235697] bg-linear-to-l from-[#235697] to-[#1BA7D9]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto no-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}