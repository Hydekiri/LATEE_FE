import HomePage from "@/src/features/home/homepage";
import { redirect } from "next/navigation";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Latee | Learner Home",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};


export default async function Home() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }
    //const currentLearner = await getCurrentUser();
    
    return (
        <HomePage />
    );
}