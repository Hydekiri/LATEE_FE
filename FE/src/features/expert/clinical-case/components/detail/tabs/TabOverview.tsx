import React from "react";
import type { ClinicalCaseDetail, UpdateClinicalCaseRequest } from "@/src/types/clinical-case";
import { CaseDetailHeader } from "../CaseDetailHeader";

interface Props {
    caseData: ClinicalCaseDetail;
    localForm: Partial<UpdateClinicalCaseRequest>;
    onFieldChange: (key: keyof UpdateClinicalCaseRequest, value: string) => void;
}

const FIELD_CLASS =
    "w-full bg-[#F7FAFC] border border-[#DDE7F0] rounded-[10px] py-2.5 px-3 text-xs text-[#173B67] outline-none focus:border-[#1BA7D9] focus:bg-white transition-all";
const LABEL_CLASS = "text-[10px] font-bold text-[#7F96AD] uppercase tracking-wider block mb-1";

export function TabOverview({ caseData, localForm, onFieldChange }: Props) {
    const val = (key: keyof UpdateClinicalCaseRequest) =>
        (localForm[key] ?? (caseData as unknown as Record<string, unknown>)[key] as string) ?? "";

    return (
        <div className="space-y-6">
            <CaseDetailHeader caseData={caseData} />

            <div className="space-y-4">
                <div>
                    <label className={LABEL_CLASS}>Case Title</label>
                    <input
                        className={FIELD_CLASS}
                        type="text"
                        value={val("title")}
                        onChange={(e) => onFieldChange("title", e.target.value)}
                    />
                </div>
                <div>
                    <label className={LABEL_CLASS}>Description</label>
                    <textarea
                        className={FIELD_CLASS}
                        rows={3}
                        value={val("description")}
                        onChange={(e) => onFieldChange("description", e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={LABEL_CLASS}>Case Type</label>
                        <input
                            className={`${FIELD_CLASS} font-mono uppercase`}
                            type="text"
                            value={val("type")}
                            onChange={(e) => onFieldChange("type", e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <label className={LABEL_CLASS}>Evaluation Criteria (ECCID)</label>
                        <input
                            className={`${FIELD_CLASS} font-mono`}
                            type="text"
                            value={val("eccid")}
                            onChange={(e) => onFieldChange("eccid", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}