'use client';

import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { buildEvaluationPayload, submitEvaluation } from '@/src/services/submition-practice-session';
import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
import { ClinicalReasoningChatMessageTable, ClinicalReasoningDimensionTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
interface SubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    clinicalCaseId: string
}

export const SubmitModal = ({ isOpen, onClose, clinicalCaseId }: SubmitModalProps,) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [checklist, setChecklist] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        console.log('Diagnosis:', diagnosis);
        console.log('Checklist:', checklist);

        buildEvaluationPayload({
            userId: 'user_123', // bạn có thể lấy từ auth context
            clinicalCaseId,
            finalDiagnosis: diagnosis,
            overallScore: 0
        }).then(async payload => {
            try {
                const response = await submitEvaluation(payload);
                alert('Practice session submitted successfully!');

                // Clear local data after successful submission
                // WILL KEEP DATA FOR DEBUGGING PURPOSES NOW
                // await Promise.all([
                //     VPChatMessageTable.clear(),
                //     ClinicalReasoningChatMessageTable.clear(),
                //     ClinicalReasoningDimensionTable.clear(),
                //     ValidationNoteTable.clear()
                // ]);

                /// Call evaluation here
                ////////////////////////
                ///////////////////////

            } catch (error) {
                console.error('Submission failed:', error);
                alert('Failed to submit practice session. Please try again.');
            }
        });

        setOpenConfirm(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-8 w-[520px] shadow-2xl">

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-[#0E2A46] text-center mb-8">
                        Submit
                    </h2>

                    {/* Final Diagnosis */}
                    <div className="mb-6">
                        <label className="block text-[#2A5DA8] text-lg mb-2">
                            Final diagnosis
                        </label>

                        <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="Enter diagnosis"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A5DA8]"
                        />
                    </div>

                    {/* Evaluation Checklist */}
                    <div className="mb-8">
                        <label className="block text-[#2A5DA8] text-lg mb-2">
                            Evaluation Checklist
                        </label>

                        <select
                            value={checklist}
                            onChange={(e) => setChecklist(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2A5DA8]"
                        >
                            <option value="">Select checklist</option>
                            <option value="Modul SMART3220">Modul SMART3220</option>
                            <option value="Checklist A">Checklist A</option>
                            <option value="Checklist B">Checklist B</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 rounded-2xl bg-gray-300 text-gray-700 font-bold text-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => console.log('Report clicked')}
                            className="px-8 py-3 rounded-2xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition"
                        >
                            Report
                        </button>

                        <button
                            onClick={() => handleConfirm()}
                            className="px-8 py-3 rounded-2xl bg-[#235697] text-white font-bold text-lg hover:bg-[#1a4175] transition"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};