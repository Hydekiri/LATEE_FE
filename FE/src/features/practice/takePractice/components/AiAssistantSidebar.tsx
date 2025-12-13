import { useState } from 'react';
import { Sparkles, Send, AlertTriangle } from 'lucide-react';

export const AiAssistantSidebar = () => {
    const [aiInput, setAiInput] = useState('');

    return (
        <aside className="w-80 bg-[#D1EFF9]/30 border-l border-blue-100 flex flex-col h-full shrink-0 relative transition-all duration-300">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1">
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Welcome to the Latee tutorial! I am Dr. MoX, and I will be your guide through this introductory case.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-50 flex-1">
                        <div className="inline-block bg-[#FF8A8A] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2">
                            <AlertTriangle className="w-3 h-3 inline mr-1" /> Note #1652
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Incorrect response. Instead of ending the conversation, you should continue gathering more information...
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-blue-100 bg-[#D1EFF9]/50">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="Ask Dr. MoX..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#235697]"
                    />
                    <button className="bg-[#235697] text-white p-2 rounded-lg hover:bg-[#1d4880] transition">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};