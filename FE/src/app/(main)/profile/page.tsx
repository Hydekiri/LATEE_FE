import { checkIsLearnerLoggedIn, getCurrentUser } from "@/src/app/authFilterChain";
import { redirect } from 'next/navigation';
import LearnerProfilePage from "@/src/features/profile/LearnerProfile";


export const metadata = {
    title: "Latee | Learner Profile",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};
export default async function ProfilePagez() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    const currentLearner = await getCurrentUser();

    return (
        <LearnerProfilePage learnerId={currentLearner?.userId || ''} learnerName={currentLearner?.username || ''} learnerAvatarURL={currentLearner?.avatarUrl || ''} />
    );
}