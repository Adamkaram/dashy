'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();

            if (!res.ok) {
                console.error('API Error:', data);
                throw new Error(data.error || 'Failed to fetch categories');
            }

            if (Array.isArray(data)) {
                // Sort by display_order
                const sortedData = data.sort((a: any, b: any) => a.display_order - b.display_order);
                setCategories(sortedData);
            } else {
                console.error('Data is not an array:', data);
                setCategories([]);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

        setDeleting(id);
        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setCategories(categories.filter((cat) => cat.id !== id));
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('فشل في حذف التصنيف');
        } finally {
            setDeleting(null);
        }
    };

    const toggleActive = async (category: Category) => {
        try {
            const res = await fetch(`/api/admin/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...category,
                    is_active: !category.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            setCategories(
                categories.map((cat) =>
                    cat.id === category.id ? { ...cat, is_active: !cat.is_active } : cat
                )
            );
        } catch (error) {
            console.error('Failed to toggle active:', error);
            alert('فشل في تحديث الحالة');
        }
    };

    // Helper to render category rows with indentation for sub-categories
    const renderCategoryRows = () => {
        const rootCategories = categories.filter(cat => !cat.parent_id);
        const rows: any[] = [];

        rootCategories.forEach(rootCat => {
            // Render Root Category
            rows.push(renderRow(rootCat, 0));

            // Render Sub Categories
            const subCategories = categories.filter(cat => cat.parent_id === rootCat.id);
            subCategories.forEach(subCat => {
                rows.push(renderRow(subCat, 1));
            });
        });

        // Render orphans
        const orphanCategories = categories.filter(cat => cat.parent_id && !categories.find(p => p.id === cat.parent_id));
        orphanCategories.forEach(orphan => {
            rows.push(renderRow(orphan, 0));
        });

        return rows;
    };

    const renderRow = (category: Category, level: number) => (
        <motion.tr
            key={category.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="hover:bg-gray-50"
        >
            <td className="px-6 py-4">
                <div className="flex items-center">
                    {level > 0 && <div className="w-6 h-6 mr-2 border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>}
                    <div>
                        <div className={`font-medium text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>
                            {category.name}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                {category.slug}
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
                {category.display_order}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {/* Category Type Badge */}
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${!category.parent_id
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                    >
                        {!category.parent_id ? 'رئيسي' : 'فرعي'}
                    </span>

                    {/* Active Status Badge */}
                    <button
                        onClick={() => toggleActive(category)}
                        className={`relative overflow-hidden inline-flex items-center justify-center w-24 h-7 rounded-full text-xs font-medium transition-colors ${category.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={category.is_active ? 'active' : 'inactive'}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute flex items-center gap-1"
                            >
                                {category.is_active ? (
                                    <>
                                        <Eye className="w-3 h-3" />
                                        نشط
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="w-3 h-3" />
                                        غير نشط
                                    </>
                                )}
                            </motion.span>
                        </AnimatePresence>
                    </button>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/categories/${category.id}`}
                        className="p-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                        title="تعديل"
                    >
                        <Edit className="w-3.5 h-3.5 text-white" />
                    </Link>
                    <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="p-1.5 border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        title="حذف"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </motion.tr>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">جاري التحميل...</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">التصنيفات</h1>
                    <p className="text-gray-600 mt-1">إدارة تصنيفات الخدمات</p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 text-white" />
                    <span className="text-white">إضافة تصنيف</span>
                </Link>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                الاسم
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                الترتيب
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <AnimatePresence>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        لا توجد تصنيفات. ابدأ بإضافة تصنيف جديد.
                                    </td>
                                </tr>
                            ) : (
                                renderCategoryRows()
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
