'use client';

import { cn } from '@/lib/utils';
import { format, addMonths, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
}

export function DatePicker({ value, onChange, disabled }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [month, setMonth] = useState(value || new Date());

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-[60px] px-4 flex items-center justify-between",
                    "bg-gray-50 border border-gray-100 rounded-xl",
                    "text-[#46423D] text-base",
                    "hover:bg-white hover:border-[#966428]/20",
                    "focus:bg-white focus:ring-2 focus:ring-[#966428]/20 focus:border-[#966428]",
                    "outline-none transition-all"
                )}
            >
                <span className={value ? "text-[#46423D]" : "text-gray-400"}>
                    {value ? format(value, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                </span>
                <CalendarIcon className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Calendar Popup */}
                    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                        {/* Custom Header with Navigation */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setMonth(subMonths(month, 1))}
                                    className={cn(
                                        "flex size-7 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition",
                                        "border-gray-200 text-gray-600 hover:text-gray-800",
                                        "hover:bg-gray-50 active:bg-gray-100"
                                    )}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="text-sm font-medium text-gray-900">
                                {format(month, 'MMMM yyyy', { locale: ar })}
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setMonth(addMonths(month, 1))}
                                    className={cn(
                                        "flex size-7 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition",
                                        "border-gray-200 text-gray-600 hover:text-gray-800",
                                        "hover:bg-gray-50 active:bg-gray-100"
                                    )}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="p-3">
                            <DayPicker
                                mode="single"
                                selected={value}
                                onSelect={(date) => {
                                    onChange(date);
                                    setIsOpen(false);
                                }}
                                month={month}
                                onMonthChange={setMonth}
                                disabled={disabled}
                                locale={ar}
                                showOutsideDays={false}
                                disableNavigation={true} // Disable default navigation arrows
                                className="rdp-custom"
                                classNames={{
                                    months: 'flex',
                                    month: 'space-y-4 w-full',
                                    caption: 'hidden', // Hide default caption since we have custom header
                                    nav: 'hidden', // Hide default navigation
                                    table: 'w-full border-collapse border-spacing-y-1',
                                    head_row: 'flex',
                                    head_cell: 'w-10 font-medium text-xs text-center text-gray-400 pb-2',
                                    row: 'flex w-full mt-1',
                                    cell: cn(
                                        'relative p-0 text-center text-sm',
                                        'focus-within:relative focus-within:z-20'
                                    ),
                                    day: cn(
                                        'size-10 p-0 font-normal rounded-md text-sm text-gray-900',
                                        'hover:bg-gray-100 active:bg-gray-200',
                                        'outline outline-offset-2 outline-0 focus-visible:outline-2 outline-[#FF6500]'
                                    ),
                                    day_selected: cn(
                                        'bg-[#FF6500] text-white',
                                        'hover:bg-[#FF6500] hover:text-white',
                                        'focus:bg-[#FF6500] focus:text-white'
                                    ),
                                    day_today: 'font-semibold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#FF6500] after:rounded-full',
                                    day_outside: 'text-gray-400 opacity-50',
                                    day_disabled: 'text-gray-300 line-through opacity-50 cursor-not-allowed hover:bg-transparent',
                                    day_hidden: 'invisible',
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
