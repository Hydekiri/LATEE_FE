'use client';

import AdminDashboardFeature from "@/src/features/admin/page";
import Sidebar from "@/src/features/admin/components/Sidebar";
import Topbar from "@/src/features/admin/components/Topbar";
import { useState } from "react";


export default function DashboardPage({ adminId, adminName, adminAvatarURL }: { adminId: string, adminName: string, adminAvatarURL: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#235697] bg-linear-to-l from-[#235697] to-[#1BA7D9]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} adminId={adminId} username={adminName} userImgURL={adminAvatarURL} />
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <AdminDashboardFeature />
                </main>
            </div>

        </div>
    );
}