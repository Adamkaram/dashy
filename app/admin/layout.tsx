'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import './admin.css'; // Admin-specific styles
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Image as ImageIcon,
    Settings,
    LogOut,
    Menu,
    ChevronRight,
    Globe,
    ClipboardList,
    Ticket,
    Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation items for icon column
const navigation = [
    { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    { name: 'الطلبات', href: '/admin/orders', icon: ClipboardList },
    { name: 'الكوبونات', href: '/admin/coupons', icon: Ticket },
    { name: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
    { name: 'الخدمات', href: '/admin/services', icon: Package },
    { name: 'شرائح Hero', href: '/admin/hero-slides', icon: ImageIcon },
    { name: 'المظهر', href: '/admin/themes', icon: Palette },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
];

// Grouped navigation for right column
const navigationGroups = [
    {
        title: 'المحتوى',
        items: [
            { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
            { name: 'الطلبات', href: '/admin/orders', icon: ClipboardList },
            { name: 'الكوبونات', href: '/admin/coupons', icon: Ticket },
            { name: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
            { name: 'الخدمات', href: '/admin/services', icon: Package },
        ],
    },
    {
        title: 'التخصيص',
        items: [
            { name: 'المظهر', href: '/admin/themes', icon: Palette },
            { name: 'شرائح Hero', href: '/admin/hero-slides', icon: ImageIcon },
            { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
        ],
    },
];

// User dropdown component
function UserDropdown({ onLogout }: { onLogout: () => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-[#53131C] to-[#8F6B43] flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity"
            >
                A
            </button>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-neutral-200">
                            <p className="text-sm font-medium text-neutral-900">Admin</p>
                            <p className="text-xs text-neutral-500">Ather@gmail.com</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Sidebar component - matching dub exactly
function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [stats, setStats] = useState({
        categories: 0,
        services: 0,
        slides: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [categoriesRes, servicesRes, slidesRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/services'),
                fetch('/api/admin/hero-slides'),
            ]);

            const [categories, services, slides] = await Promise.all([
                categoriesRes.json(),
                servicesRes.json(),
                slidesRes.json(),
            ]);

            setStats({
                categories: categories.length || 0,
                services: services.length || 0,
                slides: slides.length || 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div
            className="flex h-full w-[304px] flex-row overflow-hidden transition-[width] duration-300"
            style={{
                "--sidebar-width": "304px",
                "--sidebar-groups-width": "64px",
                "--sidebar-areas-width": "240px"
            } as React.CSSProperties}
        >
            {/* Icon group (left column) - 64px */}
            <div className="flex flex-col items-center justify-between">
                <div className="flex flex-col items-center p-2">
                    <div className="pb-1 pt-2">
                        <Link
                            href="/admin"
                            className="block rounded-lg px-1 py-4 outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-black/50"
                        >
                            <div className="flex h-5 w-5 items-center justify-center bg-gradient-to-r from-[#53131C] to-[#8F6B43] rounded">
                                <Globe className="h-3 w-3 text-white" />
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "relative flex size-11 items-center justify-center rounded-lg transition-colors duration-150",
                                        "outline-none focus-visible:ring-2 focus-visible:ring-black/50",
                                        isActive
                                            ? "bg-white"
                                            : "hover:bg-white/10 active:bg-white/20"
                                    )}
                                    title={item.name}
                                >
                                    <item.icon className="size-5 text-neutral-600" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-3 py-3">
                    <div className="flex size-12 items-center justify-center">
                        <UserDropdown onLogout={handleLogout} />
                    </div>
                </div>
            </div>

            {/* Main nav area (right column) - 240px */}
            <div className="size-full overflow-hidden py-2 pr-2">
                <div className="scrollbar-hide relative flex h-full w-[calc(var(--sidebar-areas-width)-0.5rem)] flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-neutral-100">
                    <div className="relative flex grow flex-col p-3 text-neutral-500">
                        <nav className="flex-1 space-y-6">
                            {navigationGroups.map((group) => (
                                <div key={group.title}>
                                    <div className="mb-2 px-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                        {group.title}
                                    </div>
                                    <ul className="space-y-1">
                                        {group.items.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm leading-none transition-[background-color,color,font-weight] duration-75 outline-none focus-visible:ring-2 focus-visible:ring-black/50',
                                                        pathname === item.href
                                                            ? 'bg-blue-100/50 font-medium text-blue-600 hover:bg-blue-100/80 active:bg-blue-100'
                                                            : 'text-neutral-700 hover:bg-white/50 active:bg-white'
                                                    )}
                                                >
                                                    {item.icon && <item.icon className="w-4 h-4" />}
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Fixed bottom sections */}
                    <div className="flex flex-col gap-2">
                        {/* Usage Widget */}
                        <div className="border-t border-neutral-200 p-3">
                            <Link
                                href="/admin/settings"
                                className="group flex items-center gap-0.5 text-sm font-normal text-neutral-500 transition-colors hover:text-[#8F6B43]"
                            >
                                الاستخدام
                                <ChevronRight className="size-3 text-neutral-500 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-[#8F6B43]" />
                            </Link>

                            <div className="mt-4 flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <FolderTree className="size-3.5 text-neutral-400" />
                                        <span className="text-xs font-medium text-neutral-600">التصنيفات</span>
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        {stats.categories}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <Package className="size-3.5 text-neutral-400" />
                                        <span className="text-xs font-medium text-neutral-600">الخدمات</span>
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        {stats.services}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="size-3.5 text-neutral-400" />
                                        <span className="text-xs font-medium text-neutral-600">الشرائح</span>
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        {stats.slides}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* <div className="mt-3">
                                <p className="text-xs text-neutral-500">
                                    سيتم إعادة تعيين الاستخدام في 1 يناير 2025
                                </p>
                            </div> */}

                        <Link
                            href="/"
                            target="_blank"
                            className="mt-4 w-full h-9 rounded-md border border-gray-300 px-4 text-sm bg-white text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
                        >
                            الرجوع للموقع
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main layout component - matching dub exactly
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    }, [isMobileMenuOpen]);

    return (
        <div className="min-h-screen w-full bg-white" dir="rtl">
            <div className="min-h-screen md:grid md:grid-cols-[min-content_minmax(0,1fr)]">
                {/* Side nav backdrop */}
                <div
                    className={cn(
                        "fixed left-0 top-0 z-50 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent",
                        isMobileMenuOpen
                            ? "bg-black/20 backdrop-blur-sm"
                            : "bg-transparent max-md:pointer-events-none"
                    )}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            e.stopPropagation();
                            setIsMobileMenuOpen(false);
                        }
                    }}
                >
                    {/* Side nav */}
                    <div
                        className={cn(
                            "relative h-full w-min max-w-full bg-neutral-200 transition-transform md:translate-x-0",
                            !isMobileMenuOpen && "-translate-x-full"
                        )}
                    >
                        <Sidebar />
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-neutral-200 pb-[var(--page-bottom-margin)] pt-[var(--page-top-margin)] [--page-bottom-margin:0px] [--page-top-margin:0px] md:h-screen md:pb-2 md:pl-2 md:[--page-bottom-margin:0.5rem] md:[--page-top-margin:0.5rem]">
                    <div className="relative h-full overflow-y-auto bg-neutral-100 pt-px md:rounded-xl md:bg-white">
                        {/* Mobile header */}
                        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex-1 text-sm font-semibold leading-6 text-neutral-900">
                                لوحة التحكم - ماى مومنت
                            </div>
                        </div>

                        {/* Page content */}
                        <main className="p-6">{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
}
