import AssessmentPageFeature from "@/src/features/assessment/page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Assessment - Lavender Teeducation",
    description: "Review your progress and take medical assessments.",
};

export default function AssessmentPage() {
    return <AssessmentPageFeature />;
}