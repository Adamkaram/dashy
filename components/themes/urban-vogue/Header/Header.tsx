'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HeaderProps } from '@/lib/theme/component-types';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Header({ tenant }: HeaderProps) {
    const pathname = usePathname();
    const isCheckout = pathname === '/checkout';
    const [isScrolled, setIsScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const { getTotalItems, items, getTotalPrice, updateQuantity, removeFromCart } = useCart();
    const cartItemsCount = getTotalItems();
    const subtotal = getTotalPrice();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show solid header (white background + black logo) if scrolled OR if on checkout page
    const showSolidHeader = isScrolled || isCheckout;

    const navLinks = [
        {
            name: 'Second Skin Collection',
            href: '/collections/winter-2025-collection',
            hasDropdown: false,
        },
        { name: 'A La Plage', href: '/collections/a-la-plage', hasDropdown: false },
        { name: 'Timeless Threads', href: '/collections/timeless-threads', hasDropdown: false },
        { name: 'Jeans', href: '/collections/jeans', hasDropdown: false },
        { name: 'Jackets', href: '/collections/jackets', hasDropdown: false },
        { name: 'Quarter Zips', href: '/collections/denim-quarter-zips', hasDropdown: false },
        { name: 'Sale', href: '/collections/sale', hasDropdown: false },
        { name: 'About', href: '/pages/about-us', hasDropdown: false },
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    showSolidHeader ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4",
                    "border-b border-transparent",
                    showSolidHeader && "border-gray-100"
                )}
            >
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-14">
                        {/* Left: Hamburger (Drawer Toggle) */}
                        <div className="flex-1 flex justify-start">
                            <button
                                className={cn("hover:text-gray-600 transition-colors", showSolidHeader ? "text-gray-900" : "text-gray-900")}
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex-1 flex justify-center">
                            <Link href="/" className="relative z-50">
                                <img
                                    src={showSolidHeader ? "/themes/urban-vogue/IINSAN-WITHOUT-BK.png" : "/themes/urban-vogue/LOGO-IINSAN-PNG.png"}
                                    alt={tenant?.name || 'URBAN VOGUE'}
                                    className="h-28 md:h-44 w-auto object-contain transition-all duration-300"
                                />
                            </Link>
                        </div>

                        {/* Right: Icons */}
                        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
                            {/* Search hidden on small screens if needed, or kept */}
                            <button className={cn("hover:text-gray-600 transition-colors", showSolidHeader ? "text-gray-900" : "text-gray-900")}>
                                <Search className="w-5 h-5" />
                            </button>

                            <button className={cn("hidden md:block hover:text-gray-600 transition-colors", showSolidHeader ? "text-gray-900" : "text-gray-900")}>
                                <User className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setCartOpen(true)}
                                className={cn("relative hover:text-gray-600 transition-colors", showSolidHeader ? "text-gray-900" : "text-gray-900")}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-montserrat">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Drawer (Slide from Left) */}
            <AnimatePresence>
                {drawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDrawerOpen(false)}
                            className="fixed inset-0 bg-black z-50"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[60] shadow-xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-lg font-bold">MENU</h2>
                                    <button
                                        onClick={() => setDrawerOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-50 text-black"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="block py-3 text-base font-medium text-gray-900 hover:text-gray-600 border-b border-gray-50 uppercase tracking-wide font-montserrat transition-colors"
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: navLinks.length * 0.05 }}
                                        className="mt-6 pt-6 border-t border-gray-100"
                                    >
                                        <Link
                                            href="/account"
                                            className="block py-2 text-base font-medium text-gray-600 hover:text-black uppercase tracking-wide font-montserrat"
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                    </motion.div>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Cart Drawer (Slide from Right) */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCartOpen(false)}
                            className="fixed inset-0 bg-black z-50 cursor-crosshair"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                                <h2 className="text-xl font-bold uppercase tracking-wide">Shopping Bag ({cartItemsCount})</h2>
                                <button
                                    onClick={() => setCartOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <ShoppingBag className="w-16 h-16 text-gray-200" />
                                        <p className="text-gray-500 font-medium">Your bag is empty.</p>
                                        <button
                                            onClick={() => setCartOpen(false)}
                                            className="text-black font-medium underline underline-offset-4 hover:opacity-70"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    items.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex gap-4">
                                            <div className="relative w-24 h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-medium text-gray-900 leading-snug pr-4">{item.name}</h3>
                                                        <button
                                                            onClick={() => removeFromCart(item.id, item.selectedOptions)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Options Display */}
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, val]) => (
                                                            <span key={key} className="text-[10px] uppercase text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                                {val}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center mt-3 border border-gray-200 w-max bg-white">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.selectedOptions, item.quantity - 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                                                            aria-label="Decrease quantity"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.selectedOptions, item.quantity + 1)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-600 hover:text-black transition-colors"
                                                            aria-label="Increase quantity"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-900 text-right mt-1">EGP {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600 font-medium">Subtotal</span>
                                        <span className="text-xl font-bold text-gray-900">EGP {subtotal.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-6 text-center">Shipping & taxes calculated at checkout</p>
                                    <div className="space-y-3">
                                        <Link
                                            href="/checkout"
                                            onClick={() => setCartOpen(false)}
                                            className="block w-full py-4 bg-black text-white text-center font-bold tracking-wide uppercase hover:bg-gray-900 transition-colors rounded-lg shadow-lg hover:translate-y-[-2px] active:translate-y-[0px]"
                                        >
                                            Checkout
                                        </Link>
                                        <Link
                                            href="/cart"
                                            onClick={() => setCartOpen(false)}
                                            className="block w-full py-4 bg-white border border-gray-200 text-black text-center font-bold tracking-wide uppercase hover:bg-gray-50 transition-colors rounded-lg"
                                        >
                                            View Cart
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
