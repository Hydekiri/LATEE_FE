'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
    ChartBarIcon,
    ClockIcon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    StarIcon,
} from '@heroicons/react/24/solid';
import { DiscoveryPatientItem } from '@/src/types/discovery';
import { resolvePatientAvatar, getAvatarByAge } from '@/src/utils/patient-assets';

interface DiscoveryPatientCardProps {
    readonly item: DiscoveryPatientItem;
}

export default function DiscoveryPatientCard({ item }: DiscoveryPatientCardProps) {
    const router = useRouter();
    const [imgError, setImgError] = useState<boolean>(false);

    const displayImage = useMemo<string>(() => {
        if (imgError) return getAvatarByAge(item.patientId, item.age, item.gender);
        return resolvePatientAvatar(
            item.avatarImage ?? '',
            item.patientId,
            item.age,
            item.gender
        );
    }, [item.patientId, item.age, item.gender, item.avatarImage, imgError]);

    const introductionText = useMemo<string>(() => {
        const age = item.age || 'N/A';
        const gender = item.gender.toLowerCase();
        const occupation =
            item.occupation && item.occupation !== 'N/A'
                ? item.occupation.toLowerCase()
                : 'patient';
        return `A ${age}-year-old ${gender} ${occupation} presents for evaluation of a recent health concern.`;
    }, [item.age, item.gender, item.occupation]);

    const attemptsLeft =
        item.attemptSummary
            ? item.attemptSummary.maxAttempts - item.attemptSummary.attemptCount
            : null;

    const isMaxAttempts = attemptsLeft === 0;
    const timeLabel = `${item.timeSetting} min`;
    const dateLabel = new Date(item.createdAt).toLocaleDateString();

    return (
        <div className="group relative w-full h-100 sm:h-110 xl:h-120 bg-white rounded-[10px]
                    overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300
                    border border-gray-100 hover:border-[#235697]/30 hover:-translate-y-1">

            {/* Image Layer */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gray-50 overflow-hidden">
                <Image
                    src={displayImage}
                    alt={item.patientId}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover object-[0%_30%] transition-transform
                        duration-700 ease-out group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                {/* Attempt badge */}
                {item.attemptSummary?.attempted && item.attemptSummary.bestScore !== null && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90
                            px-2.5 py-1 rounded-full text-xs font-bold text-[#235697]
                            shadow-sm backdrop-blur-sm">
                        <StarIcon className="w-3 h-3 text-amber-400" />
                        {item.attemptSummary.bestScore.toFixed(0)}%
                    </div>
                )}
            </div>

            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-[10px]
                        px-5 py-5 xl:px-6 xl:py-6 flex flex-col justify-between
                        shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col gap-2 xl:gap-3">

                    {/* ID & Badges */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#235697] font-lato-bold text-[18px] xl:text-[20px]">
                            {item.patientId}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] xl:text-[13px] font-lato-r
                            text-gray-600 bg-gray-50 px-2 py-1 xl:px-3 xl:py-1.5
                            rounded-full border border-gray-100">
                            <div className="flex items-center gap-1">
                                <ChartBarIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#235697]" />
                                <span>{item.level}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300" />
                            <div className="flex items-center gap-1">
                                <ClockIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-[#235697]" />
                                <span>{timeLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-[12px] xl:text-[13px] text-gray-500
                            border-b border-dashed border-gray-200 pb-2 xl:pb-3 font-lato-r">
                        <div className="flex items-center gap-1.5">
                            <CalendarDaysIcon className="w-4 h-4 text-[#235697]/70" />
                            <span>{dateLabel}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-[#235697]/70" />
                            <span>Feedback ({item.feedbackCount})</span>
                        </div>
                        {attemptsLeft !== null && (
                            <span
                                className={`ml-auto text-[11px] font-semibold ${isMaxAttempts ? 'text-red-500' : 'text-emerald-600'
                                    }`}
                            >
                                {isMaxAttempts ? 'Max attempts' : `${attemptsLeft} left`}
                            </span>
                        )}
                    </div>

                    <div>
                        <p className="text-[#0E2A46] font-lato-r text-[13px] xl:text-sm
                            leading-relaxed line-clamp-2 italic">
                            &quot;{introductionText}&quot;
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm">
                    <p className="text-[#235697] font-lato-bold text-sm xl:text-base mb-px">
                        Chief concern
                    </p>
                    <div className="flex justify-between items-center gap-3">
                        <p
                            className="text-[#0E2A46] font-lato-r text-[13px] xl:text-sm
                            line-clamp-2 truncate flex-1"
                            title={item.chiefConcern}
                        >
                            {item.chiefConcern}
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push(`/practice/${item.patientId}?tab=about`)}
                            // LUÔN CHO VIEW: Gỡ bỏ disabled và cơ chế cursor-not-allowed
                            className={`group/btn shrink-0 text-sm font-lato-bold pl-4 pr-3 py-2 xl:pl-5 xl:pr-4 xl:py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-300 ${
                                isMaxAttempts 
                                    ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-600 hover:text-white' 
                                    : 'bg-[#00B7FF]/20 text-[#235697] hover:bg-[#235697] hover:text-white'
                            }`}
                        >
                            {isMaxAttempts ? 'View Details' : 'Join Practice'}
                            <ArrowRightIcon
                                className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}