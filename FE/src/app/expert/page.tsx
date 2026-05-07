import ExpertDashboardFeature from "@/src/features/expert/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Expert Dashboard - Lavender Teeducation",
    description: "Manage clinical cases, virtual patients, and track learner performance.",
};

export default function ExpertDashboardPage() {
    return <ExpertDashboardFeature />;
}