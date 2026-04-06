'use client';
import Image from 'next/image';
import { Search, ChevronRight, Calendar } from 'lucide-react';
import { CATEGORIES } from '@/src/data/blogData';

export const BlogSidebar = () => {
    return (
        <aside className="flex flex-col gap-12">
            {/* Search Bar */}
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#235697] focus:ring-4 focus:ring-blue-50 transition-all shadow-sm text-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#235697] w-5 h-5" />
            </div>

            {/* Service Category */}
            <div className="flex flex-col gap-6">
                <h4 className="text-[#0E2A46] text-xl font-bold border-l-4 border-[#235697] pl-4">Service Category</h4>
                <div className="flex flex-col gap-2">
                    {CATEGORIES.map((cat, idx) => (
                        <button 
                            key={idx}
                            className={`flex items-center justify-between px-5 py-4 rounded-xl font-bold transition-all text-sm ${
                                cat === "Clinical Care" 
                                ? 'bg-[#235697] text-white shadow-lg' 
                                : 'bg-white border border-gray-100 text-gray-500 hover:bg-blue-50 hover:text-[#235697]'
                            }`}
                        >
                            <span>{cat}</span>
                            <ChevronRight className={`w-4 h-4 ${cat === "Clinical Care" ? 'text-white' : 'text-gray-300'}`} />
                        </button>
                    ))}
                    <button className="text-[#1BA7D9] text-xs font-black uppercase tracking-widest mt-2 hover:underline text-left">More</button>
                </div>
            </div>

            {/* Recent Post */}
            <div className="flex flex-col gap-6">
                <h4 className="text-[#0E2A46] text-xl font-bold border-l-4 border-[#235697] pl-4">Recent Post</h4>
                <div className="flex flex-col gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer">
                            <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm">
                                <Image src={`/images/VirtualPatient/VP${i+1}.jpeg`} alt="Recent" fill className="object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase">
                                    <Calendar className="w-3 h-3 text-[#235697]" />
                                    <span>21 Nov 2025</span>
                                </div>
                                <h5 className="text-[#0E2A46] text-xs font-bold line-clamp-2 leading-relaxed group-hover:text-[#235697]">
                                    Patient participation and its determinants based on the Social Ecological Model...
                                </h5>
                            </div>
                        </div>
                    ))}
                    <button className="text-[#1BA7D9] text-xs font-black uppercase tracking-widest mt-2 hover:underline self-center">More</button>
                </div>
            </div>
        </aside>
    );
};