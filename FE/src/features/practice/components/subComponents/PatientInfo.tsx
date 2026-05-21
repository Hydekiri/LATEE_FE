"use client";

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PatientData } from '@/src/types/practice';
import { useMemo, useState, useEffect } from 'react';
import { getAvatarByAge, resolvePatientAvatar } from "@/src/utils/patient-assets";
import { getLearnerId } from '@/src/utils/cookies';
import { API_BASE_URL } from '@/src/config/env';
import { getCookie } from '@/src/utils/cookies';
import { practiceSessionService } from '@/src/services/practice-session-service';

const MAX_ATTEMPTS = 3;

interface AttemptCountResponse {
    learnerId: string;
    patientId: string;
    attemptCount: number;
    maxAttempts: number;
    canAttempt: boolean;
}

export const PatientInfo = ({ data }: { data: PatientData }) => {
    const router = useRouter();
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState<boolean>(false);
    const [startError, setStartError] = useState<string | null>(null);
    const [attemptsUsed, setAttemptsUsed] = useState<number>(data.timesPracticed ?? 0);
    const [attemptsMax, setAttemptsMax] = useState<number>(MAX_ATTEMPTS);
    const [attemptsLoading, setAttemptsLoading] = useState<boolean>(true);

    const displayImage = useMemo(() => {
        if (imgSrc) return imgSrc;
        return resolvePatientAvatar(data.img, data.id, data.age, data.gender);
    }, [data.id, data.age, data.gender, data.img, imgSrc]);

    const introductionText = useMemo(() => {
        const age = data.age || "N/A";
        const gender = (data.gender || "patient").toLowerCase();
        const occupation = (data.occupation && data.occupation !== "N/A") 
            ? data.occupation.toLowerCase() 
            : "patient";
        const setting = data.setting?.toLowerCase() || "clinic";

        return `A ${age}-year-old ${gender} ${occupation} comes to the ${setting} for evaluation of a recent health concern.`;
    }, [data.age, data.gender, data.occupation, data.setting]);

    useEffect(() => {
        const fetchAttemptCount = async () => {
            setAttemptsLoading(true);
            try {
                const learnerId = getLearnerId() || 'USR001';
                const accessToken = getCookie('accessToken');
                const res = await fetch(
                    `${API_BASE_URL}/practice-session/api/practice-sessions/attempt-count?learnerId=${learnerId}&patientId=${data.id}`,
                    {
                        headers: accessToken
                            ? { Authorization: `Bearer ${accessToken}` }
                            : {},
                    }
                );
                if (res.ok) {
                    const json = (await res.json()) as AttemptCountResponse;
                    setAttemptsUsed(json.attemptCount);
                    setAttemptsMax(json.maxAttempts);
                }
            } catch (e) {
                console.error('[PatientInfo] Failed to fetch attempt count:', e);
                setAttemptsUsed(data.timesPracticed ?? 0);
            } finally {
                setAttemptsLoading(false);
            }
        };
        void fetchAttemptCount();
    }, [data.id, data.timesPracticed]);

    const attemptsRemaining = attemptsMax - attemptsUsed;
    const canAttempt = attemptsRemaining > 0;

    const handleStartPractice = async () => {
        if (!canAttempt || isStarting) return;
        setIsStarting(true);
        setStartError(null);

        try {
            const learnerId = getLearnerId();
            const response = await practiceSessionService.create({
                id: `SESS_${data.id}_${Date.now()}`,
                learnerId: learnerId,
                patientId: data.id,
                moduleId: 'EPA_STANDARD_V1',
                discussionType: 'Message Type',
                guidelinesId: 'GL01',
                status: 'Practicing',
            });

            if (response && response.id) {
                router.push(`/practice/${data.id}/take?sessionId=${response.id}`);
            }

        } catch (error) {
            console.error("Error creating practice session:", error);
            setStartError('Failed to initialize session. Please try again.');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-[#235697]">PatientID: {data.id}</h2>
                <h2 className="text-3xl font-bold text-[#1BA7D9]">Case: #{data.caseId}</h2>
            </div>

            <div className="flex items-center gap-8 mb-12">
                <div className="w-32 h-32 rounded-full overflow-hidden relative shrink-0">
                    <Image 
                        src={displayImage} 
                        alt={data.id} 
                        fill 
                        sizes="128px"
                        className="object-cover object-top" 
                        onError={() => setImgSrc(getAvatarByAge(data.id, data.age, data.gender))}
                    />
                </div>

                <div className="flex-1">
                    <div className="mb-2">
                        <span className="text-[#235697] font-bold text-xl block">Level {data.level}</span>
                    </div>
                    
                    <p className="text-gray-700 font-medium text-base mb-3 leading-relaxed italic">
                        &quot;{introductionText}&quot;
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-[#1BA7D9] text-sm font-bold bg-[#1BA7D9]/10 px-3 py-1 rounded-full">
                                {attemptsLoading
                                    ? 'Times practiced: Loading...'
                                    : `Times practiced: ${attemptsUsed} / ${attemptsMax}`}
                            </span>
                        </div>
                        
                        {startError && (
                            <p className="text-red-500 text-xs font-medium px-1 mt-0.5">{startError}</p>
                        )}
                    </div>
                </div>
                
                <div>
                    <button
                        onClick={() => void handleStartPractice()}
                        disabled={!canAttempt || isStarting || attemptsLoading}
                        className="flex items-center gap-2 bg-[#235697] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1BA7D9] transition-all shadow-lg hover:shadow-[#1BA7D9]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#235697] disabled:shadow-none"
                    >
                        {isStarting ? 'Starting...' : 'Start Practice'} <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
};