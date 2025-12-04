'use client';

import type { LayoutProps } from '@/lib/theme/component-types';

export default function MainLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col" dir="rtl">
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
