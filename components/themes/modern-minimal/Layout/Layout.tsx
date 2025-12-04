'use client';

import { LayoutProps } from '@/lib/theme/component-types';

export default function ModernLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-black selection:bg-black selection:text-white">
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
