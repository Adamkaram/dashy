'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import ServiceCard from './ServiceCard';

interface FilterBarClientProps {
    initialCount: number;
    initialServices: any[];
    providers: string[];
    hasSubCategories: boolean;
}

export default function FilterBarClient({
    initialCount,
    initialServices,
    providers,
    hasSubCategories
}: FilterBarClientProps) {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedSort, setSelectedSort] = useState('المتميز');
    const [selectedFilter, setSelectedFilter] = useState('الكل');
    const [sortBy, setSortBy] = useState('featured');
    const [filterProvider, setFilterProvider] = useState('all');

    const sortOptions = [
        { label: 'المتميز', value: 'featured' },
        { label: 'الأحدث', value: 'newest' },
        { label: 'الأقدم', value: 'oldest' },
        { label: 'السعر: من الأقل للأعلى', value: 'price_asc' },
        { label: 'السعر: من الأعلى للأقل', value: 'price_desc' },
    ];

    // Filter and Sort Logic
    const filteredAndSortedItems = useMemo(() => {
        if (hasSubCategories) return [];

        let items = [...initialServices];

        // Apply Provider Filter
        if (filterProvider !== 'all') {
            items = items.filter(service => service.provider_name === filterProvider);
        }

        // Apply Sorting
        switch (sortBy) {
            case 'newest':
                items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'oldest':
                items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case 'price_asc':
                items.sort((a, b) => (a.base_price || 0) - (b.base_price || 0));
                break;
            case 'price_desc':
                items.sort((a, b) => (b.base_price || 0) - (a.base_price || 0));
                break;
            case 'featured':
            default:
                break;
        }

        return items;
    }, [initialServices, sortBy, filterProvider, hasSubCategories]);

    const handleSortSelect = (option: typeof sortOptions[0]) => {
        setSelectedSort(option.label);
        setShowSortMenu(false);
        setSortBy(option.value);
    };

    const handleFilterSelect = (provider: string) => {
        const label = provider === 'all' ? 'الكل' : provider;
        setSelectedFilter(label);
        setShowFilterMenu(false);
        setFilterProvider(provider);
    };

    const handleReset = () => {
        setSelectedSort('المتميز');
        setSelectedFilter('الكل');
        setShowSortMenu(false);
        setShowFilterMenu(false);
        setSortBy('featured');
        setFilterProvider('all');
    };

    const displayCount = hasSubCategories ? initialCount : filteredAndSortedItems.length;

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#F9F7F5] p-4 rounded-xl border border-[#E5E0D8]">
                {/* Right Side: Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-[#FF9D23] text-white text-sm font-medium rounded-lg hover:bg-[#FF6500] transition-colors"
                    >
                        إعادة تعيين
                    </button>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E0D8] rounded-lg text-[#46423D] text-sm hover:border-[#FF9D23] transition-colors"
                        >
                            <span>{selectedSort}</span>
                            <ChevronDown className={`w-4 h-4 text-[#FF9D23] transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showSortMenu && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E5E0D8] rounded-lg shadow-lg z-10">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortSelect(option)}
                                        className="w-full text-right px-4 py-2 text-sm text-[#46423D] hover:bg-[#F9F7F5] transition-colors first:rounded-t-lg last:rounded-b-lg"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <span className="text-sm text-[#FF6500] font-medium">ترتيب بواسطة</span>

                    {/* Filter Dropdown */}
                    {providers.length > 0 && (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#EBE5DE] border border-transparent rounded-lg text-[#46423D] text-sm hover:bg-[#E0D8CF] transition-colors"
                                >
                                    <span>{selectedFilter}</span>
                                    <ChevronDown className={`w-4 h-4 text-[#FF9D23] transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showFilterMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E5E0D8] rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                                        <button
                                            onClick={() => handleFilterSelect('all')}
                                            className="w-full text-right px-4 py-2 text-sm text-[#46423D] hover:bg-[#F9F7F5] transition-colors rounded-t-lg"
                                        >
                                            الكل
                                        </button>
                                        {providers.map((provider) => (
                                            <button
                                                key={provider}
                                                onClick={() => handleFilterSelect(provider)}
                                                className="w-full text-right px-4 py-2 text-sm text-[#46423D] hover:bg-[#F9F7F5] transition-colors last:rounded-b-lg"
                                            >
                                                {provider}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <span className="text-sm text-[#FF6500] font-medium">فلتره بواسطة الشركات</span>
                        </>
                    )}
                </div>

                {/* Left Side: Count */}
                <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-[#FF6500]">{displayCount}</span>
                    <span className="text-sm text-[#46423D]">خدمات</span>
                </div>
            </div>

            {/* Render filtered services if not showing subcategories */}
            {!hasSubCategories && filteredAndSortedItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedItems.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            )}
        </>
    );
}
