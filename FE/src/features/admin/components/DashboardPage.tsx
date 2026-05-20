'use client';

import AdminDashboardFeature from "@/src/features/admin/page";
import Sidebar from "@/src/features/admin/components/Sidebar";
import Topbar from "@/src/features/admin/components/Topbar";
import { useEffect, useState } from "react";
import { AdminDashboardStats } from "@/src/features/admin/types/user";
import { adminDashboardStats } from "@/src/services/user-service";

export default function DashboardPage({ adminId, adminName, adminAvatarURL }: { adminId: string, adminName: string, adminAvatarURL: string }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [dashboardStats, setDashboardStats] = useState<AdminDashboardStats | null>(null);

    useEffect(() => {
        const loadDashboardStats = async () => {
            try {
                const stats = await adminDashboardStats();
                const dashboardStats: AdminDashboardStats = {
                    increase_user: stats.increaseUser,
                    total_learners: stats.totalLearners,
                    total_experts: stats.totalExperts,
                    total_admins: stats.totalAdmins,
                    total_active_users: stats.totalActiveUsers,
                };
                //console.log("Fetched dashboard stats:", dashboardStats);
                setDashboardStats(dashboardStats);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        loadDashboardStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#235697] bg-linear-to-l from-[#235697] to-[#1BA7D9]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} adminId={adminId} username={adminName} userImgURL={adminAvatarURL} />
                <main className="flex-1 overflow-y-auto no-scrollbar">
                    <AdminDashboardFeature dashboardStats={dashboardStats} />
                </main>
            </div>

        </div>
    );
}