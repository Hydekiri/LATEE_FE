import AdminDashboardFeature from "@/src/features/admin/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Lavender Teeducation",
    description: "Manage clinical cases, virtual patients, and track learner performance.",
};

export default function AdminDashboardPage() {
    return <AdminDashboardFeature />;
}