import React from "react";
import { Users, BookOpen, FileText, ShoppingCart } from "lucide-react";

const KPI_DATA = [
    { title: "New Issues", value: "50", change: "+55%", icon: FileText, color: "#1BA7D9" },
    { title: "Learner's Today", value: "2,300", change: "+5%", icon: Users, color: "#1BA7D9" },
    { title: "New Learner", value: "+3,052", change: "-14%", icon: ShoppingCart, color: "#1BA7D9", isNegative: true },
    { title: "Practices", value: "124", change: "+8%", icon: BookOpen, color: "#1BA7D9" },
];

export default function KPICardSection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_DATA.map((item, index) => (
            <div key={index} className="bg-white rounded-[20px] p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest leading-none">
                {item.title}
                </span>
                <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800 tracking-tight">{item.value}</span>
                <span className={`text-xs font-black ${item.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                    {item.change}
                </span>
                </div>
            </div>
            <div className="bg-[#1BA7D9] p-2.5 rounded-xl text-white shadow-lg shadow-cyan-100">
                <item.icon size={20} strokeWidth={2.5} />
            </div>
            </div>
        ))}
        </div>
    );
}