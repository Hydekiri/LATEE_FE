import Image from 'next/image';
import { Clock, Folder, Sparkles } from 'lucide-react';

export const PatientSidebar = () => {
    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-4">
            <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm relative">
                <Image src="/LVP1.jpeg" fill alt="Abigail Park" className="object-cover" />
            </div>
            </div>

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
            <div className="text-2xl font-bold text-[#235697] mb-2 font-mono">29:48</div>
            <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-[90%] bg-[#235697]"></div>
            </div>
            <div className="text-right text-[10px] text-gray-400 mt-1">90%</div>
            </div>

            <div>
            <h3 className="text-[#235697] font-bold text-base mb-3">More Information</h3>
            {/* ... Order Interventions section ... */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 text-[#235697] font-semibold text-sm cursor-pointer mb-2">
                        <Folder className="w-4 h-4" /> Order Interventions
                    </div>
                    {/* ... intervention items ... */}
                </div>
            </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-100">
            <button className="w-full bg-[#235697] text-white font-semibold py-3 rounded-lg hover:bg-[#1d4880] transition">
            End Conversation
            </button>
        </div>
        </aside>
    );
};