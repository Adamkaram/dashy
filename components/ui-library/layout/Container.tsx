'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Container({
    children,
    className,
    maxWidth = 'xl'
}: ContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto px-4 sm:px-6 lg:px-8',
                {
                    'max-w-screen-sm': maxWidth === 'sm',
                    'max-w-screen-md': maxWidth === 'md',
                    'max-w-screen-lg': maxWidth === 'lg',
                    'max-w-screen-xl': maxWidth === 'xl',
                    'max-w-screen-2xl': maxWidth === '2xl',
                    'max-w-full': maxWidth === 'full',
                },
                className
            )}
        >
            {children}
        </div>
    );
}
