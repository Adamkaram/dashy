'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/admin/ImageUpload';

export default function HeroSlideFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        image: '',
        title: '',
        subtitle: '',
        title_color: '#372d26',
        subtitle_color: '#734d3f',
        display_order: 0,
        is_active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEdit) {
            fetchSlide();
        }
    }, []);

    const fetchSlide = async () => {
        try {
            const res = await fetch(`/api/admin/hero-slides/${params.id}`);
            const data = await res.json();
            setFormData({
                image: data.image,
                title: data.title,
                subtitle: data.subtitle || '',
                title_color: data.title_color || '#372d26',
                subtitle_color: data.subtitle_color || '#734d3f',
                display_order: data.display_order,
                is_active: data.is_active,
            });
        } catch (error) {
            console.error('Failed to fetch slide:', error);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.image.trim()) newErrors.image = 'الصورة مطلوبة';
        if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
        if (formData.display_order < 0) newErrors.display_order = 'الترتيب يجب أن يكون موجباً';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const url = isEdit
                ? `/api/admin/hero-slides/${params.id}`
                : '/api/admin/hero-slides';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'فشل في حفظ الشريحة');
            }

            router.push('/admin/hero-slides');
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/hero-slides"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEdit ? 'تحديث بيانات الشريحة' : 'إضافة شريحة جديدة للصفحة الرئيسية'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Image */}
                <div>
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        label="صورة الشريحة"
                        required
                    />
                    {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                </div>

                {/* Title & Color */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none transition-all"
                            placeholder="مرحباً بكم في أرقى الذكريات"
                        />
                        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            لون العنوان
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            {['#ECE8DB', '#F0EBE5', '#8F6B43', '#53131C', '#46423D', '#363533'].map((color) => (
                                <motion.button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, title_color: color })}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.title_color === color
                                            ? 'border-blue-500 shadow-md scale-110'
                                            : 'border-transparent hover:shadow-sm'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            <div className="w-px h-8 bg-gray-200 mx-2" />
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1 bg-white">
                                <input
                                    type="color"
                                    value={formData.title_color}
                                    onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                                    className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                />
                                <span className="text-xs text-gray-500 font-mono w-16 text-center">{formData.title_color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtitle & Color */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان الفرعي
                        </label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none transition-all"
                            placeholder="نجعل لحظاتكم لا تُنسى"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            لون العنوان الفرعي
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            {['#ECE8DB', '#F0EBE5', '#8F6B43', '#53131C', '#46423D', '#363533'].map((color) => (
                                <motion.button
                                    key={color}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, subtitle_color: color })}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.subtitle_color === color
                                            ? 'border-blue-500 shadow-md scale-110'
                                            : 'border-transparent hover:shadow-sm'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            <div className="w-px h-8 bg-gray-200 mx-2" />
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1 bg-white">
                                <input
                                    type="color"
                                    value={formData.subtitle_color}
                                    onChange={(e) => setFormData({ ...formData, subtitle_color: e.target.value })}
                                    className="w-6 h-6 rounded cursor-pointer border-none p-0"
                                />
                                <span className="text-xs text-gray-500 font-mono w-16 text-center">{formData.subtitle_color}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ترتيب العرض
                    </label>
                    <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none transition-all"
                        placeholder="0"
                    />
                    {errors.display_order && <p className="text-sm text-red-600 mt-1">{errors.display_order}</p>}
                    <p className="text-sm text-gray-500 mt-1">الأرقام الأصغر تظهر أولاً</p>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 text-[#8F6B43] border-gray-300 rounded focus:ring-[#8F6B43]"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                        نشط (يظهر في الصفحة الرئيسية)
                    </label>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-lg z-10">
                    <Link
                        href="/admin/hero-slides"
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 font-medium text-sm shadow-sm hover:shadow-md"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
