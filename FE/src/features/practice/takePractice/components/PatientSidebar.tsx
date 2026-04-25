'use client';

import Image from 'next/image';
import { Clock, Folder, Sparkles } from 'lucide-react';
import { ConfirmModal } from "@/src/features/practice/takePractice/components/ConfirmModal";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Cập nhật Interface để nhận sessionId
interface PatientSidebarProps {
    id: string;
    sessionId: string;
}

export const PatientSidebar = ({ id, sessionId }: PatientSidebarProps) => {
    const router = useRouter();
    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

    const onEndConversationClick = () => {
        router.push(`/practice/${id}/reasoning?sessionId=${sessionId}`);
    }

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
            <div className="p-6 overflow-y-auto flex-1">
                {/* Avatar Section */}
                <div className="mb-4">
                    <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm relative">
                        <Image 
                            src="/images/LVP1.jpeg" 
                            fill 
                            alt="Patient Avatar" 
                            className="object-cover" 
                            priority 
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

                {/* Time Remaining Card */}
                <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-3 mb-6">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>Time Remaining</span>
                        <Clock className="w-3 h-3" />
                    </div>
                    <div className="text-2xl font-bold text-[#235697] mb-2 font-mono">29:48</div>
                    <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="absolute left-0 top-0 h-full bg-[#235697] transition-all duration-500" 
                            style={{ width: '90%' }}
                        ></div>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">90%</div>
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
                            {/* Child Items */}
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

            {/* Modals */}
            <ConfirmModal
                isOpen={isShowConfirmModal}
                onClose={() => setIsShowConfirmModal(false)}
                onConfirm={onEndConversationClick}
            />

        </aside>
    );
};