// /src/app/(main)/progress/page.tsx
import ProgressPage from "@/src/features/progress/progressPage";
import { checkIsLoggedInAndRedirectToLogin } from "../../authFilterChain";

export const metadata = {
    title: "Practice - Lavender Teeducation",
    description: "Enhance your diagnostic skills with virtual patients.",
};

export default async function Progress() {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();

    console.log('[INFO]: User is logged in, rendering ProgressPage');
    return <ProgressPage />;
}