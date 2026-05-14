import { TakePracticePage } from '@/src/features/practice/takePractice/components/TakePracticePage';
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TakePracticeRoute({ params }: PageProps) {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }

    const resolvedParams = await params;
    console.log('Taking practice session with ID:', resolvedParams.id);

    return <TakePracticePage params={resolvedParams} />;
}
