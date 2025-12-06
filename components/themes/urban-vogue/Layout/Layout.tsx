'use client';

import '../urban-vogue.css'; // Urban Vogue theme styles
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LayoutProps } from '@/lib/theme/component-types';

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="urban-vogue-theme min-h-screen bg-white font-vogue" dir="ltr">
            <Header />
            <div className="border-b border-gray-200"></div>
            <main className="min-h-screen bg-white py-24">
                {children}
            </main>
            <div className="border-t border-gray-200"></div>
            <Footer />
        </div>
    );
}
