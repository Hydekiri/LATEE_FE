import ClinicalCaseDetailFeature from "@/src/features/expert/clinical-case/detail";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Clinical Case Artifacts - Lavender Teeducation",
    description: "Deep audit of physical exams, laboratory tests, and radiology reporting sheets.",
};

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ClinicalCaseDetailPage({ params }: Props) {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();
    if (!isExpertLoggedIn) {
        redirect('/login');
    }
    const resolvedParams = await params;
    return <ClinicalCaseDetailFeature caseId={resolvedParams.id} />;
}