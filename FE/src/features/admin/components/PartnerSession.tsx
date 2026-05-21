import React from "react";
import { MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Bell } from "lucide-react";
const PARTNERS = [
    { name: "Trường Đại học Y Dược TP. Hồ Chí Minh", budget: "$14,000", status: "Active", progress: 60 },
    { name: "Trường Đại học Y Hà Nội", budget: "$3,000", status: "Cancelled", progress: 10 },
    { name: "Trường Đại học Y Khoa Phạm Ngọc Thạch", budget: "None", status: "Inactive", progress: 100 },
    { name: "Trường Đại học Khoa học sức khỏe", budget: "$32,000", status: "Active", progress: 100 },
];

export default function PartnerSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Partner Table */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-7 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Partner Business</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <p className="text-[11px] text-gray-400 font-bold"><span className="text-emerald-500">02 done</span> this month</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-extrabold text-[#1BA7D9] hover:opacity-80 flex items-center gap-1">
                        View Details
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[10px] uppercase text-gray-400 font-bold border-b border-gray-50 text-left">
                                <th className="pb-4">Business</th>
                                <th className="pb-4">Budget</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {PARTNERS.map((p, i) => (
                                <tr key={i} className="group">
                                    <td className="py-4 text-xs font-bold text-slate-700 max-w-50 truncate">{p.name}</td>
                                    <td className="py-4 text-xs font-bold text-slate-500">{p.budget}</td>
                                    <td className="py-4 text-xs font-bold text-slate-500">{p.status}</td>
                                    <td className="py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-black text-[#1BA7D9]">{p.progress}%</span>
                                            <div className="w-32 h-1.5 bg-gray-100 rounded-full">
                                                <div
                                                    className="h-full bg-linear-to-r from-[#1BA7D9] to-[#235697] rounded-full transition-all"
                                                    style={{ width: `${p.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}