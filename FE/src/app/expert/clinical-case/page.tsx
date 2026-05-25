import ClinicalCaseFeature from "@/src/features/expert/clinical-case/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Clinical Cases Workspace - Lavender Teeducation",
    description: "Author and manage physical examinations, symptoms, and medical histories inside core clinical cases.",
};

export default async function ClinicalCasePage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();
    if (!isExpertLoggedIn) {
        redirect('/login');
    }

    return <ClinicalCaseFeature />;
}