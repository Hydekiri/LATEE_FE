// import { VPChatMessageTable } from '@/src/hooks/dexieConfigurations/VPChatMessages.table';
// import { ClinicalReasoningChatMessageTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
// import { ClinicalReasoningDimensionTable } from '@/src/hooks/dexieConfigurations/ClinicalReasoningChatMessages.table';
// import { ValidationNoteTable } from '@/src/hooks/dexieConfigurations/ValidationNotes.table';
// import { PracticeSessionResultDTO } from '../types/submition';
// import { API_BASE_URL } from '../config/env';

// function generateId(prefix: string) {
//     return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// export async function buildEvaluationPayload(params: {
//     userId: string;
//     clinicalCaseId: string;
//     finalDiagnosis: string;
//     overallScore: number;
// }): Promise<PracticeSessionResultDTO> {

//     const [
//         vpMessages,
//         reasoningMessages,
//         dimensions,
//         warnings
//     ] = await Promise.all([
//         VPChatMessageTable.getAll(),
//         ClinicalReasoningChatMessageTable.getAll(),
//         ClinicalReasoningDimensionTable.getAll(),
//         ValidationNoteTable.getAll()
//     ]);

//     return {
//         resultId: generateId('eval'),
//         userId: params.userId,
//         clinicalCaseId: params.clinicalCaseId,
//         moduleId: 'EPA_STANDARD_V1',

//         vpConversationLog: vpMessages.map(m => ({
//             role: m.role,
//             content: m.content
//         })),

//         aiReasoningLog: reasoningMessages.map(m => ({
//             role: m.role,
//             content: m.content
//         })),

//         finalDiagnosis: params.finalDiagnosis,
//         overallScore: params.overallScore,

//         warnings: warnings.map(w => ({
//             warningId: `warn_${w.id}`,
//             label: w.category,
//             description: w.reason
//         })),
//     };
// }

// export async function submitEvaluation(payload: PracticeSessionResultDTO) {
//     const res = await fetch(`${API_BASE_URL}/practice-session/api/practice-sessions/submit`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//         throw new Error('Submit evaluation failed');
//     }

//     return res.json();
// }