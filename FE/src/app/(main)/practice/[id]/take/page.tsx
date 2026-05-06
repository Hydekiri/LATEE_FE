import { TakePracticePage } from '@/src/features/practice/takePractice/components/TakePracticePage';
import { checkIsLoggedInAndRedirectToLogin } from "@/src/app/authFilterChain";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function TakePracticeRoute({ params }: PageProps) {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();

    const resolvedParams = await params;
    console.log('Taking practice session with ID:', resolvedParams.id);

    return <TakePracticePage params={resolvedParams} />;
}
