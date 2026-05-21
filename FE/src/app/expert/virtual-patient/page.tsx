import VirtualPatientFeature from "@/src/features/expert/virtual-patient/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Virtual Patients Console - Lavender Teeducation",
    description: "Design AI persona configurations, prompt weights, and vital signs vectors.",
};

export default async function VirtualPatientPage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();
    if (!isExpertLoggedIn) redirect('/login');

    return <VirtualPatientFeature />;
}