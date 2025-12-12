'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, X, FolderTree, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useConfirm } from '@/contexts/ConfirmContext';

interface Category {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    image: string | null;
    parent_id: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.04 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'root' | 'sub'>('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const { confirm } = useConfirm();

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
                const sortedData = data.sort((a: any, b: any) => a.display_order - b.display_order);
                setCategories(sortedData);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category: Category) => {
        const confirmed = await confirm({
            title: 'حذف التصنيف',
            message: `هل أنت متأكد من حذف "${category.name}"؟`,
            confirmText: 'حذف',
            cancelText: 'إلغاء',
            variant: 'danger',
        });

        if (!confirmed) return;

        setDeleting(category.id);
        try {
            const res = await fetch(`/api/admin/categories/${category.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setCategories(categories.filter((cat) => cat.id !== category.id));
            toast.success('تم حذف التصنيف بنجاح');
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('فشل في حذف التصنيف');
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
            toast.success(category.is_active ? 'تم إخفاء التصنيف' : 'تم تفعيل التصنيف');
        } catch (error) {
            console.error('Failed to toggle active:', error);
            toast.error('فشل في تحديث الحالة');
        }
    };

    // Stats
    const stats = useMemo(() => ({
        total: categories.length,
        root: categories.filter(c => !c.parent_id).length,
        sub: categories.filter(c => c.parent_id).length,
        active: categories.filter(c => c.is_active).length,
        inactive: categories.filter(c => !c.is_active).length,
    }), [categories]);

    // Grouped categories: root with their children
    const groupedCategories = useMemo(() => {
        const roots = categories.filter(c => !c.parent_id).filter(cat => {
            const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filterType === 'all' || filterType === 'root';
            return matchesSearch && matchesFilter;
        });

        return roots.map(root => ({
            ...root,
            children: categories.filter(c => c.parent_id === root.id).filter(cat => {
                const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    cat.slug.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesFilter = filterType === 'all' || filterType === 'sub';
                return matchesSearch && matchesFilter;
            })
        }));
    }, [categories, searchQuery, filterType]);

    // Count for display
    const totalFiltered = useMemo(() => {
        return groupedCategories.reduce((acc, root) => acc + 1 + root.children.length, 0);
    }, [groupedCategories]);

    const getParentName = (parentId: string | null) => {
        if (!parentId) return null;
        const parent = categories.find(c => c.id === parentId);
        return parent?.name || null;
    };

    const filterOptions = [
        { value: 'all', label: 'جميع التصنيفات' },
        { value: 'root', label: 'التصنيفات الرئيسية' },
        { value: 'sub', label: 'التصنيفات الفرعية' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6500]"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats Bar */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#FF6500] rounded-lg">
                        <FolderTree className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                        <p className="text-xs text-neutral-500">إجمالي التصنيفات</p>
                    </div>
                </div>
                <div className="w-px h-10 bg-neutral-200" />
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-sm text-neutral-600">{stats.root} رئيسي</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-neutral-600">{stats.sub} فرعي</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-neutral-600">{stats.active} نشط</span>
                    </div>
                </div>
                <div className="flex-1" />
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 bg-[#FF6500] text-white px-4 py-2.5 rounded-lg hover:bg-[#FF4F0F] transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    <span>إضافة تصنيف</span>
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="بحث عن تصنيف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-neutral-100 rounded"
                        >
                            <X className="w-3.5 h-3.5 text-neutral-400" />
                        </button>
                    )}
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 transition-colors min-w-[160px]"
                    >
                        <Filter className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-700 flex-1 text-right">
                            {filterOptions.find(o => o.value === filterType)?.label}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showFilterDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: 'easeOut' }}
                                    className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1"
                                >
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => { setFilterType(option.value as any); setShowFilterDropdown(false); }}
                                            className={`w-full text-right px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${filterType === option.value ? 'bg-[#FF6500]/5 text-[#FF6500] font-medium' : 'text-neutral-700'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results count */}
                <span className="text-sm text-neutral-500">
                    {totalFiltered} تصنيف
                </span>
            </div>

            {/* Categories Grid - Grouped by Parent */}
            {groupedCategories.length === 0 ? (
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-12 text-center">
                    <FolderTree className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-4">لا توجد تصنيفات {searchQuery && 'مطابقة للبحث'}</p>
                    {!searchQuery && (
                        <Link
                            href="/admin/categories/new"
                            className="inline-flex items-center gap-2 bg-[#FF6500] text-white px-4 py-2 rounded-lg hover:bg-[#FF4F0F] transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            إضافة تصنيف جديد
                        </Link>
                    )}
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    <AnimatePresence mode="popLayout">
                        {groupedCategories.map((rootCategory) => (
                            <motion.div
                                key={rootCategory.id}
                                variants={itemVariants}
                                layout
                                className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
                            >
                                {/* Parent Category Card */}
                                <div className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors group">
                                    {/* Image */}
                                    {rootCategory.image ? (
                                        <img
                                            src={rootCategory.image}
                                            alt={rootCategory.name}
                                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shrink-0">
                                            <FolderTree className="w-7 h-7 text-red-500" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-neutral-900 text-lg">
                                                {rootCategory.name}
                                            </h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                رئيسي
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-500 font-mono">{rootCategory.slug}</p>
                                        {rootCategory.description && (
                                            <p className="text-sm text-neutral-600 mt-1 line-clamp-1">{rootCategory.description}</p>
                                        )}
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() => toggleActive(rootCategory)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${rootCategory.is_active
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                }`}
                                        >
                                            {rootCategory.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            {rootCategory.is_active ? 'نشط' : 'مخفي'}
                                        </button>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/categories/${rootCategory.id}`}
                                                className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(rootCategory)}
                                                disabled={deleting === rootCategory.id}
                                                className="p-2 border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {rootCategory.children.length > 0 && (
                                            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                                                {rootCategory.children.length} فرعي
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Sub Categories */}
                                {rootCategory.children.length > 0 && (
                                    <div className="border-t border-neutral-100 bg-neutral-50/50">
                                        {rootCategory.children.map((subCategory, index) => (
                                            <div
                                                key={subCategory.id}
                                                className={`flex items-center gap-4 p-4 pr-8 hover:bg-neutral-100/50 transition-colors group ${index !== rootCategory.children.length - 1 ? 'border-b border-neutral-100' : ''
                                                    }`}
                                            >
                                                {/* Connector Line */}
                                                <div className="flex items-center gap-2 mr-2">
                                                    <div className="w-6 h-6 border-r-2 border-b-2 border-neutral-300 rounded-br-lg" />
                                                </div>

                                                {/* Image */}
                                                {subCategory.image ? (
                                                    <img
                                                        src={subCategory.image}
                                                        alt={subCategory.name}
                                                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                                                        <FolderTree className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                )}

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h4 className="font-medium text-neutral-800">
                                                            {subCategory.name}
                                                        </h4>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                                                            فرعي
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500 font-mono">{subCategory.slug}</p>
                                                </div>

                                                {/* Status & Actions */}
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button
                                                        onClick={() => toggleActive(subCategory)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${subCategory.is_active
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                            }`}
                                                    >
                                                        {subCategory.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                        {subCategory.is_active ? 'نشط' : 'مخفي'}
                                                    </button>
                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/admin/categories/${subCategory.id}`}
                                                            className="p-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(subCategory)}
                                                            disabled={deleting === subCategory.id}
                                                            className="p-1.5 border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
}
