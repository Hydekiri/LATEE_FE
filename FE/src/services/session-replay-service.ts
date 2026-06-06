import { clientApi } from '@/src/utils/api-client';
import type {
    AttemptListItem,
    PracticeSessionDetail,
    VPConversationLog,
    AIReasoningLog,
    SessionWarning,
} from '@/src/features/practice/components/sessionReplay/types';
import type { PracticeStatus } from '@/src/types/practice';

interface ByPatientItem {
    readonly sessionId: string;
    readonly status: string;
    readonly startTime: string | null;
    readonly endTime: string | null;
    readonly createdAt: string;
    readonly finalDiagnosis: string | null;
}

interface ByPatientResponse {
    readonly learnerId: string;
    readonly patientId: string;
    readonly items: readonly ByPatientItem[];
}

interface RawSessionDetail {
    readonly sessionId: string;
    readonly learnerId: string;
    readonly patientId: string;
    readonly moduleId: string;
    readonly discussionType: string;
    readonly guidelinesId: string | null;
    readonly vpConversationLog: string | object | null;
    readonly aiReasoningLog: string | object | null;
    readonly finalDiagnosis: string | null;
    readonly status: string;
    readonly startTime: string | null;
    readonly endTime: string | null;
    readonly createdAt: string;
    readonly warnings: readonly unknown[] | null;
}

function safeParseJson<T>(value: string | object | null | undefined): T | null {
    if (value == null) return null;
    if (typeof value === 'object') return value as T;
    try {
        return JSON.parse(value) as T;
    } catch {
        console.warn('[SessionReplay] Failed to parse JSON:', value);
        return null;
    }
}

function normalizeWarnings(raw: readonly unknown[] | null | undefined): readonly SessionWarning[] {
    if (!raw || raw.length === 0) return [];

    return raw.map((w) => {
        const item = w as Record<string, unknown>;

        return {
            warningId: String(item.warningId ?? item.id ?? ''),
            label: String(item.label ?? item.type ?? item.category ?? item.warningId ?? 'Warning'),
            description: String(item.description ?? item.message ?? item.reason ?? ''),
        };
    });
}

export async function getAttemptList(
    learnerId: string,
    patientId: string
): Promise<readonly AttemptListItem[]> {
    const data = await clientApi.get<ByPatientResponse>(
        `/practice-session/api/practice-sessions/by-patient?learnerId=${encodeURIComponent(learnerId)}&patientId=${encodeURIComponent(patientId)}`
    );

    return [...(data.items ?? [])]
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((item, idx) => ({
            sessionId: item.sessionId,
            attemptNumber: idx + 1,
            createdAt: item.createdAt,
            status: item.status as PracticeStatus,
            finalDiagnosis: item.finalDiagnosis ?? null,
        }));
}

export async function getSessionDetail(
    sessionId: string
): Promise<PracticeSessionDetail> {
    const raw = await clientApi.get<RawSessionDetail>(
        `/practice-session/api/practice-sessions/${encodeURIComponent(sessionId)}`
    );

    const vpConversationLog = safeParseJson<VPConversationLog>(raw.vpConversationLog);

    const aiReasoningLog = safeParseJson<AIReasoningLog>(raw.aiReasoningLog);

    const warnings = normalizeWarnings(raw.warnings);

    console.log('[SessionReplay] vpConversationLog:', vpConversationLog);
    console.log('[SessionReplay] aiReasoningLog:', aiReasoningLog);
    console.log('[SessionReplay] warnings:', warnings);

    return {
        sessionId: raw.sessionId,
        learnerId: raw.learnerId,
        patientId: raw.patientId,
        moduleId: raw.moduleId,
        discussionType: raw.discussionType,
        guidelinesId: raw.guidelinesId,
        vpConversationLog,
        aiReasoningLog,
        finalDiagnosis: raw.finalDiagnosis,
        status: raw.status as PracticeStatus,
        startTime: raw.startTime,
        endTime: raw.endTime,
        createdAt: raw.createdAt,
        warnings,
    };
}