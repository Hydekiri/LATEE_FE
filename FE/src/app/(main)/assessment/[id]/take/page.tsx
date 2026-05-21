import TakeAssessmentFeature from "@/src/features/assessment/takeAssessment/TakeAssessmentPage";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkIsLearnerLoggedIn } from "@/src/app/authFilterChain";
import { redirect } from "next/navigation";

async function getFullAssessmentDetails(id: string) {
    console.log('[INFO]: Learner is logged in, fetching assessment data for id:', id);
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`http://localhost:5000/assessment/api/assessments/${id}`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` },
        cache: 'no-store'
    });

    if (!res.ok) return null;
    const responseData = await res.json();
    console.log("FULL ASSESSMENT DETAILS RESPONSE:", responseData);
    return responseData;
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const isLearnerLoggedIn = await checkIsLearnerLoggedIn();

    if (!isLearnerLoggedIn) {
        console.log("Learner has not been logged in. Redirect to login page....");
        redirect('/login');
    }
    const { id } = await params;
    const data = await getFullAssessmentDetails(id);

    if (!data) return (
        <div className="h-screen flex items-center justify-center text-[#235697] font-bold">
            Assessment Not Found
        </div>
    );

    return <TakeAssessmentFeature assessmentData={data} />;
}