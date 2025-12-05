'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="text-2xl md:text-3xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                        ELEGANT
                    </Link>

                    {/* Desktop Navigation - Minimal */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors">
                            المميزات
                        </Link>
                        <Link href="#about" className="text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors">
                            من نحن
                        </Link>
                        <Link href="#contact" className="text-white/80 hover:text-white text-sm uppercase tracking-wider transition-colors">
                            تواصل
                        </Link>
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link
                            href="#signup"
                            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                        >
                            ابدأ الآن
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
                    <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
                        <Link
                            href="#features"
                            className="text-white/80 hover:text-white py-2 text-lg uppercase tracking-wider transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            المميزات
                        </Link>
                        <Link
                            href="#about"
                            className="text-white/80 hover:text-white py-2 text-lg uppercase tracking-wider transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            من نحن
                        </Link>
                        <Link
                            href="#contact"
                            className="text-white/80 hover:text-white py-2 text-lg uppercase tracking-wider transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            تواصل
                        </Link>
                        <Link
                            href="#signup"
                            className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-center mt-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            ابدأ الآن
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
