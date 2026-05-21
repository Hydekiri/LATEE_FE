'use client';

import { useState } from 'react';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowsUpDownIcon,
} from '@heroicons/react/24/solid';
import { usePracticeDiscovery } from '@/src/hooks/usePracticeDiscovery';
import { PracticeListPagination } from '@/src/features/practice/components/PracticeListPagination';
import { PatientCardSkeleton } from '@/src/features/practice/components/PatientCardSkeleton';
import { EmptyDiscoveryState } from '@/src/features/practice/components/EmptyDiscoveryState';
import { DiscoveryFilterForm } from '@/src/features/practice/components/DiscoveryFilterForm';
import DiscoveryPatientCard from '@/src/features/practice/components/DiscoveryPatientCard';
import { DiscoveryFilterState, DiscoverySortBy } from '@/src/types/discovery';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const SORT_OPTIONS: { value: DiscoverySortBy; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'level_asc', label: 'Level ↑' },
    { value: 'level_desc', label: 'Level ↓' },
];

export function PracticeListContent() {
    const {
        loadState,
        patients,
        totalItems,
        totalPages,
        currentPage,
        filters,
        error,
        hasDiscovery,
        setFilter,
        applyFilters,
        resetFilters,
        goToPage,
        startDiscovery,
        retry,
    } = usePracticeDiscovery();

    const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);

    const isLoading = loadState === 'loading' || loadState === 'checking';
    const isFirstDiscovery = !hasDiscovery;

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') void applyFilters();
    };

    const handleFilterSubmit = async (newFilters: DiscoveryFilterState) => {
        if (isFirstDiscovery) {
            await startDiscovery(newFilters);
        } else {
            setFilter('level', newFilters.level);
            setFilter('gender', newFilters.gender);
            setFilter('sortBy', newFilters.sortBy);
            await applyFilters();
        }
    };

    if (loadState === 'checking') {
        return (
            <div className="w-full flex justify-center items-center py-24">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235697]" />
                    <p className="text-[#235697] font-semibold text-sm animate-pulse">
                        Loading your practice cases...
                    </p>
                </div>
            </div>
        );
    }

    if (loadState === 'error' && error !== null) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-600 font-semibold text-base">{error}</p>
                <button
                    onClick={retry}
                    className="px-6 py-2.5 rounded-lg bg-[#235697] text-white font-bold text-sm
                    hover:bg-[#1BA7D9] transition-all shadow-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (loadState === 'empty' && !hasDiscovery) {
        return (
            <>
                <EmptyDiscoveryState onNewDiscovery={() => setIsFilterFormOpen(true)} />
                <DiscoveryFilterForm
                    isOpen={isFilterFormOpen}
                    isLoading={isLoading}
                    onSubmit={handleFilterSubmit}
                    onClose={() => setIsFilterFormOpen(false)}
                    isFirstDiscovery
                />
            </>
        );
    }

    return (
        <>
            {/* Search + Filter Bar */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-center mt-10 xl:mt-16">

                <div className="xl:col-span-5 w-full">
                    <div className="flex items-center h-12 border border-[#235697] rounded-lg bg-white
                            px-4 xl:px-6 w-full shadow-sm hover:shadow-md transition-shadow">
                        <input
                            type="text"
                            value={filters.level}
                            onChange={(e) => setFilter('level', e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Filter by level..."
                            className="flex-1 font-semibold text-base placeholder-[#235697]/60 outline-none
                            text-[#235697] bg-transparent"
                            aria-label="Filter by level"
                        />
                        <button
                            onClick={() => void applyFilters()}
                            className="flex cursor-pointer text-[#235697] hover:text-[#1BA7D9] transition-colors"
                            aria-label="Apply filter"
                        >
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filter controls */}
                <div className="xl:col-span-7 w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 xl:gap-4 justify-start xl:justify-end min-w-max pb-2 xl:pb-0 items-center">

                        {/* Sort */}
                        <div className="relative flex items-center">
                            <ArrowsUpDownIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilter('sortBy', e.target.value as DiscoverySortBy)}
                                className="border border-[#235697] pl-9 pr-4 xl:pr-5 py-2.5 rounded-lg bg-white
                            text-[#235697] font-semibold text-sm xl:text-base
                            hover:bg-[#235697] hover:text-white transition-all shadow-sm
                            appearance-none cursor-pointer"
                                aria-label="Sort by"
                            >
                                {SORT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Apply */}
                        <button
                            onClick={() => void applyFilters()}
                            disabled={isLoading}
                            className="flex items-center gap-2 border border-[#235697] px-4 xl:px-6 py-2.5
                            rounded-lg bg-[#235697] text-white font-semibold text-sm xl:text-base
                            hover:bg-[#1BA7D9] hover:border-[#1BA7D9] transition-all shadow-sm
                            whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-label="Apply filters"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Apply
                        </button>

                        {/* Advanced filter (opens modal) */}
                        <button
                            onClick={() => setIsFilterFormOpen(true)}
                            className="border border-[#235697]/50 px-4 py-2.5 rounded-lg bg-white
                            text-[#235697] font-semibold text-sm xl:text-base
                            hover:border-[#235697] transition-all shadow-sm whitespace-nowrap"
                        >
                            More Filters
                        </button>

                        {/* Reset */}
                        {(filters.level || filters.gender || filters.sortBy !== 'newest') && (
                            <button
                                onClick={() => void resetFilters()}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg bg-white text-gray-500
                            font-semibold text-sm xl:text-base hover:border-red-300 hover:text-red-500
                            transition-all shadow-sm whitespace-nowrap"
                                aria-label="Reset filters"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="w-full min-h-[500px]">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5">
                        {Array.from({ length: filters.pageSize }).map((_, i) => (
                            <PatientCardSkeleton key={i} />
                        ))}
                    </div>
                ) : patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5">
                        {patients.map((item) => (
                            <DiscoveryPatientCard key={item.patientId} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-3">No practice cases match your current filters.</p>
                        <button
                            onClick={() => void resetFilters()}
                            className="text-[#235697] font-semibold text-sm hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <PracticeListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={filters.pageSize}
                isLoading={isLoading}
                onPageChange={(page) => void goToPage(page)}
            />

            {/* Filter Form Modal */}
            <DiscoveryFilterForm
                isOpen={isFilterFormOpen}
                isLoading={isLoading}
                initialFilters={filters}
                onSubmit={handleFilterSubmit}
                onClose={() => setIsFilterFormOpen(false)}
                isFirstDiscovery={false}
            />
        </>
    );
}