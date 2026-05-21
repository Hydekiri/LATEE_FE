import ExpertProfileFeature from "@/src/features/expert/profile/page";
import { Metadata } from "next";
import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Expert Profile - Lavender Teeducation",
    description: "Manage credentials, specialization domains, and signatures.",
};

export default async function ExpertProfilePage() {
    const isExpertLoggedIn = await checkIsExpertLoggedIn();

    if (!isExpertLoggedIn) {
        redirect('/login');
    }

    return <ExpertProfileFeature />;
}