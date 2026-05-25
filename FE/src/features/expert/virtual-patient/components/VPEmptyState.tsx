import React from "react";
import { UserCircle, Plus } from "lucide-react";

interface VPEmptyStateProps {
    readonly hasFilters: boolean;
    readonly onReset:   () => void;
    readonly onCreate:  () => void;
}

export function VPEmptyState({ hasFilters, onReset, onCreate }: VPEmptyStateProps) {
    return (
        <tr>
            <td colSpan={8}>
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#235697]/10 flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-[#235697]" />
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-slate-700 text-base mb-1">
                            {hasFilters ? "No patients match your filters" : "No virtual patients yet"}
                        </p>
                        <p className="text-slate-400 text-sm max-w-xs">
                            {hasFilters
                                ? "Try adjusting your search or filter criteria."
                                : "Create your first AI virtual patient to begin building clinical simulations."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {hasFilters && (
                            <button
                                onClick={onReset}
                                className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all"
                            >
                                Clear filters
                            </button>
                        )}
                        <button
                            onClick={onCreate}
                            className="flex items-center gap-2 px-5 py-2 bg-[#235697] text-white text-sm font-bold rounded-lg hover:bg-[#1BA7D9] transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Patient
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
}