import { useState } from 'react';
import Image from 'next/image';
import { Send, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAreaProps {
    history: ChatMessage[];
}

export const ChatArea = ({ history }: ChatAreaProps) => {
    const [inputMessage, setInputMessage] = useState('');

    return (
        <main className="flex-1 flex flex-col bg-white relative transition-all duration-300">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {history.map((chat) => (
            <div key={chat.id} className={`flex gap-4 ${chat.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                {/* Patient Avatar */}
                {chat.role === 'patient' && (
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                        <Image src={chat.avatar} width={40} height={40} alt="Patient" className="object-cover h-full w-full" />
                    </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${chat.role === 'doctor' 
                        ? 'bg-[#D1EFF9] text-gray-800 rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
                    }
                `}>
                    {chat.message}
                </div>

                {/* Doctor Avatar */}
                {chat.role === 'doctor' && (
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                        <Image src={chat.avatar} width={40} height={40} alt="Doctor" className="object-cover h-full w-full" />
                    </div>
                )}
            </div>
            ))}
            
            {/* Example Note Warning - Can be extracted to a separate component */}
            <div className="flex justify-end items-center gap-4 my-4">
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-red-100">
                    <AlertTriangle className="w-4 h-4" /> Note #1652
                </div>
                <div className="bg-[#D1EFF9] text-gray-800 rounded-2xl rounded-tr-none px-5 py-3 text-sm font-medium leading-relaxed shadow-sm cursor-pointer hover:bg-[#bde6f5] transition">
                    Oh, Go out now
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <Image src="/VirtualPatient/VP3.jpeg" width={40} height={40} alt="Doc" className="object-cover h-full w-full" />
                </div>
            </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
            <div className="relative">
                <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="The advantages of Artificial Intelligence"
                    className="w-full pl-5 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#235697] focus:ring-1 focus:ring-[#235697] text-sm text-gray-700 placeholder-gray-400"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#235697] p-2 hover:bg-gray-100 rounded-lg">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
        </main>
    );
};