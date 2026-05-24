import { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import VirtualPatientFeature from "@/src/features/expert/virtual-patient/page";

export const metadata: Metadata = {
    title: "Virtual Patient Console — Lavender Teeducation",
    description: "Manage AI simulation personas, configure clinical scenarios, monitor simulation readiness.",
};

export default async function VirtualPatientPage() {
    const isLoggedIn = await checkIsExpertLoggedIn();
    if (!isLoggedIn) redirect("/login");

    return <VirtualPatientFeature />;
}