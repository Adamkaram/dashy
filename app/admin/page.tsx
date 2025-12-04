'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FolderTree, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { PageContentHeader } from '@/components/PageContentHeader';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        categories: 0,
        services: 0,
        heroSlides: 0,
    });
    const [loading, setLoading] = useState(true);

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
                heroSlides: slides.length || 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'التصنيفات',
            value: stats.categories,
            icon: FolderTree,
            color: 'bg-blue-500',
            href: '/admin/categories',
        },
        {
            title: 'الخدمات',
            value: stats.services,
            icon: Package,
            color: 'bg-green-500',
            href: '/admin/services',
        },
        {
            title: 'شرائح Hero',
            value: stats.heroSlides,
            icon: ImageIcon,
            color: 'bg-purple-500',
            href: '/admin/hero-slides',
        },
    ];

    return (
        <>
            <PageContentHeader
                title="لوحة التحكم"
                titleInfo="إدارة محتوى موقع ماى مومنت وعرض الإحصائيات الرئيسية"
            />
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-6 py-6 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            href={card.href}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {loading ? '...' : card.value}
                                    </p>
                                </div>
                                <div className={`${card.color} p-4 rounded-lg`}>
                                    <card.icon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">إجراءات سريعة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            href="/admin/categories/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8F6B43] hover:bg-gray-50 transition-colors"
                        >
                            <FolderTree className="w-5 h-5 text-[#8F6B43]" />
                            <span className="font-medium text-gray-700">إضافة تصنيف</span>
                        </Link>
                        <Link
                            href="/admin/services/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8F6B43] hover:bg-gray-50 transition-colors"
                        >
                            <Package className="w-5 h-5 text-[#8F6B43]" />
                            <span className="font-medium text-gray-700">إضافة خدمة</span>
                        </Link>
                        <Link
                            href="/admin/hero-slides/new"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8F6B43] hover:bg-gray-50 transition-colors"
                        >
                            <ImageIcon className="w-5 h-5 text-[#8F6B43]" />
                            <span className="font-medium text-gray-700">إضافة شريحة</span>
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#8F6B43] hover:bg-gray-50 transition-colors"
                        >
                            <TrendingUp className="w-5 h-5 text-[#8F6B43]" />
                            <span className="font-medium text-gray-700">الإعدادات</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">النشاط الأخير</h2>
                    <p className="text-gray-500 text-center py-8">لا توجد أنشطة حديثة</p>
                </div>
            </div>
        </>
    );
}
