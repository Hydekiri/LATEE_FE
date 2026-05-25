import { checkIsLoggedInAndRedirectToLogin } from "@/src/app/authFilterChain";
import { ReasoningPage } from "@/src/features/practice/takePractice/components/ReasoningPage";
interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ReasoningRoute({ params }: PageProps) {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();

    const { id } = await params;
    console.log('Taking practice session clinical reasoning with ID:', id);
    return <ReasoningPage id={id} />;
}