'use client';

import Image from 'next/image';
import { Clock, Folder, Sparkles } from 'lucide-react';
import { ConfirmModal } from '@/src/features/practice/takePractice/components/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

interface PatientSidebarProps {
    id: string;
    sessionId: string;
    timerFormatted: string; 
    elapsed: number;       
    maxTime: number;        
    avatarUrl?: string; // Thêm prop nhận đường dẫn ảnh động từ trang cha
}

export const PatientSidebar = ({ 
    id, 
    sessionId, 
    timerFormatted, 
    elapsed, 
    maxTime,
    avatarUrl 
}: PatientSidebarProps) => {
    const router = useRouter();
    const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
    
    const remainingSeconds = useMemo(() => {
        return Math.max(0, maxTime - elapsed);
    }, [maxTime, elapsed]);

    const countdownDisplay = useMemo(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [remainingSeconds]);

    const progressPercent = useMemo(() => {
        return Math.max(0, (remainingSeconds / maxTime) * 100);
    }, [remainingSeconds, maxTime]);

    const onEndConversationConfirm = () => {
        setIsShowConfirmModal(false);
        router.push(`/practice/${id}/reasoning?sessionId=${sessionId}`);
    };

    // Xác định ảnh hiển thị: Ưu tiên ảnh động từ prop, nếu không có mới dùng ảnh fallback
    const displayAvatar = avatarUrl || '/images/VirtualPatient/VP5.jpeg';

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
            <div className="p-6 overflow-y-auto flex-1">
                {/* Avatar Section */}
                <div className="mb-4">
                    <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm relative">
                        <Image
                            src={displayAvatar} // CẬP NHẬT TẠI ĐÂY: Thay đường dẫn cứng bằng biến động
                            fill
                            alt="Patient Avatar"
                            className="object-cover"
                            priority
                            unoptimized={displayAvatar.startsWith('http') || displayAvatar.startsWith('/images/')}
                        />
                    </div>
                </div>

                {/* Status Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 text-center">Conversation</h2>
                    <div className="flex items-center justify-center gap-1 text-[#235697] text-sm font-medium mt-1 cursor-pointer hover:underline">
                        <Sparkles className="w-4 h-4" /> Message Type
                    </div>
                </div>

                <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 mb-6">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>Time Remaining</span>
                        <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-2xl font-bold text-[#235697] mb-2 font-mono tabular-nums">
                        {countdownDisplay}
                    </div>
                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#235697] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">
                        {Math.round(progressPercent)}%
                    </div>
                </div>

                {/* Intervention Section */}
                <div>
                    <h3 className="text-[#235697] font-bold text-base mb-3">More Information</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2 text-[#235697] font-semibold text-sm cursor-pointer mb-2 group">
                                <Folder className="w-4 h-4 group-hover:fill-[#235697]/10" />
                                <span className="group-hover:underline">Order Interventions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Section */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={() => setIsShowConfirmModal(true)}
                    className="w-full bg-[#235697] text-white font-semibold py-3 rounded-lg hover:bg-[#1d4880] active:scale-[0.98] transition-all shadow-md"
                >
                    End Conversation
                </button>
            </div>

            <ConfirmModal
                isOpen={isShowConfirmModal}
                onClose={() => setIsShowConfirmModal(false)}
                onConfirm={onEndConversationConfirm}
                requireDiagnosis={false}
            />
        </aside>
    );
};