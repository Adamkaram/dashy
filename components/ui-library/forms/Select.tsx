'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({
        className,
        label,
        error,
        helperText,
        options,
        placeholder,
        fullWidth = true,
        ...props
    }, ref) => {
        return (
            <div className={cn('flex flex-col gap-2', fullWidth && 'w-full')}>
                {label && (
                    <label className="text-sm font-medium text-foreground">
                        {label}
                        {props.required && <span className="text-error mr-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'px-4 py-2.5 rounded-lg border transition-all outline-none appearance-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'bg-white bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
                        'bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat',
                        error
                            ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                            : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="text-sm text-error flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </p>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
