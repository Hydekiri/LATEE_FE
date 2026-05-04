import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Định nghĩa cấu trúc dữ liệu trả về từ Backend
interface SubmitResponse {
    data?: {
        attemptId: string;
        score: number;
        isPassed: boolean;
    };
    message?: string;
    error?: string;
}

interface SubmitModalProps {
    onCancel: () => void;
    answeredCount: number;
    totalQuestions: number;
    assessmentId: string;
    answers: Record<string, string>;
    durationSeconds: number;
}

export const SubmitModalContent = ({ 
    onCancel, 
    answeredCount, 
    totalQuestions, 
    assessmentId, 
    answers, 
    durationSeconds 
}: SubmitModalProps) => {
    const router = useRouter(); 
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (): Promise<void> => {
        if (!assessmentId || assessmentId === "string") {
            alert("ID bài đánh giá không hợp lệ. Vui lòng tải lại trang.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                assessmentId: assessmentId, 
                userId: "EXP_ANDREW", 
                durationSeconds: Math.floor(durationSeconds),
                answers: Object.keys(answers).map(qId => ({
                    questionId: qId,
                    selectedOptionId: answers[qId]
                }))
            };

            const response = await fetch(`http://localhost:5000/assessment/api/assessments/api/attempts/submit`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const result: SubmitResponse = await response.json();

            if (!response.ok) {
                const errorMessage = result.error || result.message || `Lỗi hệ thống (${response.status})`;
                throw new Error(errorMessage);
            }
            
            if (result.data?.attemptId) {
                router.push(`/assessment/${assessmentId}?tab=results&attemptId=${result.data.attemptId}`);
            } else {
                throw new Error("Nộp bài thành công nhưng không nhận được mã kết quả.");
            }
            
        } catch (error: unknown) {
            console.error("Submit Error:", error);
            let message = "Không thể nộp bài. Vui lòng kiểm tra lại kết nối.";
            
            if (error instanceof Error) {
                message = error.message;
            }
            
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-center p-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-6">
                <CheckBadgeIcon className="h-8 w-8 text-[#1BA7D9]" />
            </div>
            <h3 className="text-2xl font-bold text-[#235697] mb-2">Finish & Submit?</h3>
            <p className="text-slate-500 mb-6">
                You have completed <strong>{answeredCount}/{totalQuestions}</strong> questions.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                    disabled={isSubmitting}
                    onClick={handleSubmit} 
                    className="w-full py-4 bg-[#235697] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isSubmitting ? (
                        <>
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        "Yes, Submit Now"
                    )}
                </button>
                <button 
                    disabled={isSubmitting}
                    onClick={onCancel}
                    className="w-full py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                    Review Answers
                </button>
            </div>
        </div>
    );
};