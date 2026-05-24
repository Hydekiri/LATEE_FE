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

export default function FeedbackPage() {
    return <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Issues & Feedback</h1>
        <p className="text-gray-600">This is the Issues & Feedback page. Here, experts can view and manage reported errata, clinical debates, and user inquiries.</p>
    </div>;
}