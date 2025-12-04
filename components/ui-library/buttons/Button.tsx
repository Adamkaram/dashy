'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        loading = false,
        disabled,
        children,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    {
                        // Variants
                        'bg-primary text-white hover:bg-primary/90 focus:ring-primary':
                            variant === 'primary',
                        'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary':
                            variant === 'secondary',
                        'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary':
                            variant === 'outline',
                        'text-primary hover:bg-primary/10 focus:ring-primary':
                            variant === 'ghost',
                        'bg-error text-white hover:bg-error/90 focus:ring-error':
                            variant === 'danger',

                        // Sizes
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2.5 text-base': size === 'md',
                        'px-6 py-3 text-lg': size === 'lg',

                        // Full width
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
