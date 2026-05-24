import React from "react";
import { FileX2, RefreshCw } from "lucide-react";

interface CaseEmptyStateProps {
    type?: "empty" | "error";
    message?: string;
    onRetry?: () => void;
    onCreateNew?: () => void;
}

export function CaseEmptyState({
    type = "empty",
    message,
    onRetry,
    onCreateNew,
}: CaseEmptyStateProps) {
    const isError = type === "error";

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className={`p-5 rounded-2xl ${isError ? "bg-rose-50" : "bg-[#EDF6FB]"}`}>
                <FileX2 className={`w-10 h-10 ${isError ? "text-rose-400" : "text-[#7F96AD]"}`} />
            </div>
            <div>
                <p className="text-base font-bold text-[#173B67]">
                    {isError ? "Failed to Load Cases" : "No Cases Found"}
                </p>
                <p className="text-sm text-[#7F96AD] mt-1 max-w-sm">
                    {message ?? (isError
                        ? "Something went wrong while fetching clinical cases."
                        : "No clinical cases match your current filters.")}
                </p>
            </div>
            <div className="flex gap-2">
                {isError && onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1.5 bg-[#1BA7D9] text-white px-4 py-2 rounded-[10px] text-sm font-semibold hover:bg-[#1487AE] transition-all"
                    >
                        <RefreshCw className="w-4 h-4" /> Retry
                    </button>
                )}
                {!isError && onCreateNew && (
                    <button
                        onClick={onCreateNew}
                        className="flex items-center gap-1.5 bg-[#1BA7D9] text-white px-4 py-2 rounded-[10px] text-sm font-semibold hover:bg-[#1487AE] transition-all"
                    >
                        Create New Case
                    </button>
                )}
            </div>
        </div>
    );
}