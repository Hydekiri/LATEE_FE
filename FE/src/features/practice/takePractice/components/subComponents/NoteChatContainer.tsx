'use client';
import { useEffect, useRef } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { NoteChatState } from '@/src/features/practice/takePractice/types/note';

interface NoteChatContainerProps {
    note: NoteChatState;
    inputValue: string;
    onInputChange: (value: string) => void;
    onSendMessage: (id: string) => void;
}

export const NoteChatContainer = ({ note, inputValue, onInputChange, onSendMessage }: NoteChatContainerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [note.messages]);

    return (
        <div className="animate-in slide-in-from-top-1 bg-[#f1f7ff] duration-300 py-2 mb-1">
            <div className="mx-8 bg-[#f1f7ff] rounded-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                {/* Chat History */}
                <div 
                    ref={scrollRef}
                    className="p-4 max-h-48 overflow-y-auto space-y-4 bg-linear-to-b from-[#FFF1F1]/30 to-white scroll-smooth"
                >
                    {note.messages.length === 0 && (
                        <div className="flex gap-3 items-center text-gray-400 italic text-[11px]">
                            <Sparkles className="w-4 h-4 opacity-50 text-[#235697]" />
                            <span>Assistant is ready to discuss Note #{note.noteId}.</span>
                        </div>
                    )}
                    {note.messages.map((m, idx) => (
                        <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role === 'assistant' && (
                                <div className="shrink-0 w-8 h-8 bg-[#235697] rounded-full flex items-center justify-center text-white shadow-md mt-1">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                            )}
                            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                                m.role === 'user' 
                                ? 'bg-[#D1EFF9] text-gray-800 rounded-br-none border border-blue-100' 
                                : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 bg-white flex gap-2 items-center border-t border-gray-50 ">
                    <input 
                        type="text" 
                        placeholder="Discuss this note..."
                        value={inputValue || ''}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSendMessage(note.noteId.toString())}
                        className="flex-1 text-[11px] px-4 py-2 shadow-md border border-[#b9d7ff] rounded-lg outline-none focus:bg-white focus:border-[#235697] transition-all"
                    />
                    <button 
                        onClick={() => onSendMessage(note.noteId.toString())} 
                        className="p-2 bg-[#235697] text-white rounded-full hover:bg-[#1d4880] shadow-md shadow-black/20 active:scale-90 transition-all"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};