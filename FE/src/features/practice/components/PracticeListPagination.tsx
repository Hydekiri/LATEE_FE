'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';

interface PracticeListPaginationProps {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly pageSize: number;
    readonly isLoading: boolean;
    readonly onPageChange: (page: number) => void;
}

function buildVisiblePages(current: number, total: number): number[] {
    const maxVisible = 5;
    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function PracticeListPagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    isLoading,
    onPageChange,
}: PracticeListPaginationProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const visiblePages = useMemo(
        () => buildVisiblePages(currentPage, totalPages),
        [currentPage, totalPages]
    );

    if (totalItems === 0 && !isLoading) return null;

    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-12 text-[#235697] text-sm bg-white border border-[#235697] px-4 py-3 rounded-lg shadow-sm gap-4">
            <p className="font-medium">
                {isLoading
                    ? 'Loading...'
                    : `Showing ${startItem} – ${endItem} of ${totalItems} items`}
            </p>

            <div className="flex items-center gap-1.5 text-[14px]">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="px-2.5 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>

                {/* First page + ellipsis */}
                {visiblePages[0] > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            disabled={isLoading}
                            className="min-w-8.5 px-2.5 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition-colors text-center"
                        >
                            1
                        </button>
                        {visiblePages[0] > 2 && (
                            <span className="px-1 text-gray-400">…</span>
                        )}
                    </>
                )}

                {/* Page buttons */}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        className={`min-w-8.5 px-2.5 py-1.5 border rounded-md transition-colors text-center font-bold ${page === currentPage
                                ? 'bg-[#235697] text-white border-[#235697] shadow-md cursor-default'
                                : 'border-[#235697] hover:bg-gray-100'
                            }`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {/* Last page + ellipsis */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <span className="px-1 text-gray-400">…</span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={isLoading}
                            className="min-w-8.5 px-2.5 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition-colors text-center"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="px-2.5 py-1.5 border border-[#235697] rounded-md hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}