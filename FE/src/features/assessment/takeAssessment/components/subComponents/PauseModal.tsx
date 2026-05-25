import { PauseIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

export const PauseModalContent = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
    <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
            <PauseIcon className="h-8 w-8 text-[#235697]" />
        </div>
        <h3 className="text-2xl font-bold text-[#235697] mb-2">Pause Assessment?</h3>
        <p className="text-slate-500 mb-8">Your progress will be saved. You can return to finish this assessment later from your dashboard.</p>
        <div className="flex flex-col gap-3">
            <button 
                onClick={onConfirm}
                className="w-full py-3.5 bg-[#235697] text-white rounded-xl font-bold hover:bg-[#1BA7D9] transition-all"
            >
                Pause & Exit
            </button>
            <button 
                onClick={onCancel}
                className="w-full py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
                Keep Going
            </button>
        </div>
    </div>
);