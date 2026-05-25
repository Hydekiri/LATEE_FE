'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
    page: number;

    setPage: (page: number) => void;

    total: number;

    pageSize: number;

    setPageSize: (size: number) => void;
}

export const BlogPagination = ({
    page,
    setPage,
    total,
    pageSize,
    setPageSize
}: BlogPaginationProps) => {

    const totalPage = Math.max(1, Math.ceil(total / pageSize));

    const start = total === 0 ? 0 : (page - 1) * pageSize + 1;

    const end = Math.min(page * pageSize, total);

    const getVisiblePages = (): (number | string)[] => {
        if (totalPage <= 5) {
            return Array.from(
                { length: totalPage }, (_, i) => i + 1
            );
        }

        if (page <= 3) {
            return [1, 2, 3, "...", totalPage];
        }

        if (page >= totalPage - 2) {
            return [1, "...", totalPage - 2, totalPage - 1, totalPage];
        }

        return [1, "...", page - 1, page, page + 1, "...", totalPage];
    };

    return (

        <div
            className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100
            pt-10 mt-6 gap-6 ">
            {/* INFO */}

            <div className=" text-gray-400 text-sm font-medium">
                Showing{" "}
                <span className="text-[#235697] font-bold">
                    {start} - {end}
                </span>

                {" "}of{" "}

                <span className="text-[#235697] font-bold">
                    {total}
                </span>

                {" "}items

            </div>

            {/* CONTROLS */}
            <div className="flex flex-wrap items-center gap-8">
                {/* PAGE SIZE */}
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm italic font-medium">
                        The page size:
                    </span>

                    <div className="relative">
                        <select
                            value={pageSize}

                            onChange={(e) => {
                                setPage(1);
                                setPageSize(Number(e.target.value));
                            }}
                            className="
                                appearance-none
                                border
                                border-gray-200
                                rounded-lg
                                px-4
                                py-1.5
                                pr-8
                                text-sm
                                font-bold
                                text-[#235697]
                                bg-white
                                hover:border-[#235697]
                                focus:ring-2
                                focus:ring-blue-100
                                outline-none
                                shadow-sm
                                "
                        >
                            <option value={3}> 3 </option>

                            <option value={6}> 6 </option>

                            <option value={9}> 9 </option>

                        </select>

                        <div
                            className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            flex
            items-center
            justify-center
        "
                        >
                            <ChevronRight className="h-4 w-4 rotate-90 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="
                        p-2.5
                        border
                        rounded-lg
                        text-gray-500
                        hover:text-[#235697]
                        disabled:opacity-30
                        transition
                        "
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {
                        getVisiblePages()
                            .map((item, index) => {
                                if (item === "...") {
                                    return (
                                        <span key={index} className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    );
                                }

                                return (
                                    <button
                                        key={item}
                                        onClick={() => setPage(Number(item))}
                                        className={`w-10 h-10 rounded-lg font-bold transition
                                            ${page === item ? `bg-[#235697] text-white shadow-md` :
                                                `border border-gray-200 text-gray-500 hover:border-[#235697] hover:text-[#235697]`}`}>
                                        {item}
                                    </button>
                                );
                            }
                            )
                    }

                    <button
                        disabled={page === totalPage}
                        onClick={() => setPage(page + 1)}
                        className="p-2.5 border rounded-lg text-gray-500 hover:text-[#235697] disabled:opacity-30 transition">
                        <ChevronRight
                            className="w-4 h-4"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};