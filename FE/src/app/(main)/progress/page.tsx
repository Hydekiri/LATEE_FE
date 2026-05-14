// /src/app/(main)/progress/page.tsx
import ProgressPage from "@/src/features/progress/progressPage";
import { checkIsLearnerLoggedIn } from "../../authFilterChain";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Progress - Lavender Teeducation",
    description: "Track your learning journey and monitor your progress.",
};

export default async function Progress() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    console.log('[INFO]: Learner is logged in, rendering ProgressPage');
    return <ProgressPage />;
}