'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { Container, Button } from '@/components/ui-library';
import { HeaderProps } from '@/lib/theme/component-types';

export default function ModernHeader({ tenant }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <Container maxWidth="xl">
                <div className="flex items-center justify-between h-[70px]">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold tracking-tighter text-black">
                            {tenant?.name || 'MODERN.'}
                        </Link>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            الرئيسية
                        </Link>
                        <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            خدماتنا
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            من نحن
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            اتصل بنا
                        </Link>
                    </nav>

                    {/* Actions - Right */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-600 hover:text-black transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-black transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
                        </button>
                        <Button variant="primary" size="sm" className="hidden md:flex bg-black text-white hover:bg-gray-800 rounded-full px-6">
                            احجز الآن
                        </Button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-black"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </Container>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 py-4 shadow-lg">
                    <Container>
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="text-lg font-medium text-black py-2 border-b border-gray-50">
                                الرئيسية
                            </Link>
                            <Link href="/services" className="text-lg font-medium text-black py-2 border-b border-gray-50">
                                خدماتنا
                            </Link>
                            <Link href="/about" className="text-lg font-medium text-black py-2 border-b border-gray-50">
                                من نحن
                            </Link>
                            <Link href="/contact" className="text-lg font-medium text-black py-2 border-b border-gray-50">
                                اتصل بنا
                            </Link>
                            <Button variant="primary" fullWidth className="mt-4 bg-black text-white rounded-full">
                                احجز الآن
                            </Button>
                        </nav>
                    </Container>
                </div>
            )}
        </header>
    );
}
