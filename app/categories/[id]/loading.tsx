export default function CategoryLoading() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FFEDD5' }} dir="rtl">
            <section className="sec-padding page sub-category-page py-8" style={{ backgroundColor: '#FFEDD5' }}>
                {/* Header Skeleton */}
                <header className="py-5 bg-gradient-burgundy mb-8 rounded-xl mx-6 md:mx-12 shadow-lg">
                    <div className="container mx-auto px-8 md:px-16">
                        <div className="h-6 w-48 bg-white/20 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-64 bg-white/10 rounded animate-pulse"></div>
                    </div>
                </header>

                {/* Filter Bar Skeleton */}
                <div className="container mx-auto px-6 md:px-12">
                    <div className="bg-[#F9F7F5] p-4 rounded-xl border border-[#E5E0D8] mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3">
                                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>

                    {/* Cards Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[400px] bg-white rounded-2xl overflow-hidden shadow-sm">
                                <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
