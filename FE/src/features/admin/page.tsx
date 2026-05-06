"use client";

import React from "react";
import KPICardSection from "@/src/features/admin/components/KPICard";
import MainAnalytics from "@/src/features/admin/components/MainAnalytics";
import PartnerSection  from "@/src/features/admin/components/PartnerSession";

export default function AdminDashboardFeature() {
    return (         
        <section className="p-6 space-y-6">
            <KPICardSection />
            <MainAnalytics />
            <PartnerSection />
        </section>
    );
}