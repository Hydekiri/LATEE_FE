// import FeedbackFeature from "@/src/features/expert/feedback/page";
// import { Metadata } from "next";
// import { checkIsExpertLoggedIn } from "@/src/app/authFilterChain";
// import { redirect } from "next/navigation";

// export const metadata: Metadata = {
//     title: "Issues & Feedback - Lavender Teeducation",
//     description: "Manage reported errata, clinical debate, and user inquiries.",
// };

// export default async function FeedbackPage() {
//     const isExpertLoggedIn = await checkIsExpertLoggedIn();

//     if (!isExpertLoggedIn) {
//         redirect('/login');
//     }

//     return <FeedbackFeature />;
// }