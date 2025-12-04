'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface StackProps {
    children: ReactNode;
    direction?: 'row' | 'column';
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    className?: string;
}

export function Stack({
    children,
    direction = 'column',
    spacing = 'md',
    align = 'stretch',
    justify = 'start',
    className
}: StackProps) {
    return (
        <div
            className={cn(
                'flex',
                {
                    // Direction
                    'flex-row': direction === 'row',
                    'flex-col': direction === 'column',

                    // Spacing
                    'gap-2': spacing === 'xs',
                    'gap-4': spacing === 'sm',
                    'gap-6': spacing === 'md',
                    'gap-8': spacing === 'lg',
                    'gap-12': spacing === 'xl',

                    // Align
                    'items-start': align === 'start',
                    'items-center': align === 'center',
                    'items-end': align === 'end',
                    'items-stretch': align === 'stretch',

                    // Justify
                    'justify-start': justify === 'start',
                    'justify-center': justify === 'center',
                    'justify-end': justify === 'end',
                    'justify-between': justify === 'between',
                    'justify-around': justify === 'around',
                },
                className
            )}
        >
            {children}
        </div>
    );
}
