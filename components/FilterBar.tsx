'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
    count: number;
    onSortChange: (sort: string) => void;
    onFilterChange: (filter: string) => void;
    onReset: () => void;
    providers: string[];
}

export default function FilterBar({ count, onSortChange, onFilterChange, onReset, providers }: FilterBarProps) {
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedSort, setSelectedSort] = useState('المتميز');
    const [selectedFilter, setSelectedFilter] = useState('الكل');

    const sortOptions = [
        { label: 'المتميز', value: 'featured' },
        { label: 'الأحدث', value: 'newest' },
        { label: 'الأقدم', value: 'oldest' },
        { label: 'السعر: من الأقل للأعلى', value: 'price_asc' },
        { label: 'السعر: من الأعلى للأقل', value: 'price_desc' },
    ];

    const handleSortSelect = (option: typeof sortOptions[0]) => {
        setSelectedSort(option.label);
        setShowSortMenu(false);
        onSortChange(option.value);
    };

    const handleFilterSelect = (provider: string) => {
        const label = provider === 'all' ? 'الكل' : provider;
        setSelectedFilter(label);
        setShowFilterMenu(false);
        onFilterChange(provider);
    };

    const handleReset = () => {
        setSelectedSort('المتميز');
        setSelectedFilter('الكل');
        setShowSortMenu(false);
        setShowFilterMenu(false);
        onReset();
    };

    return (
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
            </div>

            {/* Left Side: Count */}
            <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#FF6500]">{count}</span>
                <span className="text-sm text-[#46423D]">خدمات</span>
            </div>
        </div>
    );
}
