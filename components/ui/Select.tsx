'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

export function Select({ value, onChange, options, placeholder = 'اختر...', className }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-[60px] px-4 flex items-center justify-between",
                    "bg-gray-50 border border-gray-100 rounded-xl",
                    "text-[#46423D] text-base",
                    "hover:bg-white hover:border-[black]/20",
                    "focus:bg-white focus:ring-2 focus:ring-[black]/20 focus:border-[black]",
                    "outline-none transition-all",
                    className
                )}
            >
                <span className={selectedOption ? "text-[#46423D]" : "text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-5 h-5 text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[300px] overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 text-sm text-right",
                                        "hover:bg-gray-50 transition-colors",
                                        isSelected && "bg-gray-50"
                                    )}
                                >
                                    <span className={cn(
                                        "text-gray-900",
                                        isSelected && "font-medium"
                                    )}>
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <Check className="w-4 h-4 text-[#FF6500]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
