'use client';

import '../urban-vogue.css'; // Urban Vogue theme styles
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LayoutProps } from '@/lib/theme/component-types';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <div className="urban-vogue-theme min-h-screen bg-white font-vogue" dir="ltr">
            <Header />
            {!isHome && <div className="border-b border-gray-200"></div>}
            <main className={cn(
                "min-h-screen bg-white",
                !isHome && "py-24"
            )}>
                {children}
            </main>
            <div className="border-t border-gray-200"></div>
            <Footer />
        </div>
    );
}