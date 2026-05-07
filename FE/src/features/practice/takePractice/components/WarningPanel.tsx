'use client';
import { useState } from 'react';
import { AlertTriangle, MessageSquare, ChevronDown } from 'lucide-react';
import { NoteChatState } from "@/src/features/practice/takePractice/types/note";
import { NoteChatContainer } from "@/src/features/practice/takePractice/components/subComponents/NoteChatContainer";

export const WarningPanel = ({
    isPanelExpanded,
    setIsPanelExpanded,
    noteID,
    setNoteID,
    notesState,
    setNotesState,
}: {
    isPanelExpanded: boolean;
    setIsPanelExpanded: (v: boolean) => void;
    noteID: string;
    setNoteID: React.Dispatch<React.SetStateAction<string>>;
    notesState: Record<string, NoteChatState>;
    setNotesState: React.Dispatch<React.SetStateAction<Record<string, NoteChatState>>>;
}) => {
    // const [noteID, setNoteID] = useState<number>(0);
    // const [notesState, setNotesState] = useState<Record<number, NoteChatState>>({
    // });
    const [inputValues, setInputValues] = useState<Record<string, string>>({});

    const toggleNote = (id: string) => {
        setNotesState(prev => ({ ...prev, [id]: { ...prev[id], isOpen: !prev[id].isOpen } }));
    };

    const toggleChat = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        setNotesState(prev => {
            const newState = { ...prev };
            const isCurrentlyShowing = prev[id].showChat;

            Object.keys(newState).forEach((key) => {
                newState[key] = {
                    ...newState[key],
                    showChat: false
                };
            });


            newState[id] = {
                ...newState[id],
                showChat: !isCurrentlyShowing,
                isOpen: true
            };

            return newState;
        });
    };

    const handleSendChat = (id: string) => {
        const text = inputValues[id];
        if (!text?.trim()) return;

        setNotesState(prev => ({
            ...prev,
            [id]: {
                ...prev[id], messages: [...prev[id].messages, { role: 'user', content: text }],
                questionValidationResponse: {
                    reason: "The response lacks clinical reasoning based on the chief concern.",
                    suggestion: "Please provide a more detailed explanation that connects the analysis to the chief concern.",
                    severity: "High",
                    category: "Clinical Reasoning",
                    confidence: null
                }
            }
        }));

        setInputValues(prev => ({ ...prev, [id]: '' }));

        setTimeout(() => {
            setNotesState(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    messages: [...prev[id].messages, {
                        role: 'assistant',
                        content: `Regarding Note #${id}: Analysis complete. This response was flagged because it lacked clinical reasoning based on the chief concern.`
                    }],
                    questionValidationResponse: {
                        reason: "The response lacks clinical reasoning based on the chief concern.",
                        suggestion: "Please provide a more detailed explanation that connects the analysis to the chief concern.",
                        severity: "High",
                        category: "Clinical Reasoning",
                        confidence: null
                    }
                }
            }));
        }, 500);
    };

    return (
        <div className="px-6 mb-[-1.5px] animate-fadeIn">
            <div className="overflow-hidden transition-all duration-300">
                {/* Header Section */}
                <div className="grid grid-cols-12 items-center bg-none overflow-hidden border-b border-red-100">
                    <div
                        className={`${isPanelExpanded ? 'col-span-2 px-5' : 'w-fit px-3'} rounded-t-lg flex items-center justify-center gap-2 py-2.5 bg-[#EF4444] text-white cursor-pointer transition-all border-r border-[#E90000]`}
                        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                    >
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {isPanelExpanded && <span className="text-xs font-bold whitespace-nowrap">Warning Panel</span>}
                        {isPanelExpanded && <ChevronDown className={`w-3 h-3 transition-transform ${isPanelExpanded ? 'rotate-180' : ''}`} />}
                    </div>

                    <div className="col-start-4 col-span-9 pr-6 flex justify-end items-center gap-1.5 text-red-600 font-bold text-[11px] uppercase transition-all">
                        <span className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">!</span>
                        {Object.keys(notesState).length} warning notes
                    </div>
                </div>

                {/* Body Section */}
                <div className={`transition-all duration-500 overflow-hidden border-x border-[#972323] border-[1.5px] ${isPanelExpanded ? 'max-h-[600px] overflow-y-auto' : 'max-h-0 border-t-0'}`}>
                    <div className="divide-y divide-red-100/50">
                        {Object.values(notesState).map((note) => (
                            <div key={note.noteId} className="transition-all bg-[#FFF1F1]">
                                <div
                                    className={`px-6 py-2 flex items-start justify-between mb-1 hover:bg-red-100/30 cursor-pointer transition-colors ${note.showChat ? 'bg-[#a3d3ff] text-[#235697]' : 'bg-[#FFF1F1]'}`}
                                    onClick={() => toggleNote(note.noteId.toString())}
                                >
                                    <div className="flex gap-3">
                                        <span className={`font-bold text-red-600 text-xs shrink-0`}>! Note #{note.noteId}:</span>
                                        <span className="text-gray-700 text-xs leading-relaxed">
                                            {note.isOpen ? (note.questionValidationResponse ? `Reason: ${note.questionValidationResponse.reason} ;Sugesstion: ${note.questionValidationResponse.suggestion}` : "No reason provided") : "Incorrect response. Click to see more..." + (note.questionValidationResponse ? `Category: ${note.questionValidationResponse.category}` : "No category provided.")}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => toggleChat(e, note.noteId.toString())}
                                        className={`p-1.5 rounded-lg transition-all ${note.showChat ? 'bg-[#235697] text-white' : 'text-[#235697] hover:bg-red-200'}`}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>

                                {note.showChat && (
                                    <div className="bg-[#FFF1F1] pb-1">
                                        <NoteChatContainer
                                            note={note}
                                            inputValue={inputValues[note.noteId]}
                                            onInputChange={(val) => setInputValues(p => ({ ...p, [note.noteId]: val }))}
                                            onSendMessage={handleSendChat}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};