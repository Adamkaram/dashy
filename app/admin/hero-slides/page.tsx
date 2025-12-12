'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string | null;
    display_order: number;
    is_active: boolean;
}

export default function HeroSlidesPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/admin/hero-slides');
            const data = await res.json();

            if (Array.isArray(data)) {
                setSlides(data);
            } else {
                console.error('API returned non-array data:', data);
                setSlides([]);
            }
        } catch (error) {
            console.error('Failed to fetch slides:', error);
            setSlides([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/hero-slides/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setSlides(slides.filter((slide) => slide.id !== id));
        } catch (error) {
            console.error('Failed to delete slide:', error);
            alert('فشل في حذف الشريحة');
        } finally {
            setDeleting(null);
        }
    };

    const toggleActive = async (slide: HeroSlide) => {
        try {
            const res = await fetch(`/api/admin/hero-slides/${slide.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...slide,
                    is_active: !slide.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setSlides(
                slides.map((s) =>
                    s.id === slide.id ? { ...s, is_active: !s.is_active } : s
                )
            );
        } catch (error) {
            console.error('Failed to toggle active:', error);
            alert('فشل في تحديث الحالة');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6500]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">شرائح Hero</h1>
                    <p className="text-gray-600 mt-1 text-sm">إدارة شرائح الصفحة الرئيسية</p>
                </div>
                <Link
                    href="/admin/hero-slides/new"
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-white">إضافة شريحة</span>
                </Link>
            </div>

            {/* Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {slides.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300"
                        >
                            لا توجد شرائح حالياً. ابدأ بإضافة شريحة جديدة.
                        </motion.div>
                    ) : (
                        Array.isArray(slides) && slides.map((slide) => (
                            <motion.div
                                key={slide.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <button
                                            onClick={() => toggleActive(slide)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-colors ${slide.is_active
                                                ? 'bg-green-500/90 text-white'
                                                : 'bg-gray-500/90 text-white'
                                                }`}
                                        >
                                            {slide.is_active ? 'نشط' : 'غير نشط'}
                                        </button>
                                        <span className="bg-white/90 backdrop-blur-md text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                            #{slide.display_order}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                                        {slide.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-1 min-h-[20px]">
                                        {slide.subtitle || '-'}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/admin/hero-slides/${slide.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>تعديل</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            disabled={deleting === slide.id}
                                            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
