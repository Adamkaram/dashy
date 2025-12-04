'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'filled' | 'outlined';
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        label,
        error,
        helperText,
        variant = 'default',
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
                <input
                    ref={ref}
                    className={cn(
                        'px-4 py-2.5 rounded-lg border transition-all outline-none',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'placeholder:text-gray-400',
                        {
                            'border-gray-300 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20':
                                variant === 'default' && !error,
                            'border-transparent bg-gray-100 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20':
                                variant === 'filled' && !error,
                            'border-2 border-gray-300 focus:border-primary':
                                variant === 'outlined' && !error,
                            'border-error focus:border-error focus:ring-2 focus:ring-error/20':
                                error,
                        },
                        className
                    )}
                    {...props}
                />
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

Input.displayName = 'Input';
