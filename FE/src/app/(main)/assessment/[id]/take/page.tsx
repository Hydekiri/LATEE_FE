import TakeAssessmentFeature from "@/src/features/assessment/takeAssessment/TakeAssessmentPage";
import { MOCK_FULL_ASSESSMENT } from "@/src/data/mockAssessment";

export default function Page() {
    return <TakeAssessmentFeature assessmentData={MOCK_FULL_ASSESSMENT} />;
}