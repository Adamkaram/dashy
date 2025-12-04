'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { HeaderProps } from '@/lib/theme/component-types';

export default function Header({ tenant, user }: HeaderProps) {
    // Default theme colors - can be customized via theme config later
    const primaryColor = '#53131C';
    const secondaryColor = '#8F6B43';

    return (
        <header
            className="sarainah-header"
            style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                padding: '1.5rem 0',
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-8 relative">
                    {/* Navigation Links - Right Side (RTL) */}
                    <nav className="hidden lg:flex items-center gap-10 z-10">
                        <Link
                            href="/about"
                            className="text-white text-[1.0625rem] font-bold hover:opacity-80 transition-opacity"
                        >
                            عن الموقع
                        </Link>
                        <Link
                            href="/services"
                            className="text-white text-[1.0625rem] font-bold hover:opacity-80 transition-opacity"
                        >
                            الخدمات
                        </Link>
                        <Link
                            href="/contact"
                            className="text-white text-[1.0625rem] font-bold hover:opacity-80 transition-opacity"
                        >
                            اتصل بنا
                        </Link>
                    </nav>

                    {/* Logo - Centered */}
                    <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:transform-none">
                        <Link href="/" className="block">
                            <Image
                                src="/logo/Logo.png"
                                alt={tenant?.name || 'Logo'}
                                width={100}
                                height={100}
                                className="h-16 lg:h-[5.5rem] xl:h-[6.5rem] w-auto hover:opacity-80 transition-opacity"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Actions - Left Side (RTL) */}
                    <div className="hidden lg:flex items-center gap-5 z-10">
                        {/* Language Switcher */}
                        <Link
                            href="/en"
                            className="flex items-center gap-2 px-3 py-2 border border-white rounded-md text-white text-sm font-medium hover:bg-white/10 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            English
                        </Link>

                        {/* Login Link */}
                        {!user ? (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 bg-[#8B6F63] rounded-md text-white text-sm font-semibold hover:bg-[#6B5349] transition-all shadow-sm hover:shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                تسجيل الدخول
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 text-white">
                                <span className="text-sm">مرحباً، {user.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
