import HomePage from "@/src/features/home/homepage";
import { redirect } from "next/navigation";
import { checkIsLearnerLoggedIn, getCurrentUser } from "../../authFilterChain";

export default async function Home() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }
    // COMMENT HERE IF WOULD LIKE TO PASS USER ATTRIBUTES TO LOWER COMPONENTS
    //const currentLearner = await getCurrentUser();
    
    return (
        <HomePage />
    );
}