'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User, Heart, Menu, X } from 'lucide-react';
import { HeaderProps } from '@/lib/theme/component-types';

export default function ModernHeader({ tenant }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount] = useState(3); // Mock cart count

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-black text-white text-xs py-2">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <span>شحن مجاني للطلبات فوق 500 ريال</span>
                    <div className="flex gap-4">
                        <Link href="/track-order" className="hover:text-gray-300">تتبع طلبك</Link>
                        <Link href="/help" className="hover:text-gray-300">المساعدة</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-black">
                        {tenant?.name || 'SHOP'}
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="ابحث عن المنتجات..."
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Wishlist */}
                        <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full relative">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                2
                            </span>
                        </button>

                        {/* Account */}
                        <Link href="/login" className="hidden md:block p-2 hover:bg-gray-100 rounded-full">
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100">
                    <Link href="/new-arrivals" className="text-sm font-medium hover:text-gray-600">
                        وصل حديثاً
                    </Link>
                    <Link href="/best-sellers" className="text-sm font-medium hover:text-gray-600">
                        الأكثر مبيعاً
                    </Link>
                    <Link href="/categories" className="text-sm font-medium hover:text-gray-600">
                        جميع الفئات
                    </Link>
                    <Link href="/deals" className="text-sm font-medium text-red-600 hover:text-red-700">
                        العروض 🔥
                    </Link>
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="container mx-auto px-4 py-4">
                        {/* Mobile Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="ابحث عن المنتجات..."
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-black"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex flex-col gap-3">
                            <Link href="/new-arrivals" className="py-2 text-sm font-medium border-b border-gray-100">
                                وصل حديثاً
                            </Link>
                            <Link href="/best-sellers" className="py-2 text-sm font-medium border-b border-gray-100">
                                الأكثر مبيعاً
                            </Link>
                            <Link href="/categories" className="py-2 text-sm font-medium border-b border-gray-100">
                                جميع الفئات
                            </Link>
                            <Link href="/deals" className="py-2 text-sm font-medium text-red-600 border-b border-gray-100">
                                العروض 🔥
                            </Link>
                            <Link href="/login" className="py-2 text-sm font-medium border-b border-gray-100">
                                حسابي
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
