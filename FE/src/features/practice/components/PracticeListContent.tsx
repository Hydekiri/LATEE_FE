'use client';

import { useState, useCallback } from 'react';
import {
    MagnifyingGlassIcon,
    ArrowsUpDownIcon,
    FunnelIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

import { usePracticeDiscovery } from '@/src/hooks/usePracticeDiscovery';
import { PracticeListPagination } from '@/src/features/practice/components/PracticeListPagination';
import { PatientCardSkeleton } from '@/src/features/practice/components/PatientCardSkeleton';
import { EmptyDiscoveryState } from '@/src/features/practice/components/EmptyDiscoveryState';
import { DiscoveryGrid } from '@/src/features/practice/components/DiscoveryGrid';
import { FetchCasesModal } from '@/src/features/practice/components/FetchCasesModal';

import {
    DiscoverySortBy,
    FetchCasesFormState,
} from '@/src/types/discovery';

const SORT_OPTIONS: { value: DiscoverySortBy; label: string }[] = [
    { value: 'newest',      label: 'Newest' },
    { value: 'oldest',      label: 'Oldest' },
    { value: 'level_asc',   label: 'Level ↑' },
    { value: 'level_desc',  label: 'Level ↓' },
    { value: 'expert_asc',  label: 'Expert A→Z' },
    { value: 'expert_desc', label: 'Expert Z→A' },
];

export function PracticeListContent() {
    const {
        loadState,
        fetchState,
        patients,
        allPatients,
        availableOccupations,
        availableLevels,
        availableExperts,
        totalFiltered,
        totalPages,
        currentPage,
        uiFilter,
        error,
        fetchError,
        hasDiscovery,
        setUIFilter,
        setPage,
        resetFilters,
        fetchNewCases,
        retry,
    } = usePracticeDiscovery();

    const [isFetchModalOpen, setIsFetchModalOpen] = useState(false);

    const isLoading = loadState === 'loading' || loadState === 'checking';
    const isPoolEmpty = loadState === 'empty' && !hasDiscovery;
    const hasActiveFilter =
        !!uiFilter.search || !!uiFilter.level || !!uiFilter.occupation || !!uiFilter.expert;

    const handleFetchSubmit = useCallback(
        async (form: FetchCasesFormState) => {
            await fetchNewCases(form);
            if (fetchState !== 'error') {
                setIsFetchModalOpen(false);
            }
        },
        [fetchNewCases, fetchState]
    );

    const handleFetchSubmitWithClose = useCallback(
        async (form: FetchCasesFormState) => {
            await fetchNewCases(form);
            setIsFetchModalOpen(false);
        },
        [fetchNewCases]
    );

    if (loadState === 'error' && error !== null) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-600 font-semibold text-base text-center px-4">{error}</p>
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

    if (loadState === 'checking') {
        return (
            <div className="w-full flex justify-center items-center py-24 px-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235697]" />
                    <p className="text-[#235697] font-semibold text-sm animate-pulse text-center">
                        Loading your practice cases...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ── Toolbar ── */}
            <div className="w-full flex flex-wrap gap-4 lg:gap-6 items-center justify-between mt-6 lg:mt-10">

                <div className="flex-1 w-full min-w-70 sm:min-w-[320px]">
                    <div className="flex items-center py-2 border border-[#235697] rounded-lg bg-white
                            px-4 lg:px-6 w-full shadow-sm hover:shadow-md transition-shadow">
                        <input
                            type="text"
                            value={uiFilter.search}
                            onChange={(e) => setUIFilter('search', e.target.value)}
                            placeholder="Search by name, concern, occupation..."
                            className="flex-1 font-semibold text-sm sm:text-base placeholder-[#235697]/60 outline-none
                            text-[#235697] bg-transparent min-w-0"
                            aria-label="Search patients"
                        />
                        <MagnifyingGlassIcon className="w-5 h-5 text-[#235697]/60 shrink-0 ml-2" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end w-full xl:w-auto">

                    {/* Expert Filter */}
                    {availableExperts.length > 0 && (
                        <div className="relative flex items-center w-full sm:w-auto flex-1 sm:flex-none min-w-35">
                            <FunnelIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                            <select
                                value={uiFilter.expert || ''}
                                onChange={(e) => setUIFilter('expert', e.target.value)}
                                className="w-full border border-[#235697] pl-9 pr-8 py-2.5 rounded-lg bg-white
                                text-[#235697] font-semibold text-sm truncate
                                hover:bg-[#235697] hover:text-white transition-all shadow-sm
                                appearance-none cursor-pointer outline-none"
                                aria-label="Filter by Expert"
                            >
                                <option value="">All Experts</option>
                                {availableExperts.map((exp) => (
                                    <option key={exp} value={exp}>{exp}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Level filter */}
                    <div className="relative flex items-center w-full sm:w-auto flex-1 sm:flex-none min-w-35">
                        <FunnelIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                        <select
                            value={uiFilter.level}
                            onChange={(e) => setUIFilter('level', e.target.value)}
                            className="w-full border border-[#235697] pl-9 pr-8 py-2.5 rounded-lg bg-white
                            text-[#235697] font-semibold text-sm truncate
                            hover:bg-[#235697] hover:text-white transition-all shadow-sm
                            appearance-none cursor-pointer outline-none" 
                            aria-label="Filter by level"
                        >
                            <option value="">All Levels</option>
                            {availableLevels.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    {/* Occupation filter */}
                    {availableOccupations.length > 0 && (
                        <div className="relative flex items-center w-full sm:w-auto flex-1 sm:flex-none min-w-40">
                            <FunnelIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                            <select
                                value={uiFilter.occupation}
                                onChange={(e) => setUIFilter('occupation', e.target.value)}
                                className="w-full border border-[#235697] pl-9 pr-8 py-2.5 rounded-lg bg-white
                                text-[#235697] font-semibold text-sm truncate
                                hover:bg-[#235697] hover:text-white transition-all shadow-sm
                                appearance-none cursor-pointer outline-none"
                                aria-label="Filter by occupation"
                            >
                                <option value="">All Occupations</option>
                                {availableOccupations.map((o) => (
                                    <option key={o} value={o}>{o}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Sort */}
                    <div className="relative flex items-center w-full sm:w-auto flex-1 sm:flex-none min-w-35">
                        <ArrowsUpDownIcon className="absolute left-3 w-4 h-4 text-[#235697] pointer-events-none" />
                        <select
                            value={uiFilter.sortBy}
                            onChange={(e) => setUIFilter('sortBy', e.target.value as DiscoverySortBy)}
                            className="w-full border border-[#235697] pl-9 pr-8 py-2.5 rounded-lg bg-white
                            text-[#235697] font-semibold text-sm truncate
                            hover:bg-[#235697] hover:text-white transition-all shadow-sm
                            appearance-none cursor-pointer outline-none"
                            aria-label="Sort by"
                        >
                            {SORT_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Button Group (Reset + New) */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {/* Reset filters */}
                        {hasActiveFilter && (
                            <button
                                onClick={resetFilters}
                                className="border border-gray-300 px-4 py-2.5 rounded-lg bg-white text-gray-500
                                font-semibold text-sm hover:border-red-300 hover:text-red-500
                                transition-all shadow-sm whitespace-nowrap outline-none flex-1 sm:flex-none text-center"
                                aria-label="Reset filters"
                            >
                                Reset
                            </button>
                        )}

                        {/* +New button */}
                        <button
                            onClick={() => setIsFetchModalOpen(true)}
                            className="flex justify-center items-center gap-2 border border-[#235697] px-5 py-2.5
                            rounded-lg bg-[#235697] text-white font-bold text-sm
                            hover:bg-[#1BA7D9] hover:border-[#1BA7D9] transition-all shadow-sm
                            whitespace-nowrap outline-none flex-1 sm:flex-none"
                            aria-label="Fetch new cases"
                        >
                            <PlusIcon className="w-4 h-4" />
                            New
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Pool count badge ── */}
            {!isLoading && allPatients.length > 0 && (
                <div className="w-full flex items-center gap-2 mt-4">
                    <span className="text-xs text-gray-400 font-medium">
                        Your pool: <span className="text-[#235697] font-bold">{allPatients.length}</span> cases
                        {totalFiltered !== allPatients.length && (
                            <> <span className="hidden sm:inline">·</span> <br className="sm:hidden" /> <span className="text-[#235697] font-bold">{totalFiltered}</span> match filters</>
                        )}
                    </span>
                </div>
            )}

            {/* ── Content ── */}
            <div className="w-full min-h-125 mt-4 lg:mt-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7.5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <PatientCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isPoolEmpty ? (
                    <EmptyDiscoveryState onNewDiscovery={() => setIsFetchModalOpen(true)} />
                ) : patients.length > 0 ? (
                    <DiscoveryGrid
                        patients={patients}
                        isLoading={false}
                        pageSize={9}
                    />
                ) : (
                    <div className="text-center py-20 px-4 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-3 text-sm sm:text-base">
                            No cases match your current filters.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="text-[#235697] font-semibold text-sm hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── Pagination ── */}
            {!isPoolEmpty && (
                <div className="w-full overflow-x-auto pb-4 mt-6">
                    <PracticeListPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalFiltered}
                        pageSize={9}
                        isLoading={isLoading}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {/* ── +New modal ── */}
            <FetchCasesModal
                isOpen={isFetchModalOpen}
                isLoading={fetchState === 'fetching'}
                errorMessage={fetchError}
                onSubmit={handleFetchSubmitWithClose}
                onClose={() => {
                    if (fetchState !== 'fetching') setIsFetchModalOpen(false);
                }}
            />
        </>
    );
}