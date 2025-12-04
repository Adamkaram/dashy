'use client';

import { usePathname } from 'next/navigation';
import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { Header, Footer } = useThemeComponents();

    // Check if the current path is an admin route or login page
    const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <>
            {!isDashboard && <Header />}
            <main className={`min-h-screen ${!isDashboard ? '' : 'bg-gray-100'}`} style={!isDashboard ? { backgroundColor: '#F0EBE5' } : {}}>
                {children}
            </main>
            {!isDashboard && <Footer />}
        </>
    );
}
