import PracticePageFeature from "@/src/features/practice/page";
import { checkIsLearnerLoggedIn } from "../../authFilterChain";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Practice - Lavender Teeducation",
    description: "Enhance your diagnostic skills with virtual patients.",
};

export default async function PracticePage() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    console.log('[INFO]: Learner is logged in, rendering PracticePage');
    return <PracticePageFeature />;
}