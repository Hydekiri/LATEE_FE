import { Metadata } from "next";
import { redirect } from "next/navigation";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import VirtualPatientDetailFeature from "@/src/features/expert/virtual-patient/detail";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    return {
        title: `Patient ${resolvedParams.id} — Virtual Patient Console`,
        description: "Configure AI persona, vital signs, simulation logic, and learning objectives.",
    };
}

export default async function VirtualPatientDetailPage({ params }: Props) {
    const isLoggedIn = await checkIsExpertLoggedIn();
    if (!isLoggedIn) redirect("/login");

    const resolvedParams = await params;
    return <VirtualPatientDetailFeature patientId={resolvedParams.id} />;
}