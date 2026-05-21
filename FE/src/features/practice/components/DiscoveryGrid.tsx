'use client';

import { DiscoveryPatientItem } from '@/src/types/discovery';
import DiscoveryPatientCard from '@/src/features/practice/components/DiscoveryPatientCard';
import { PatientCardSkeleton } from '@/src/features/practice/components/PatientCardSkeleton';

interface DiscoveryGridProps {
    readonly patients: readonly DiscoveryPatientItem[];
    readonly isLoading: boolean;
    readonly pageSize: number;
}

export function DiscoveryGrid({ patients, isLoading, pageSize }: DiscoveryGridProps) {
    const gridClass =
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7.5';

    if (isLoading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: pageSize }).map((_, i) => (
                    <PatientCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {patients.map((item) => (
                <DiscoveryPatientCard key={item.patientId} item={item} />
            ))}
        </div>
    );
}