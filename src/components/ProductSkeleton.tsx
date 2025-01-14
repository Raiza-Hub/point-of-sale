export default function ProductSkeleton() {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className=" space-y-2">
                        <div className="relative w-full h-32 animate-pulse overflow-hidden rounded-lg bg-gray-200">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent animate-[shimmer_1.5s_infinite]" />
                        </div>

                        <div className="h-6 w-full animate-pulse rounded-md bg-gray-200" />
                    </div>
                ))}
            </div>
        </div>
    );
}