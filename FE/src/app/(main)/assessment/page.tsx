import AssessmentPageFeature from "@/src/features/assessment/page";
import { Metadata } from "next";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Assessment - Lavender Teeducation",
    description: "Review your progress and take medical assessments.",
};

export default async function AssessmentPage() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    console.log('[INFO]: Learner is logged in, rendering AssessmentPage');
    return <AssessmentPageFeature />;
}