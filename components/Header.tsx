'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* Header - Sarainah Exact Clone */}
            <header className="sarainah-header relative h-24 md:h-32">
                <div className="container mx-auto px-4 md:px-8 h-full">
                    <div className="flex items-center justify-between h-full relative">
                        {/* Mobile Menu Button - Right Side (RTL) */}
                        <button
                            className="md:hidden text-white hover:text-[#8F6B43] p-2 z-20"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>

                        {/* Navigation Links - Right Side - Hidden on mobile */}
                        <nav className="hidden md:flex items-center gap-6 z-20">
                            <Link href="/" className="text-white hover:text-white/80 font-bold text-lg transition-colors">
                                الرئيسية
                            </Link>
                            <Link href="/about" className="text-white hover:text-white/80 font-bold text-lg transition-colors">
                                عن الموقع
                            </Link>
                            <Link href="/contact" className="text-white hover:text-white/80 font-bold text-lg transition-colors">
                                اتصل بنا
                            </Link>
                        </nav>

                        {/* Logo - Absolute Center (All Screens) */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <Link href="/">
                                <img
                                    src="/logo/Logo.png"
                                    alt="ماى مومنت"
                                    className="w-40 md:w-64 lg:w-80 max-w-none object-contain drop-shadow-lg"
                                />
                            </Link>
                        </div>

                        {/* Actions - Left Side */}
                        <div className="flex items-center gap-3 z-20">
                            {/* Location Indicator - Always Visible */}
                            <div className="flex items-center gap-1.5 text-white border border-white bg-white/10 cursor-default px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                <span className="text-sm font-bold">الكويت</span>
                            </div>


                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[320px] bg-gradient-to-br from-[#53131C] to-[#3D0E14] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/20">
                        <span className="text-2xl font-bold text-white">القائمة</span>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-white hover:text-[#8F6B43] transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2 flex-1">
                        <Link
                            href="/"
                            className="text-white hover:bg-white/10 font-medium text-lg py-3 px-4 rounded-lg transition-all"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            الرئيسية
                        </Link>
                        <Link
                            href="/about"
                            className="text-white hover:bg-white/10 font-medium text-lg py-3 px-4 rounded-lg transition-all"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            عن الموقع
                        </Link>
                        <Link
                            href="/contact"
                            className="text-white hover:bg-white/10 font-medium text-lg py-3 px-4 rounded-lg transition-all"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            اتصل بنا
                        </Link>

                        <div className="border-t border-white/20 my-4"></div>

                        {/* Location */}
                        <div className="flex items-center gap-3 text-white/80 py-3 px-4">
                            <svg className="w-5 h-5 text-[#8F6B43]" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                            <span className="font-medium">الكويت</span>
                        </div>


                    </nav>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/20">
                        <p className="text-white/60 text-sm text-center">
                            © 2025 ماى مومنت
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
