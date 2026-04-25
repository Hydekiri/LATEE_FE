// FE/src/features/practice/takePractice/components/Submit.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildEvaluationPayload, submitEvaluation } from '@/src/services/submition-practice-session'; 
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { ClinicalReasoningChatMessageTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
import { API_BASE_URL } from '@/src/config/env';

interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicalCaseId: string;
    sessionId: string; 
}

export const SubmitModal = ({ isOpen, onClose, clinicalCaseId, sessionId }: SubmitModalProps) => {
    const router = useRouter();
    const [diagnosis, setDiagnosis] = useState('');
    const [checklist, setChecklist] = useState('EPA_STANDARD_V1');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        if (!diagnosis.trim()) {
            alert('Vui lòng nhập chẩn đoán cuối cùng của bạn.');
            return;
        }

        setIsSubmitting(true);
        try {
            const sessionResponse = await fetch(`${API_BASE_URL}/practice-session/api/practice-sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: sessionId,
                    learnerId: 'USR001', 
                    clinicalCaseId: clinicalCaseId,
                    status: 'Completed'
                }),
            });

            if (!sessionResponse.ok) {
                throw new Error('Không thể khởi tạo hoặc cập nhật phiên thực hành trong Database.');
            }

            const payload = await buildEvaluationPayload({
                userId: 'USR001', 
                sessionId: sessionId,           
                clinicalCaseId: clinicalCaseId,
                diagnosis: diagnosis,          
                duration: "30:25" 
            });

            const response = await submitEvaluation(payload);

            if (response && response.data) {
                await Promise.all([
                    VPChatMessageTable.clear(),
                    ClinicalReasoningChatMessageTable.clear(),
                    ValidationNoteTable.clear()
                ]);

                alert('Đã nộp bài thành công!');

                router.push(`/practice/${clinicalCaseId}?tab=results&resultId=${response.data.resultId}`);
                onClose();
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Có lỗi xảy ra. Hãy đảm bảo Session ID đã tồn tại hoặc kiểm tra Network tab.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-3xl p-8 w-[520px] shadow-2xl animate-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-[#0E2A46] text-center mb-8">Submit Practice</h2>
                
                <div className="mb-6">
                    <label className="block text-[#2A5DA8] text-sm font-bold uppercase mb-2">Final diagnosis</label>
                    <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Kết luận y khoa của bạn là gì?"
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A5DA8] resize-none"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-[#2A5DA8] text-sm font-bold uppercase mb-2">Evaluation Module</label>
                    <select
                        value={checklist}
                        onChange={(e) => setChecklist(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 bg-gray-50 outline-none focus:ring-2 focus:ring-[#2A5DA8]"
                    >
                        <option value="EPA_STANDARD_V1">EPA Standard Assessment</option>
                        <option value="Modul SMART3220">Modul SMART3220</option>
                    </select>
                </div>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting} 
                        className="flex-1 px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={isSubmitting} 
                        className="flex-[2] px-6 py-3 rounded-2xl bg-[#235697] text-white font-bold hover:bg-[#1a4175] transition flex justify-center items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submitting...
                            </>
                        ) : 'Confirm Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};