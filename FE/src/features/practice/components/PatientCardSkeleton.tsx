export function PatientCardSkeleton() {
    return (
        <div
            className="relative w-full h-100 sm:h-110 xl:h-120 bg-white rounded-[10px] overflow-hidden border border-gray-100 animate-pulse"
            aria-hidden="true"
        >
            {/* Image placeholder */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gray-200" />

            {/* Content placeholder */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-[10px] px-5 py-5 xl:px-6 xl:py-6 flex flex-col justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="h-5 w-24 bg-gray-200 rounded" />
                        <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-px w-full bg-gray-100" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between items-center gap-3">
                    <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg shrink-0" />
                </div>
            </div>
        </div>
    );
}