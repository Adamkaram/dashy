'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeaderProps } from '@/lib/theme/component-types';
import { useCart } from '@/context/CartContext';

export default function Header({ tenant }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { getTotalItems } = useCart();
    const cartItemsCount = getTotalItems();

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
                { name: 'وصل حديثاً', href: '/shop?sort=newest' },
                { name: 'الأكثر مبيعاً', href: '/shop?sort=bestsellers' },
                { name: 'العروض', href: '/shop?filter=sale' },
                { name: 'المجموعات', href: '/shop?filter=collections' }
            ]
        },
        { name: 'عن العلامة', href: '/about', hasDropdown: false },
        { name: 'المجموعات', href: '/shop', hasDropdown: false },
        { name: 'تواصل معنا', href: '/contact', hasDropdown: false },
    ];

    const dropdownVariants: Variants = {
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
                            "text-2xl font-bold tracking-widest uppercase transition-colors font-montserrat",
                            isScrolled ? "text-black" : "text-black"
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
                                        "text-sm font-medium tracking-wide hover:text-gray-600 transition-colors uppercase font-montserrat",
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
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors text-right font-montserrat"
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
                        <Link href="/cart" className={cn("relative hover:text-gray-600 transition-colors", isScrolled ? "text-gray-900" : "text-gray-900")}>
                            <ShoppingBag className="w-5 h-5" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-montserrat">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

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
                                        className="text-lg font-medium text-gray-900 uppercase tracking-wide block mb-2 font-montserrat"
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
                                                    className="text-sm text-gray-500 font-montserrat"
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
