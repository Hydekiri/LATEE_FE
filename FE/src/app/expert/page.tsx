import ExpertDashboardFeature from "@/src/features/expert/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn, getCurrentUser } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Expert Dashboard - Lavender Teeducation",
    description: "Manage clinical cases, virtual patients, and track learner performance.",
};

export default async function ExpertDashboardPage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();

    if (!isExpertLoggedIn) {
        redirect('/login');
    }

    // const currentUser = await getCurrentUser();

    return <ExpertDashboardFeature />;
}