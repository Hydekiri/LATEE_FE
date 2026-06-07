'use client';

export type QuickFilterValue =
    | 'BEGINNER'
    | 'INTERMEDIATE'
    | 'ADVANCED'
    | 'EXPERT'
    | 'MALE'
    | 'FEMALE';

interface QuickFilterChip {
    value: QuickFilterValue;
    label: string;
}

const CHIPS: readonly QuickFilterChip[] = [
    { value: 'BEGINNER', label: 'Beginner' },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED', label: 'Advanced' },
    { value: 'EXPERT', label: 'Expert' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
] as const;

interface QuickFilterChipsProps {
    readonly selectedFilters: ReadonlySet<QuickFilterValue>;
    readonly onToggle: (value: QuickFilterValue) => void;
}

export function QuickFilterChips({
    selectedFilters,
    onToggle,
}: QuickFilterChipsProps) {
    return (
        <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Quick filters"
        >
            {CHIPS.map((chip) => {
                const isActive = selectedFilters.has(chip.value);
                return (
                    <button
                        key={chip.value}
                        type="button"
                        onClick={() => onToggle(chip.value)}
                        aria-pressed={isActive}
                        className={[
                            'px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-200 outline-none',
                            'focus-visible:ring-2 focus-visible:ring-[#235697] focus-visible:ring-offset-1',
                            isActive
                                ? 'bg-[#235697] text-white border-[#235697] shadow-sm'
                                : 'bg-white text-[#235697] border-[#235697] hover:bg-[#235697]/10',
                        ].join(' ')}
                    >
                        {chip.label}
                    </button>
                );
            })}
        </div>
    );
}