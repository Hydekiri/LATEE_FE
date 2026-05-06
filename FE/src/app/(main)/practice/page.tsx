// src/app/(main)/practice/page.tsx
import PracticePageFeature from "@/src/features/practice/page";
import { checkIsLoggedInAndRedirectToLogin } from "../../authFilterChain";

export const metadata = {
    title: "Practice - Lavender Teeducation",
    description: "Enhance your diagnostic skills with virtual patients.",
};

export default async function PracticePage() {
    const checkIsLoggedInAndRedirectToLoginResult = await checkIsLoggedInAndRedirectToLogin();

    console.log('[INFO]: User is logged in, rendering PracticePage');
    return <PracticePageFeature />;
}