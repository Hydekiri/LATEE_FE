import TakeAssessmentFeature from "@/src/features/assessment/takeAssessment/TakeAssessmentPage";

async function getFullAssessmentDetails(id: string) {
    const res = await fetch(`http://localhost:5000/assessment/api/assessments/${id}`, {
        cache: 'no-store'
    });
    
    if (!res.ok) return null;
    return res.json();
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const data = await getFullAssessmentDetails(id);

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-[#235697] font-bold">Assessment data not found.</p>
            </div>
        );
    }
    
    return <TakeAssessmentFeature assessmentData={data} />;
}