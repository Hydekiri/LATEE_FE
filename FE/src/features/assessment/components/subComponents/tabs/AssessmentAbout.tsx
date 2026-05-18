// src/features/assessment/components/subComponents/tabs/AssessmentAbout.tsx
"use client";

import { ArrowRightIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { AssessmentData } from '@/src/types/assessment';
import { getCookie } from '@/src/utils/cookies';

interface AssessmentAboutProps {
    data: AssessmentData;
}

export const AssessmentAbout = ({ data }: AssessmentAboutProps) => {
    const router = useRouter();

    const handleJoin = async () => {
        try {
            const accessToken = getCookie("accessToken");
            const learnerId = getCookie("userId");
            const assessmentId = data.assessmentId;

            if (!data.isActive) {
                alert("This assessment is no longer active. You cannot join this assessment.");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/assessment/api/assessments/${assessmentId}/learner/${learnerId}/attempts`,
                {
                    headers: {
                        accept: '*/*',
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            const result = await response.json();
            const attemptsMade = result?.data?.length || 0;
            const maxAttempts = data.maxAttempts || 3;

            if (attemptsMade >= maxAttempts) {
                alert("You have reached the maximum number of attempts. You cannot join this assessment.");
                return;
            }

        } catch (error) {
            console.error("Fetch error:", error);
            alert("Cannot verify attempts right now. Please try again.");
            return;
        }

        router.push(`/assessment/${data.assessmentId}/take`);
    };

    return (
        <div className="flex flex-col gap-12">
            <div className="bg-[#00B7FF]/20 border-b-4 border-b-[#1BA7D9] rounded-lg p-10 relative">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                            <DocumentTextIcon className="w-8 h-8 text-[#1BA7D9]" />
                        </div>
                        <h3 className="text-3xl font-bold text-[#235697]">General Info</h3>
                    </div>
                    <button
                        disabled={!data.isActive || (data.listAttempts?.length || data.timesPracticed || 0) >= data.maxAttempts}
                        onClick={handleJoin}
                        className="flex items-center gap-2 bg-white text-[#1BA7D9] px-6 py-3 rounded-lg font-bold hover:bg-[#1BA7D9] hover:text-white transition-all duration-300 ease-in-out shadow-md active:scale-95"
                    >
                        Join Assessment <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 mb-8 text-lg">
                    <div>
                        <span className="text-[#235697] font-bold">Time Required:</span>
                        <span className="text-gray-700 ml-1">{data.timeLimitMinutes || 20} minutes</span>
                    </div>
                    <div>
                        <span className="text-[#235697] font-bold">Passing Goal:</span>
                        <span className="text-gray-700 ml-1">{data.passingScorePercentage || 80}%</span>
                    </div>
                    <div>
                        <span className="text-[#235697] font-bold">Max Attempts:</span>
                        <span className="text-gray-700 ml-1">{data.maxAttempts || 1} times</span>
                    </div>
                    <div>
                        <span className="text-[#235697] font-bold">Specialty:</span>
                        <span className="text-gray-700 ml-1">{data.specialty || "General Medicine"}</span>
                    </div>
                    <div>
                        <span className="text-[#235697] font-bold">Questions:</span>
                        <span className="text-gray-700 ml-1">{data.numQuestions || 0} items</span>
                    </div>
                    <div>
                        <span className="text-[#235697] font-bold">Difficulty:</span>
                        <span className="text-gray-700 ml-1">{data.difficultyLevel}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-xl font-bold text-[#235697]">
                        Title: <span className="font-normal text-gray-800">{data.title}</span>
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed italic">
                        <span className="font-bold text-[#235697] not-italic">Learning Goal:</span> &quot;{data.goal || "Not specified"}&quot;
                    </p>

                    <p className="text-lg text-gray-700 leading-relaxed">
                        <span className="font-bold text-[#235697]">Description:</span> {data.descriptions || "No description provided for this assessment."}
                    </p>

                    <div className="mt-6">
                        <p className="text-[#235697] font-bold text-lg">Author: {data.author || "Latee Medical AI"}</p>
                        <p className="text-[#1BA7D9] text-base">{data.authorRole || "Clinical Expert Systems"}</p>
                    </div>
                </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-[#F6F6F6] rounded-xl p-10 mb-4">
                <h3 className="text-3xl font-bold text-[#235697] mb-6 tracking-tight">What you will learn</h3>
                <ol className="list-decimal pl-5 space-y-4 text-lg text-gray-700">
                    {data.learningObjectives && data.learningObjectives.length > 0 ? (
                        data.learningObjectives.map((obj: string, i: number) => (
                            <li key={i}>{obj}</li>
                        ))
                    ) : (
                        <>
                            <li>Develop diagnostic reasoning skills for <span className="font-semibold">{data.topic || "this clinical case"}</span>.</li>
                            <li>Understand the indications and contraindications of standard treatments.</li>
                            <li>Practice clinical decision-making under time-sensitive scenarios.</li>
                            <li>Improve patient safety by recognizing common clinical pitfalls.</li>
                        </>
                    )}
                </ol>
            </div>
        </div>
    );
};