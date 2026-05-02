import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation'; // Import useRouter

export const SubmitModalContent = ({ 
    onConfirm, 
    onCancel, 
    answeredCount, 
    totalQuestions,
    assessmentId 
}: { 
    onConfirm: () => void, 
    onCancel: () => void,
    answeredCount: number,
    totalQuestions: number,
    assessmentId: string 
}) => {
    const router = useRouter(); 

    const handleSubmit = () => {
        onConfirm(); 
        router.push(`/assessment/${assessmentId}?tab=results`);
    };

    return (
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#00B7FF]/10 mb-6">
                <CheckBadgeIcon className="h-8 w-8 text-[#1BA7D9]" />
            </div>
            <h3 className="text-2xl font-bold text-[#235697] mb-2">Finish & Submit?</h3>
            <p className="text-slate-500 mb-2">
                You have completed <strong>{answeredCount}/{totalQuestions}</strong> questions.
            </p>
            <p className="text-slate-400 text-sm mb-8 italic">
                Once submitted, you cannot change your answers.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleSubmit} 
                    className="w-full py-3.5 bg-linear-to-r from-[#1BA7D9] to-[#235697] text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    Yes, Submit Now
                </button>
                <button 
                    onClick={onCancel}
                    className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                >
                    Review Answers
                </button>
            </div>
        </div>
    );
};