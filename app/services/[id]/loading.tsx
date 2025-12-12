export default function ServiceLoading() {
    return (
        <div dir="rtl" className="min-h-screen" style={{ backgroundColor: '#FFEDD5' }}>
            <section className="sec-padding page service-details-page py-8" style={{ backgroundColor: '#FFEDD5' }}>
                {/* Header Skeleton */}
                <header className="py-5 bg-gradient-burgundy mb-8 rounded-xl mx-6 md:mx-12 shadow-lg">
                    <div className="container mx-auto px-8 md:px-16">
                        <div className="h-6 w-64 bg-white/20 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 w-80 bg-white/10 rounded animate-pulse"></div>
                    </div>
                </header>

                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Gallery Skeleton */}
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl">
                                <div className="h-[300px] md:h-[450px] lg:h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="w-full lg:w-1/2">
                            {/* Provider Info */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Title */}
                            <div className="h-8 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>

                            {/* Price Card */}
                            <div className="bg-white border border-[#E6D2CE] rounded-2xl p-5 mb-8">
                                <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>

                            {/* Description */}
                            <div className="bg-white/50 p-6 rounded-2xl mb-8">
                                <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            {/* Booking Form Skeleton */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <div className="h-8 w-48 bg-gray-200 rounded mb-8 mx-auto animate-pulse"></div>
                                <div className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="h-[60px] bg-gray-100 rounded-xl animate-pulse"></div>
                                        <div className="h-[60px] bg-gray-100 rounded-xl animate-pulse"></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="h-[60px] bg-gray-100 rounded-xl animate-pulse"></div>
                                        <div className="h-[60px] bg-gray-100 rounded-xl animate-pulse"></div>
                                    </div>
                                    <div className="h-[60px] bg-gray-100 rounded-xl animate-pulse"></div>
                                    <div className="h-14 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
