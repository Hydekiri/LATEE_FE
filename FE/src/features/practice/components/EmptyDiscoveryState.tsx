'use client';

import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';

interface EmptyDiscoveryStateProps {
    readonly onNewDiscovery: () => void;
}

export function EmptyDiscoveryState({ onNewDiscovery }: EmptyDiscoveryStateProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#235697]/10 flex items-center justify-center mb-6">
                <MagnifyingGlassCircleIcon className="w-10 h-10 text-[#235697]" />
            </div>

            <h3 className="text-2xl font-bold text-[#235697] mb-3">
                No discovered practice cases yet
            </h3>

            <p className="text-gray-500 text-base max-w-md leading-relaxed mb-8">
                Start your learning journey by discovering virtual patient cases tailored to your
                clinical goals. Set your preferences and explore cases that match your level.
            </p>

            <button
                onClick={onNewDiscovery}
                className="flex items-center gap-2 bg-[#235697] text-white px-8 py-3.5 rounded-xl
                    font-bold text-base hover:bg-[#1BA7D9] transition-all duration-200
                    shadow-lg hover:shadow-[#1BA7D9]/30 active:scale-95"
            >
                <span className="text-xl leading-none">+</span>
                New Discovery
            </button>
        </div>
    );
}