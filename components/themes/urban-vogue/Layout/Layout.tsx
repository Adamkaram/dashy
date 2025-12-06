'use client';

import '../urban-vogue.css'; // Urban Vogue theme styles
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LayoutProps } from '@/lib/theme/component-types';

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-white font-vogue" dir="ltr">
            <Header />
            <div className="border-b border-gray-200"></div>
            <main className="min-h-screen bg-white pt-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
