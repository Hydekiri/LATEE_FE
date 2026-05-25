"use client";

import React, { useState, ChangeEvent } from "react";
import { X, Loader2, ChevronDown, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/src/utils/cookies";

interface AssessmentFormData {
    moduleId: string;
    title: string;
    specialty: string;
    topic: string;
    subtopic: string;
    difficultyLevel: string;
    descriptions: string; 
    goal: string;
    numQuestions: number;
    timeLimitMinutes: number;
    passingScorePercentage: number;
    maxAttempts: number;
    allowedQuestionTypes: string[]; 
    additionalPrompt: string; 
}

interface CreateAssessmentResponse {
    message: string;
    assessmentId: string;
}

interface AssessmentCreateFormProps {
    onClose: () => void;
    onSuccess: (assessmentId: string) => void;
}

export default function AssessmentCreateForm({ onClose, onSuccess }: AssessmentCreateFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const [formData, setFormData] = useState<AssessmentFormData>({
        moduleId: "EPA_STANDARD_V1", 
        title: "",
        specialty: "Neurology",
        topic: "",
        subtopic: "",
        difficultyLevel: "Intermediate", 
        descriptions: "",
        goal: "",
        numQuestions: 10,
        timeLimitMinutes: 30,
        passingScorePercentage: 80,
        maxAttempts: 3,
        allowedQuestionTypes: ["MultipleChoice"],
        additionalPrompt: ""
    });

    const specialties: string[] = ["Cardiology", "Neurology", "Pediatrics", "Internal Medicine", "General Surgery"];
    
    const questionTypeOptions = [
        { label: "Multiple Choice", value: "MultipleChoice" },
        { label: "True False", value: "TrueFalse" } 
    ];

    const handleQuestionTypeChange = (value: string): void => {
        setFormData(prev => ({
            ...prev,
            allowedQuestionTypes: prev.allowedQuestionTypes.includes(value)
                ? prev.allowedQuestionTypes.filter(t => t !== value)
                : [...prev.allowedQuestionTypes, value]
        }));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleCreateAssessment = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        const token = getCookie('accessToken');
        if (!token) {
            alert("Session expired, please log in again.");
            return;
        }

        setIsLoading(true);
        try {
            const createRes = await fetch("http://localhost:5000/assessment/api/assessments", {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    allowedQuestionTypes: JSON.stringify(formData.allowedQuestionTypes) 
                }),
            });

            if (!createRes.ok) {
                let errorMsg = "Error creating assessment";
                try {
                    const errorData = await createRes.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {
                    const errorText = await createRes.text();
                    errorMsg = errorText || errorMsg;
                }
                throw new Error(errorMsg);
            }

            const createData: CreateAssessmentResponse = await createRes.json();
            const newId = createData.assessmentId;

            if (newId) {
                const genRes = await fetch(`http://localhost:5000/assessment/api/assessments/${newId}/generate-questions`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ additionalPrompt: formData.additionalPrompt || "None" }),
                });

                if (!genRes.ok) {
                    const errorMsg = await genRes.text();
                    throw new Error(errorMsg || "AI generation failed - Timeout or server error");
                }

                const contentType = genRes.headers.get("content-type");
                if (contentType && contentType.includes("application/json") && genRes.status !== 204) {
                    await genRes.json(); 
                }
                
                window.dispatchEvent(new Event("assessmentCreated"));
                onSuccess(newId);
                router.push(`/assessment/${newId}?tab=about`);
            }
        } catch (error: unknown) {
            console.error("Submit Error:", error);
            alert(error instanceof Error ? error.message : "An undefined error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-900">Configure Assessment</h3>
                    <p className="text-xs text-slate-500">Fill in the details to generate your assessment.</p>
                </div>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
                    disabled={isLoading}
                >
                    <X size={18} className="text-slate-500" />
                </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
                <fieldset disabled={isLoading} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700">Assessment Title</label>
                        <input 
                            required 
                            name="title"
                            className="form-input-full" 
                            placeholder="e.g. Neurology: Acute Stroke Evaluation" 
                            value={formData.title} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700">Topic</label>
                        <input 
                            required 
                            name="topic"
                            className="form-input-full" 
                            placeholder="e.g. Appendicitis" 
                            value={formData.topic} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-slate-700">Sub-topic</label>
                            <input 
                                name="subtopic"
                                className="form-input-full" 
                                placeholder="e.g. Acute Abdomen" 
                                value={formData.subtopic} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-medium text-slate-700">Specialty</label>
                            <div className="relative">
                                <select 
                                    name="specialty"
                                    className="form-input-full appearance-none pr-10" 
                                    value={formData.specialty} 
                                    onChange={handleChange}
                                >
                                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700">Short Description</label>
                        <input 
                            required 
                            name="descriptions"
                            className="form-input-full" 
                            placeholder="Test knowledge on appendicitis." 
                            value={formData.descriptions} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="grid col-span-3">
                            <label className="text-[13px] font-medium text-slate-700">Allowed Question Types</label>
                            <div className="flex gap-3">
                                {questionTypeOptions.map((option) => (
                                    <label key={option.value} className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all ${formData.allowedQuestionTypes.includes(option.value) ? 'border-[#235697] bg-[#235697] text-white shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={formData.allowedQuestionTypes.includes(option.value)} 
                                            onChange={() => handleQuestionTypeChange(option.value)} 
                                        />
                                        {option.label}
                                        {formData.allowedQuestionTypes.includes(option.value) && <CheckCircle size={14} className="text-white" />}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="grid col-span-2">
                            <label className="text-[13px] font-medium text-slate-700">Passing Score (%)</label>
                            <div className="relative">
                                <input type="number" name="passingScorePercentage" className="form-input-full appearance-none" value={formData.passingScorePercentage} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-4 bg-[#e8f2ff] rounded-lg border border-slate-100">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">Difficulty</label>
                            <div className="relative">
                                <select 
                                    name="difficultyLevel"
                                    className="form-input-small appearance-none pr-8" 
                                    value={formData.difficultyLevel} 
                                    onChange={handleChange}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-2 text-slate-400 pointer-events-none" size={14} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">Questions</label>
                            <input type="number" name="numQuestions" className="form-input-small" value={formData.numQuestions} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">Time (Min)</label>
                            <input type="number" name="timeLimitMinutes" className="form-input-small" value={formData.timeLimitMinutes} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-tight">Attempts</label>
                            <input type="number" name="maxAttempts" className="form-input-small" value={formData.maxAttempts} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700">Learning Goal</label>
                        <input 
                            name="goal"
                            className="form-input-full" 
                            placeholder="Evaluate diagnosis and management." 
                            value={formData.goal} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-slate-700">Extra Note (AI Prompt)</label>
                        <textarea 
                            name="additionalPrompt"
                            className="form-input-full h-28 resize-none" 
                            placeholder="e.g. Focus on ECG interpretation." 
                            value={formData.additionalPrompt} 
                            onChange={handleChange} 
                        />
                    </div>
                </fieldset>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2 border-t border-slate-50">
                    <button type="button" disabled={isLoading} onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors">Cancel</button>
                    <button disabled={isLoading} type="submit" className="flex-2 px-4 py-2.5 bg-[#235697] text-white rounded-lg text-sm font-medium hover:bg-[#1a4a82] transition-all shadow-sm flex items-center justify-center gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Generating...</span>
                            </>
                        ) : "Create & Generate"}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .form-input-full {
                    width: 100%;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 14px;
                    color: #0f172a;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .form-input-full:focus {
                    outline: none;
                    border-color: #235697;
                    box-shadow: 0 0 0 2px rgba(35, 86, 151, 0.1);
                }
                .form-input-small {
                    width: 100%;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 6px 10px;
                    font-size: 13px;
                    background-color: #ffffff;
                    font-weight: 500;
                    outline: none;
                }
                /* Thêm hiệu ứng disabled cho toàn bộ form */
                fieldset:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}