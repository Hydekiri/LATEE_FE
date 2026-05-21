'use client';

import { useState, useEffect } from 'react';
import {
    PlusIcon,
    MinusIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckIcon,
} from '@heroicons/react/24/solid';
import { PatientData } from '@/src/types/practice';
import { issueService, IssueItem, IssueStatus } from '@/src/services/issue-service';
import { getCookie } from '@/src/utils/cookies';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: 1,
        question: 'How is my final score calculated?',
        answer: 'Your final score is a weighted average of four key EPAs: Information Gathering, Diagnostic Reasoning, Testing, and Management Planning.',
    },
    {
        id: 2,
        question: 'Can I retake a specific clinical case?',
        answer: 'Yes, you can practice each case multiple times to refine your clinical reasoning.',
    },
    {
        id: 3,
        question: "What should I do if the AI doesn't understand my diagnosis?",
        answer: "Ensure you are using standard medical terminology. Otherwise, use the 'Report Issue' button.",
    },
];

interface FAQProps {
    data: PatientData;
    sessionId?: string;
}

export default function FAQ({ data, sessionId = '' }: FAQProps) {
    const [issues, setIssues] = useState<IssueItem[]>([]);
    const [isLoadingIssues, setIsLoadingIssues] = useState(false);
    const [openId, setOpenId] = useState<number | null>(1);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    const [actionId, setActionId] = useState<string | null>(null);
    const [tempValue, setTempValue] = useState<string>('');
    
    const [reportLabel, setReportLabel] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);

    useEffect(() => {
        const loadIssues = async () => {
            if (!sessionId) return;
            setIsLoadingIssues(true);
            try {
                const items = await issueService.getIssuesBySession(sessionId);
                setIssues(items);
            } catch (err) {
                console.error('[FAQ] Failed to load issues:', err);
            } finally {
                setIsLoadingIssues(false);
            }
        };
        void loadIssues();
    }, [sessionId]);

    const handleStartEdit = (id: string, currentContent: string) => {
        setActionId(id);
        setTempValue(currentContent);
    };

    const handleSaveEdit = async (issueId: string) => {
        try {
            const updated = await issueService.updateIssue(issueId, { description: tempValue });
            setIssues((prev) => prev.map((issue) => (issue.issueId === issueId ? updated : issue)));
            setActionId(null);
        } catch (err) {
            console.error('[FAQ] Failed to update issue:', err);
        }
    };

    const handleDeleteIssue = async (issueId: string) => {
        try {
            await issueService.deleteIssue(issueId);
            setIssues((prev) => prev.filter((issue) => issue.issueId !== issueId));
        } catch (err) {
            console.error('[FAQ] Failed to delete issue:', err);
        }
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportDescription.trim()) return;
        const learnerId = getCookie('userId') || 'unknown';
        setIsSubmittingReport(true);
        try {
            const newIssue = await issueService.createIssue({
                practiceSessionId: sessionId || `VIRTUAL_${data.id}`,
                learnerId,
                label: reportLabel || 'General',
                description: reportDescription,
                itemType: 'Practice',
            });
            setIssues((prev) => [newIssue, ...prev]);
            setReportLabel('');
            setReportDescription('');
            setIsReportModalOpen(false);
        } catch (err) {
            console.error('[FAQ] Failed to submit report:', err);
        } finally {
            setIsSubmittingReport(false);
        }
    };

    const getStatusStyles = (status: IssueStatus) => {
        switch (status) {
            case 'Resolved': return 'bg-[#00BC10] text-white';
            case 'Open': return 'bg-[#F99A00] text-white';
            case 'InReview': return 'bg-[#235697] text-white';
            default: return 'bg-gray-400 text-white';
        }
    };

    return (
        <div className="flex flex-col gap-10 pb-10 animate-fadeIn max-w-5xl mx-auto font-sans">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div className="space-y-1">
                    <h3 className="text-[#235697] text-2xl font-bold uppercase tracking-wide">Support & Case Insights</h3>
                    <p className="text-gray-500 text-sm">Review previous learner reports or find general help.</p>
                </div>
                
                <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-2 bg-[#E90000]/10 text-red-600 hover:bg-[#E90000] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
                >
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    Report an Issue
                </button>
            </div>

            {/* --- SECTION 1: LEARNER ISSUES --- */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#235697]">
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                    <h4 className="font-bold text-lg tracking-tight">Recent Reports for this Case ({issues.length})</h4>
                </div>
                
                <div className="grid gap-6">
                    {isLoadingIssues ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-[#235697] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 text-center text-gray-400 text-sm">
                            No reports yet for this case.
                        </div>
                    ) : (
                        issues.map((issue) => (
                            <div key={issue.issueId} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:border-blue-200 transition-all group flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="w-10 h-10 text-gray-200 shrink-0" />
                                        <div>
                                            <p className="font-bold text-[#0E2A46] text-[15px]">{issue.learnerName}</p>
                                            <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-tight">
                                                <CalendarDaysIcon className="w-3.5 h-3.5" />
                                                {new Date(issue.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {!issue.expertFeedback && actionId !== issue.issueId && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleStartEdit(issue.issueId, issue.description)}
                                                    title="Edit Report" 
                                                    className="p-1.5 bg-white text-[#1BA7D9] rounded-md shadow-sm border border-blue-100 hover:bg-[#1BA7D9] hover:text-white transition-all"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => void handleDeleteIssue(issue.issueId)}
                                                    title="Delete Report" 
                                                    className="p-1.5 bg-white text-red-400 rounded-md shadow-sm border border-red-100 hover:bg-red-400 hover:text-white transition-all"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${getStatusStyles(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 pl-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-[#235697]/5 text-[#235697] px-2 py-0.5 rounded font-black uppercase tracking-tighter border border-[#235697]/10">
                                            {issue.label}
                                        </span>
                                    </div>
                                    
                                    {actionId === issue.issueId ? (
                                        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                                            <textarea 
                                                autoFocus
                                                value={tempValue}
                                                onChange={(e) => setTempValue(e.target.value)}
                                                className="w-full bg-slate-50 border border-blue-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#235697]/20 resize-none shadow-inner"
                                                rows={3}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setActionId(null)} 
                                                    className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase hover:bg-gray-100 rounded-lg transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button 
                                                    onClick={() => void handleSaveEdit(issue.issueId)} 
                                                    className="px-4 py-1.5 text-[10px] font-bold bg-[#235697] text-white uppercase rounded-lg shadow-md flex items-center gap-1 hover:bg-[#1BA7D9] transition-all"
                                                >
                                                    <CheckIcon className="w-3.5 h-3.5" /> Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 text-[14px] bg-[#E2E8F0]/30 rounded-lg leading-relaxed italic border-l-4 border-[#235697] pl-4 py-3">
                                            &ldquo;{issue.description}&rdquo;
                                        </p>
                                    )}
                                    
                                    {issue.expertFeedback && (
                                        <div className="mt-4 bg-[#00B7FF]/5 rounded-xl p-5 border-r-4 border-[#1BA7D9] relative shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-[#235697] text-[13px] font-bold flex items-center gap-1.5 uppercase">
                                                    <PaperAirplaneIcon className="w-3.5 h-3.5 rotate-180" /> Expert Feedback
                                                </p>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-[#235697]/60">
                                                    <span>{issue.expertFeedback.expertName}</span>
                                                    <span className="bg-white/60 px-1.5 py-0.5 rounded border border-[#1BA7D9]/20 tracking-widest">
                                                        ID: {issue.expertFeedback.expertId}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-[13px] leading-relaxed">{issue.expertFeedback.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* --- SECTION 2: FAQ --- */}
            <div className="space-y-6">
                <h4 className="font-black text-lg text-[#235697] uppercase tracking-tight">Frequently Asked Questions</h4>
                <div className="grid gap-4">
                    {FAQ_DATA.map((item) => {
                        const isOpen = openId === item.id;
                        return (
                            <div key={item.id} className="border border-gray-100 rounded-[1.25rem] overflow-hidden bg-white shadow-sm transition-all duration-300">
                                <button 
                                    onClick={() => setOpenId(isOpen ? null : item.id)}
                                    className={`w-full flex items-center justify-between p-5 text-left transition-all ${
                                        isOpen ? 'bg-[#235697] text-white' : 'hover:bg-gray-50 text-[#0E2A46]'
                                    }`}
                                >
                                    <span className="font-bold text-md leading-tight">{item.question}</span>
                                    {isOpen ? <MinusIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5 text-gray-300" />}
                                </button>
                                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="p-6 text-gray-600 leading-relaxed text-[15px] border-t border-gray-50 bg-white">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- MODAL REPORT ISSUE --- */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-[#0E2A46]/40 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white rounded-[20px] w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
                        <div className="flex items-center justify-between p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3 text-[#235697]">
                                <ExclamationTriangleIcon className="w-7 h-7 text-[#E90000]" />
                                <h4 className="text-xl text-[#235697] font-black uppercase tracking-tight">Report Case Issue</h4>
                            </div>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-300 hover:text-[#E90000] transition-colors">
                                <XMarkIcon className="w-8 h-8" />
                            </button>
                        </div>
                        <form className="p-8 space-y-5" onSubmit={(e) => void handleSubmitReport(e)}>
                            <div>
                                <label className="block text-sm font-bold text-[#235697] mb-1 uppercase">Category / Label</label>
                                <input
                                    type="text"
                                    value={reportLabel}
                                    onChange={(e) => setReportLabel(e.target.value)}
                                    placeholder="e.g. Clinical Logic, Scoring, Technical"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#235697]/30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#235697] mb-1 uppercase">Description *</label>
                                <textarea
                                    required
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    placeholder="Describe the issue you encountered..."
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#235697]/30 resize-none"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingReport}
                                className="w-full bg-[#235697] hover:bg-[#1BA7D9] text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-60"
                            >
                                {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                                <PaperAirplaneIcon className="w-5 h-5 -rotate-45 mb-1" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}