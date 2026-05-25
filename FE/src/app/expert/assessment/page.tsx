import AssessmentFeature from "@/src/features/expert/assessment/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Assessments - Lavender Teeducation",
    description: "Review comprehensive examinations and structured metrics.",
};

export default async function AssessmentPage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();

    if (!isExpertLoggedIn) {
        redirect('/login');
    }

    return <AssessmentFeature />;
}