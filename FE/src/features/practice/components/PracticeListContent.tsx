'use client';

import { usePatientFilter } from '@/src/hooks/usePatientFilter';
import PatientCard from '@/src/features/practice/components/Practice_Card';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';
import { PatientCardSkeleton } from '@/src/features/practice/components/PatientCardSkeleton';
import { PracticeListPagination } from '@/src/features/practice/components/PracticeListPagination';

const LEVEL_OPTIONS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const GENDER_OPTIONS = [
    { value: '', label: 'Any Gender' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
] as const;
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'level_asc', label: 'Level ↑' },
    { value: 'level_desc', label: 'Level ↓' },
] as const;

export function PracticeListContent() {
    const {
        patients,
        totalItems,
        totalPages,
        currentPage,
        filters,
        isLoading,
        error,
        setFilter,
        applyFilters,
        resetFilters,
        goToPage,
    } = usePatientFilter();

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') applyFilters();
    };

    return (
        <>
            {/* ── Search + Filter Bar ── */}
            <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-4 items-center mt-10 xl:mt-16">
                {/* Search */}
                <div className="xl:col-span-5 w-full">
                    <div className="flex items-center h-12 border border-[#235697] rounded-lg bg-white px-4 xl:px-6 w-full shadow-sm hover:shadow-md transition-shadow">
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilter('search', e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search by name, chief concern..."
                            className="flex-1 font-semibold text-base placeholder-[#235697]/60 outline-none text-[#235697] bg-transparent"
                            aria-label="Search patients"
                        />
                        <button
                            onClick={applyFilters}
                            className="flex cursor-pointer text-[#235697] hover:text-[#1BA7D9] transition-colors"
                            aria-label="Apply search"
                        >
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="xl:col-span-7 w-full overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 xl:gap-4 justify-start xl:justify-end min-w-max pb-2 xl:pb-0 items-center">
                        {/* Level filter */}
                        <div className="relative">
                            <select
                                value={filters.level}
                                onChange={(e) => {
                                    setFilter('level', e.target.value);
                                }}
                                className="border border-[#235697] px-4 xl:px-5 py-2.5 rounded-lg bg-white text-[#235697] font-semibold text-sm xl:text-base hover:bg-[#235697] hover:text-white transition-all shadow-sm appearance-none pr-8 cursor-pointer"
                                aria-label="Filter by level"
                            >
                                <option value="">All Levels</option>
                                {LEVEL_OPTIONS.filter(Boolean).map((l) => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Gender filter */}
                        <div className="relative">
                            <select
                                value={filters.gender}
                                onChange={(e) => {
                                    setFilter('gender', e.target.value);
                                }}
                                className="border border-[#235697] px-4 xl:px-5 py-2.5 rounded-lg bg-white text-[#235697] font-semibold text-sm xl:text-base hover:bg-[#235697] hover:text-white transition-all shadow-sm appearance-none pr-8 cursor-pointer"
                                aria-label="Filter by gender"
                            >
                                {GENDER_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative flex items-center">
                            <ArrowsUpDownIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                            <select
                                value={filters.sortBy}
                                onChange={(e) => {
                                    setFilter('sortBy', e.target.value as typeof filters.sortBy);
                                }}
                                className="border border-[#235697] pl-9 pr-4 xl:pr-5 py-2.5 rounded-lg bg-white text-[#235697] font-semibold text-sm xl:text-base hover:bg-[#235697] hover:text-white transition-all shadow-sm appearance-none cursor-pointer"
                                aria-label="Sort by"
                            >
                                {SORT_OPTIONS.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Apply */}
                        <button
                            onClick={applyFilters}
                            disabled={isLoading}
                            className="flex items-center gap-2 border border-[#235697] px-4 xl:px-6 py-2.5 rounded-lg bg-[#235697] text-white font-semibold text-sm xl:text-base hover:bg-[#1BA7D9] hover:border-[#1BA7D9] transition-all shadow-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                            aria-label="Apply filters"
                        >
                            <FunnelIcon className="w-4 h-4" />
                            Apply
                        </button>

                        {/* Reset — only show when filters are active */}
                        {(filters.search || filters.level || filters.gender || filters.sortBy !== 'newest') && (
                            <button
                                onClick={resetFilters}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg bg-white text-gray-500 font-semibold text-sm xl:text-base hover:border-red-300 hover:text-red-500 transition-all shadow-sm whitespace-nowrap"
                                aria-label="Reset filters"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Error State ── */}
            {error !== null && (
                <div className="w-full bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600 font-medium">
                    {error}
                    <button
                        onClick={applyFilters}
                        className="ml-3 text-red-700 underline underline-offset-2 font-bold"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* ── Grid ── */}
            <div className="w-full min-h-125">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <PatientCardSkeleton key={i} />
                        ))}
                    </div>
                ) : patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5">
                        {patients.map((item) => (
                            <PatientCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-3">No virtual patients found.</p>
                        {(filters.search || filters.level || filters.gender) && (
                            <button
                                onClick={resetFilters}
                                className="text-[#235697] font-semibold text-sm hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Pagination ── */}
            <PracticeListPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={filters.pageSize}
                isLoading={isLoading}
                onPageChange={goToPage}
            />
        </>
    );
}