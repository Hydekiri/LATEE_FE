'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export const BlogPagination = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-10 mt-6 gap-6">
            {/* Left: Info */}
            <div className="text-gray-400 text-sm font-medium">
                Showing <span className="text-[#235697] font-bold">1 - 2</span> of <span className="text-[#235697] font-bold">10</span> items
            </div>

            {/* Right: Controls */}
            <div className="flex flex-wrap items-center gap-8">
                {/* Page Size Selector */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm italic font-medium">The page size:</span>
                    <div className="relative">
                        <select className="appearance-none border border-gray-200 rounded-lg px-4 py-1.5 pr-8 text-sm font-bold text-[#235697] bg-white hover:border-[#235697] focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer shadow-sm">
                            <option>5</option>
                            <option>10</option>
                            <option>20</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        disabled
                        className="p-2.5 border border-gray-200 rounded-lg text-gray-300 hover:bg-gray-50 hover:text-[#235697] hover:border-[#235697] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button className="w-10 h-10 flex items-center justify-center border border-[#235697] rounded-lg bg-[#235697] text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all active:scale-95">
                        1
                    </button>
                    
                    <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg bg-white text-gray-500 font-bold text-sm hover:border-[#235697] hover:text-[#235697] transition-all shadow-sm active:scale-95">
                        2
                    </button>

                    <button 
                        className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-[#235697] hover:border-[#235697] transition-all shadow-sm active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};