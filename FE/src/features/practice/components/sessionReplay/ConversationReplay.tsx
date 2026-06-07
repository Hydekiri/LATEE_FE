'use client';

import Image from 'next/image';
import type { VPMessage } from './types';

interface ConversationReplayProps {
    readonly messages: readonly VPMessage[];
    readonly patientAvatarUrl: string;
    readonly patientName?: string;
}

const GREETING_MESSAGE = 'Hello, doctor! How can I help you today?';

export function ConversationReplay({
    messages,
    patientAvatarUrl,
    patientName,
}: ConversationReplayProps) {
    if (messages.length === 0) {
        return (
            <p className="text-sm text-gray-400 py-4 text-center">
                No conversation recorded.
            </p>
        );
    }

    const firstIsLearner =
        messages[0].role === 'learner' ||
        messages[0].role === 'doctor' ||
        messages[0].role === 'user';

    const normalizedMessages: readonly VPMessage[] = firstIsLearner
        ? [{ role: 'patient', content: GREETING_MESSAGE }, ...messages]
        : messages;

    return (
        <div className="flex flex-col gap-4">
            {normalizedMessages.map((msg, idx) => {
                const isLearner =
                    msg.role === 'learner' ||
                    msg.role === 'doctor' ||
                    msg.role === 'user';

                return (
                    <div
                        key={idx}
                        className={`flex gap-3 ${isLearner ? 'justify-end' : 'justify-start'}`}
                    >
                        {!isLearner && (
                            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image
                                    src={patientAvatarUrl}
                                    width={36}
                                    height={36}
                                    alt={patientName ?? 'Patient'}
                                    className="object-cover h-full w-full"
                                    unoptimized={
                                        patientAvatarUrl.startsWith('http') ||
                                        patientAvatarUrl.startsWith('/images/')
                                    }
                                />
                            </div>
                        )}

                        <div
                            className={[
                                'max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                                isLearner
                                    ? 'bg-[#235697] text-white rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none',
                            ].join(' ')}
                        >
                            {msg.content}
                        </div>

                        {isLearner && (
                            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-[#235697]/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#235697]">You</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}