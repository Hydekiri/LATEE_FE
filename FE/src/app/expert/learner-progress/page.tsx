import LearnerProgressFeature from "@/src/features/expert/learner-progress/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Learner Progress - Lavender Teeducation",
    description: "Monitor clinical logs, competencies, and progression trends.",
};

export default async function LearnerProgressPage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();

    if (!isExpertLoggedIn) {
        redirect('/login');
    }

    return <LearnerProgressFeature />;
}