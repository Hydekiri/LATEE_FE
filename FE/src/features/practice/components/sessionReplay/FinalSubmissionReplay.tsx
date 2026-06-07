'use client';

import { CheckCircle, Clock, FileText, Activity } from 'lucide-react';
import type { PracticeSessionDetail } from './types';

interface FinalSubmissionReplayProps {
    readonly session: PracticeSessionDetail;
}

function formatDuration(startTime: string | null, endTime: string | null): string {
    if (!startTime || !endTime) return 'N/A';
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
}

function formatDatetime(iso: string | null): string {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString();
}

export function FinalSubmissionReplay({ session }: FinalSubmissionReplayProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Status pill */}
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#235697]" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                </span>
                <span
                    className={[
                        'ml-auto px-3 py-1 rounded-full text-xs font-bold',
                        session.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700',
                    ].join(' ')}
                >
                    {session.status}
                </span>
            </div>

            {/* Final Diagnosis */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-[#235697]/5 border border-[#235697]/20">
                <FileText className="w-4 h-4 text-[#235697] shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Final Diagnosis
                    </p>
                    <p className="text-sm font-bold text-[#235697]">
                        {session.finalDiagnosis ?? '—'}
                    </p>
                </div>
            </div>

            {/* Time info */}
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400 w-20 shrink-0">Start</span>
                    <span className="font-medium">{formatDatetime(session.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400 w-20 shrink-0">End</span>
                    <span className="font-medium">{formatDatetime(session.endTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400 w-20 shrink-0">Duration</span>
                    <span className="font-medium">
                        {formatDuration(session.startTime, session.endTime)}
                    </span>
                </div>
            </div>
        </div>
    );
}