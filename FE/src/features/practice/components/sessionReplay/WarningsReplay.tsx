'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import type { SessionWarning } from './types';

interface WarningsReplayProps {
    readonly warnings: readonly SessionWarning[];
}

export function WarningsReplay({ warnings }: WarningsReplayProps) {
    const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());

    if (warnings.length === 0) {
        return (
            <p className="text-sm text-gray-400 py-4 text-center">
                No warnings for this session.
            </p>
        );
    }

    const toggle = (id: string) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next as ReadonlySet<string>;
        });
    };

    return (
        <div className="divide-y divide-red-100/50 border-[#972323] border-[1.5px] rounded-lg overflow-hidden">
            {warnings.map((w) => {
                const isOpen = openIds.has(w.warningId);
                return (
                    <div key={w.warningId} className="bg-[#FFF1F1]">
                        <button
                            type="button"
                            onClick={() => toggle(w.warningId)}
                            className="w-full px-4 py-3 flex items-start justify-between gap-3
                                        hover:bg-red-100/30 cursor-pointer transition-colors text-left"
                            aria-expanded={isOpen}
                        >
                            <div className="flex gap-2 items-start">
                                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <span className="font-bold text-red-600 text-xs">
                                    {w.label}
                                </span>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-red-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {isOpen && (
                            <div className="px-4 pb-3 text-xs text-gray-700 leading-relaxed">
                                {w.description}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}