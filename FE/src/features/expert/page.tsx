"use client";

import React from "react";
import KPICardSection from "@/src/features/expert/components/KPICard";
import MainAnalytics from "@/src/features/expert/components/MainAnalytics";
import IssueManagement from "@/src/features/expert/components/IssueManagement";

export default function ExpertDashboardFeature() {
    return (         
        <section className="p-6 space-y-6">
            <KPICardSection />
            <MainAnalytics />
            <IssueManagement />
        </section>
    );
}