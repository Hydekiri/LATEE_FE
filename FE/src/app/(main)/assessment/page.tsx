import AssessmentPageFeature from "@/src/features/assessment/page";
import { Metadata } from "next";
import { checkIsLoggedInAndRedirectToLogin } from "@/src/app/authFilterChain";

export const metadata: Metadata = {
    title: "Assessment - Lavender Teeducation",
    description: "Review your progress and take medical assessments.",
};

export default async function AssessmentPage() {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();
    console.log('[INFO]: User is logged in, rendering AssessmentPage');
    return <AssessmentPageFeature />;
}