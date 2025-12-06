'use client';

import { usePathname } from 'next/navigation';
import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { Layout } = useThemeComponents();

    // Check if the current path is an admin route or login page
    const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    // For dashboard, render without theme layout
    if (isDashboard) {
        return (
            <main className="min-h-screen bg-gray-100">
                {children}
            </main>
        );
    }

    // For storefront, use theme's Layout component
    if (Layout) {
        return <Layout>{children}</Layout>;
    }

    // Fallback if no theme layout
    return <main className="min-h-screen">{children}</main>;
}
