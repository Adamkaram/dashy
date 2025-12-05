'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeaderProps } from '@/lib/theme/component-types';

export default function Header({ tenant }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            name: 'تسوق',
            href: '/shop',
            hasDropdown: true,
            items: [
                { name: 'وصل حديثاً', href: '/new-arrivals' },
                { name: 'الأكثر مبيعاً', href: '/best-sellers' },
                { name: 'العروض', href: '/sale' },
                { name: 'المجموعات', href: '/collections' }
            ]
        },
        { name: 'عن العلامة', href: '/about', hasDropdown: false },
        { name: 'المجموعات', href: '/collections', hasDropdown: false },
        { name: 'تواصل معنا', href: '/contact', hasDropdown: false },
    ];

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10, height: 0, overflow: 'hidden' },
        visible: {
            opacity: 1,
            y: 0,
            height: 'auto',
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: -10,
            height: 0,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50">
                        <h1 className={cn(
                            "text-2xl font-bold tracking-widest uppercase transition-colors",
                            isScrolled ? "text-black" : "text-black" // Always black for this theme style usually, or white if hero is dark. Let's assume black for now based on reference.
                        )}>
                            {tenant?.name || 'URBAN VOGUE'}
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative group"
                                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium tracking-wide hover:text-gray-600 transition-colors uppercase",
                                        isScrolled ? "text-gray-900" : "text-gray-900"
                                    )}
                                >
                                    {link.name}
                                </Link>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {activeDropdown === link.name && link.hasDropdown && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={dropdownVariants}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white shadow-lg rounded-sm border border-gray-100 overflow-hidden"
                                        >
                                            <div className="py-2">
                                                {link.items?.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors text-right"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-6">
                        <button className={cn("hover:text-gray-600 transition-colors", isScrolled ? "text-gray-900" : "text-gray-900")}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className={cn("hover:text-gray-600 transition-colors", isScrolled ? "text-gray-900" : "text-gray-900")}>
                            <User className="w-5 h-5" />
                        </button>
                        <button className={cn("relative hover:text-gray-600 transition-colors", isScrolled ? "text-gray-900" : "text-gray-900")}>
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">0</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-gray-900"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white z-40 md:hidden pt-24 px-6"
                    >
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <div key={link.name} className="border-b border-gray-100 pb-4">
                                    <Link
                                        href={link.href}
                                        className="text-lg font-medium text-gray-900 uppercase tracking-wide block mb-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                    {link.hasDropdown && (
                                        <div className="flex flex-col gap-3 pr-4">
                                            {link.items?.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="text-sm text-gray-500"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
