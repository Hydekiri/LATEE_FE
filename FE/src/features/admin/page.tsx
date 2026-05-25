"use client";

import React from "react";
import KPICardSection from "@/src/features/admin/components/KPICard";
import MainAnalytics from "@/src/features/admin/components/MainAnalytics";
import PartnerSection  from "@/src/features/admin/components/PartnerSession";
import { AdminDashboardStats } from "./types/user";

export default function AdminDashboardFeature({ dashboardStats }: { dashboardStats: AdminDashboardStats | null }) {
    return (         
        <section className="p-6 space-y-6">
            <KPICardSection dashboardStats={dashboardStats} />
            <MainAnalytics dashboardStats={dashboardStats} />
            <PartnerSection />
        </section>
    );
}