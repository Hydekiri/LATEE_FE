import BlogFeature from "@/src/features/blog/page";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Latee | Learner Blog",
    description: "Welcome to Latee. A smarter way to practice clinical decision-making.",
};

export default async function BlogPage() {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    return <BlogFeature />;
}