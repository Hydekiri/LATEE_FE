'use client';

import Image from 'next/image';
import type { ReasoningStep } from './types';

interface ReasoningReplayProps {
    readonly steps: readonly ReasoningStep[];
}

export function ReasoningReplay({ steps }: ReasoningReplayProps) {
    if (steps.length === 0) {
        return (
            <p className="text-sm text-gray-400 py-4 text-center">
                No reasoning recorded.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {steps.map((step) => {
                const isAI = step.step % 2 === 1; 

                return (
                    <div
                        key={step.step}
                        className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
                    >
                        {isAI && (
                            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                <Image
                                    src="/images/AI Result.png"
                                    width={36}
                                    height={36}
                                    alt="AI Reasoning"
                                    className="object-cover h-full w-full"
                                />
                            </div>
                        )}

                        <div
                            className={[
                                'max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                                isAI
                                    ? 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                                    : 'bg-[#D1EFF9] text-gray-800 rounded-tr-none',
                            ].join(' ')}
                        >
                            {isAI && (
                                <span className="text-xs font-bold text-[#1BA7D9] block mb-1 uppercase">
                                    AI · Step {Math.ceil(step.step / 2)}
                                </span>
                            )}
                            {step.content}
                        </div>

                        {!isAI && (
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