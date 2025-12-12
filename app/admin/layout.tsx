'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import type { Metadata } from 'next';
import './admin.css'; // Admin-specific styles
import Link from 'next/link';
import { NotificationProvider, useNotification, Notification } from '@/contexts/NotificationContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
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
    Palette,
    Bell,
    ShoppingCart,
    AlertCircle,
    CheckCircle,
    Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation items for icon column
const navigation = [
    { name: 'لوحة التحكم', href: '/admin', icon: LayoutDashboard },
    { name: 'الطلبات', href: '/admin/orders', icon: ClipboardList },
    { name: 'الكوبونات', href: '/admin/coupons', icon: Ticket },
    { name: 'التنبيهات', href: '/admin/alerts', icon: Megaphone },
    { name: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
    { name: 'المنتجات', href: '/admin/products', icon: Package },
    { name: 'شرائح Hero', href: '/admin/hero-slides', icon: ImageIcon },
    { name: 'المظهر', href: '/admin/themes', icon: Palette },
    { name: 'النطاقات', href: '/admin/domains', icon: Globe },
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
            { name: 'التنبيهات', href: '/admin/alerts', icon: Megaphone },
            { name: 'التصنيفات', href: '/admin/categories', icon: FolderTree },
            { name: 'المنتجات', href: '/admin/products', icon: Package },
        ],
    },
    {
        title: 'التخصيص',
        items: [
            { name: 'المظهر', href: '/admin/themes', icon: Palette },
            { name: 'شرائح Hero', href: '/admin/hero-slides', icon: ImageIcon },
            { name: 'النطاقات', href: '/admin/domains', icon: Globe },
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
                className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF4F0F] to-[#FF6500] flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity"
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

// Notification Bell component
function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, hasSystemUnread, lastSystemType } = useNotification();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ bottom: 0, right: 0 });

    // Calculate dropdown position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                bottom: window.innerHeight - rect.top + 8, // 8px above button
                right: window.innerWidth - rect.right,
            });
        }
    }, [isOpen]);

    // Handle notification click
    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        setSelectedNotification(notification);
        setIsOpen(false);
    };

    const dropdownContent = isOpen && (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[99998]"
                onClick={() => setIsOpen(false)}
            />
            {/* Dropdown */}
            <div
                className="fixed w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 z-[99999] overflow-hidden"
                style={{ bottom: dropdownPosition.bottom, right: dropdownPosition.right }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-gradient-to-r from-[#FF6500]/5 to-transparent">
                    <h3 className="font-semibold text-neutral-900">الإشعارات</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#FF6500] font-medium hover:underline"
                        >
                            قراءة الكل
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer border-b border-neutral-50 last:border-0 ${!notification.read ? (notification.source === 'system' ? 'bg-red-50' : 'bg-[#FF6500]/5') : ''}`}
                            >
                                {/* Image or Icon */}
                                {notification.image ? (
                                    <img
                                        src={notification.image}
                                        alt=""
                                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                                    />
                                ) : (
                                    <div className={`shrink-0 p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                        notification.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                            notification.type === 'error' ? 'bg-red-100 text-red-600' :
                                                notification.type === 'info' ? 'bg-violet-100 text-violet-600' :
                                                    notification.type === 'order' ? 'bg-[#FF6500]/10 text-[#FF6500]' :
                                                        'bg-neutral-100 text-neutral-600'
                                        }`}>
                                        <notification.icon className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm truncate ${!notification.read ? 'font-medium text-neutral-900' : 'text-neutral-700'}`}>
                                            {notification.title}
                                        </p>
                                        {!notification.read && (
                                            <span className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${notification.source === 'system' ? 'bg-red-500' : 'bg-[#FF6500]'}`} />
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 truncate mt-0.5">{notification.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] text-neutral-400">{notification.time}</p>
                                        {notification.source === 'system' && (
                                            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">نظام</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center text-neutral-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                            <p className="text-sm">لا توجد إشعارات</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t border-neutral-100 p-2">
                        <button className="w-full text-center text-sm text-[#FF6500] hover:bg-[#FF6500]/5 py-2 rounded-lg transition-colors font-medium">
                            عرض كل الإشعارات
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    // Notification Detail Modal
    const notificationModal = selectedNotification && createPortal(
        <>
            <div
                className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedNotification(null)}
            />
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
                    {/* Image */}
                    {selectedNotification.image && (
                        <div className="relative h-48 bg-neutral-100 rounded-t-2xl overflow-hidden">
                            <img
                                src={selectedNotification.image}
                                alt={selectedNotification.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className={`p-2 rounded-full ${selectedNotification.source === 'system' ? 'bg-red-100 text-red-600' :
                                selectedNotification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                    selectedNotification.type === 'success' ? 'bg-green-100 text-green-600' :
                                        'bg-orange-100 text-orange-600'
                                }`}>
                                <selectedNotification.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                {selectedNotification.source === 'system' && (
                                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                        إشعار نظام
                                    </span>
                                )}
                                <h2 className="text-xl font-bold text-neutral-900 mt-1">
                                    {selectedNotification.title}
                                </h2>
                            </div>
                        </div>

                        <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                            {selectedNotification.description}
                        </p>

                        <div className="mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
                            {selectedNotification.time}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="p-4 border-t border-neutral-100">
                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );

    // Get bell colors based on last system notification type
    const getBellColors = () => {
        if (!hasSystemUnread) {
            return {
                bg: 'bg-neutral-100 hover:bg-neutral-200',
                text: 'text-neutral-600',
                badge: 'bg-[#FF6500]'
            };
        }
        switch (lastSystemType) {
            case 'success':
                return { bg: 'bg-green-100 hover:bg-green-200', text: 'text-green-600', badge: 'bg-green-500' };
            case 'warning':
                return { bg: 'bg-orange-100 hover:bg-orange-200', text: 'text-orange-600', badge: 'bg-orange-500' };
            case 'error':
                return { bg: 'bg-red-100 hover:bg-red-200', text: 'text-red-600', badge: 'bg-red-500' };
            case 'info':
            default:
                return { bg: 'bg-violet-100 hover:bg-violet-200', text: 'text-violet-600', badge: 'bg-violet-500' };
        }
    };
    const bellColors = getBellColors();

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-colors ${bellColors.bg} ${bellColors.text}`}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-white text-[10px] font-bold rounded-full px-1 animate-pulse ${bellColors.badge}`}>
                        {unreadCount}
                    </span>
                )}
            </button>
            {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
            {typeof document !== 'undefined' && notificationModal}
        </div>
    );
}



// Sidebar component - matching dub exactly
function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [stats, setStats] = useState({
        categories: 0,
        products: 0,
        slides: 0,
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [categoriesRes, productsRes, slidesRes] = await Promise.all([
                fetch('/api/admin/categories'),
                fetch('/api/admin/products'),
                fetch('/api/admin/hero-slides'),
            ]);

            const [categories, products, slides] = await Promise.all([
                categoriesRes.json(),
                productsRes.json(),
                slidesRes.json(),
            ]);

            setStats({
                categories: categories.length || 0,
                products: products.length || 0,
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
                            <div className="flex h-5 w-5 items-center justify-center bg-gradient-to-r from-[#FF4F0F] to-[#FF6500] rounded">
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
                        <NotificationBell />
                    </div>
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
                                className="group flex items-center gap-0.5 text-sm font-normal text-neutral-500 transition-colors hover:text-[#FF6500]"
                            >
                                الاستخدام
                                <ChevronRight className="size-3 text-neutral-500 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-[#FF6500]" />
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
                                        <span className="text-xs font-medium text-neutral-600">المنتجات</span>
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        {stats.products}
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
        <ConfirmProvider>
            <NotificationProvider>
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
                        <div className="bg-neutral-200 pb-[var(--page-bottom-margin)] pt-[var(--page-top-margin)] [--page-bottom-margin:0px] [--page-top-margin:0px] md:h-screen md:pb-2 md:pl-2 md:[--page-bottom-margin:0.5rem] md:[--page-top-margin:0.5rem] isolate z-0">
                            <div className="relative h-full overflow-y-auto bg-neutral-100 pt-px md:rounded-xl md:bg-white">
                                {/* Mobile header */}
                                <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm md:hidden">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(true)}
                                        className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <Menu className="h-6 w-6" />
                                    </button>
                                    <div className="flex-1 text-sm font-semibold leading-6 text-neutral-900">
                                        لوحة التحكم - ماى مومنت
                                    </div>
                                    <NotificationBell />
                                </div>

                                {/* Page content */}
                                <main className="p-6">{children}</main>
                            </div>
                        </div>
                    </div>
                </div>
            </NotificationProvider>
        </ConfirmProvider>
    );
}
