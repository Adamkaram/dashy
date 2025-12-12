'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, MoreVertical, Package, Filter, ChevronDown, Eye, EyeOff, X, LayoutGrid, List, Copy, ExternalLink, ArrowUpDown, CheckSquare, Square, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContentHeader } from '@/components/PageContentHeader';
import { toast } from 'sonner';
import { useNotification } from '@/contexts/NotificationContext';
import { useConfirm } from '@/contexts/ConfirmContext';

interface Product {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    image: string | null;
    base_price: number;
    is_active: boolean;
    metadata: any;
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

// Clean scale + fade animation - no layout shifts
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.04,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        transition: { duration: 0.2 }
    },
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low' | 'name'>('newest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState({ title: '', subtitle: '', base_price: 0, is_active: true });
    const [saving, setSaving] = useState(false);

    const searchInputRef = useRef<HTMLInputElement>(null);
    const { addNotification } = useNotification();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            // Don't trigger shortcuts when typing in input/textarea
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    (target as HTMLInputElement).blur();
                }
                return;
            }

            if (e.key === 'Escape') {
                // Priority: close modals first, then other dropdowns
                if (quickEditProduct) {
                    setQuickEditProduct(null);
                    return;
                }
                if (quickViewProduct) {
                    setQuickViewProduct(null);
                    return;
                }
                setShowCategoryDropdown(false);
                setShowSortDropdown(false);
                setOpenMenuId(null);
                if (isSelectionMode) {
                    setIsSelectionMode(false);
                    setSelectedProducts(new Set());
                }
            }

            // / to focus search
            if (e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSelectionMode, quickViewProduct, quickEditProduct]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            if (!res.ok) {
                setProducts([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleDelete = useCallback(async (id: string) => {
        const productToDelete = products.find(p => p.id === id);
        const confirmed = await confirm({
            title: 'حذف المنتج',
            description: `هل أنت متأكد من حذف "${productToDelete?.title || 'هذا المنتج'}"؟ لا يمكن التراجع عن هذا الإجراء.`,
            confirmText: 'حذف',
            cancelText: 'إلغاء',
            variant: 'danger',
        });
        if (!confirmed) return;

        setDeleting(id);
        setOpenMenuId(null);
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setProducts(prev => prev.filter((product) => product.id !== id));
            toast.success('تم حذف المنتج بنجاح');
            addNotification('delete', 'تم حذف منتج', `تم حذف "${productToDelete?.title || 'منتج'}"`);
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('فشل في حذف المنتج');
        } finally {
            setDeleting(null);
        }
    }, [products, addNotification, confirm]);

    const toggleActive = useCallback(async (product: Product) => {
        // Optimistic update
        setProducts(prev => prev.map((p) =>
            p.id === product.id ? { ...p, is_active: !p.is_active } : p
        ));

        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: product.id,
                    is_active: !product.is_active,
                }),
            });

            if (!res.ok) {
                // Revert on error
                setProducts(prev => prev.map((p) =>
                    p.id === product.id ? { ...p, is_active: product.is_active } : p
                ));
                throw new Error('Failed to update');
            }

            toast.success(product.is_active ? 'تم إخفاء المنتج' : 'تم إظهار المنتج');
        } catch (error) {
            console.error('Failed to toggle active:', error);
            toast.error('فشل في تحديث الحالة');
        }
    }, []);

    const copyProductLink = useCallback((product: Product) => {
        const url = `${window.location.origin}/products/${product.slug}`;
        navigator.clipboard.writeText(url);
        toast.success('تم نسخ رابط المنتج');
        setOpenMenuId(null);
    }, []);

    // Bulk selection functions
    const toggleSelection = useCallback((productId: string) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);

    const selectAll = useCallback((productIds: string[]) => {
        setSelectedProducts(new Set(productIds));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedProducts(new Set());
        setIsSelectionMode(false);
    }, []);

    const bulkDelete = useCallback(async () => {
        const confirmed = await confirm({
            title: 'حذف منتجات متعددة',
            description: `هل أنت متأكد من حذف ${selectedProducts.size} منتج؟ لا يمكن التراجع عن هذا الإجراء.`,
            confirmText: `حذف ${selectedProducts.size} منتج`,
            cancelText: 'إلغاء',
            variant: 'danger',
        });
        if (!confirmed) return;

        const toDelete = Array.from(selectedProducts);
        for (const id of toDelete) {
            try {
                await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            } catch (e) {
                console.error('Failed to delete:', id);
            }
        }

        setProducts(prev => prev.filter(p => !selectedProducts.has(p.id)));
        toast.success(`تم حذف ${selectedProducts.size} منتج`);
        addNotification('delete', 'تم حذف عدة منتجات', `تم حذف ${selectedProducts.size} منتج`);
        clearSelection();
    }, [selectedProducts, clearSelection, addNotification, confirm]);

    const bulkToggleActive = useCallback(async (active: boolean) => {
        const toUpdate = Array.from(selectedProducts);

        // Optimistic update
        setProducts(prev => prev.map(p =>
            selectedProducts.has(p.id) ? { ...p, is_active: active } : p
        ));

        for (const id of toUpdate) {
            try {
                await fetch(`/api/admin/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, is_active: active }),
                });
            } catch (e) {
                console.error('Failed to update:', id);
            }
        }

        toast.success(`تم ${active ? 'تفعيل' : 'إخفاء'} ${selectedProducts.size} منتج`);
        addNotification('success', active ? 'تم تفعيل منتجات' : 'تم إخفاء منتجات', `تم ${active ? 'تفعيل' : 'إخفاء'} ${selectedProducts.size} منتج`);
        clearSelection();
    }, [selectedProducts, clearSelection, addNotification]);

    // Open Quick Edit with pre-filled form
    const openQuickEdit = useCallback((product: Product) => {
        setEditForm({
            title: product.title,
            subtitle: product.subtitle || '',
            base_price: product.base_price,
            is_active: product.is_active,
        });
        setQuickEditProduct(product);
        setOpenMenuId(null);
    }, []);

    // Save Quick Edit changes
    const saveQuickEdit = useCallback(async () => {
        if (!quickEditProduct) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/products/${quickEditProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: quickEditProduct.id,
                    title: editForm.title,
                    subtitle: editForm.subtitle || null,
                    base_price: editForm.base_price,
                    is_active: editForm.is_active,
                }),
            });

            if (!res.ok) throw new Error('Failed to update');

            // Update local state
            setProducts(prev => prev.map(p =>
                p.id === quickEditProduct.id
                    ? { ...p, title: editForm.title, subtitle: editForm.subtitle || null, base_price: editForm.base_price, is_active: editForm.is_active }
                    : p
            ));


            toast.success('تم حفظ التغييرات');
            addNotification('edit', 'تم تعديل منتج', `تم تحديث "${editForm.title}"`);
            setQuickEditProduct(null);
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error('فشل في حفظ التغييرات');
        } finally {
            setSaving(false);
        }
    }, [quickEditProduct, editForm, addNotification]);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let result = products.filter((product) => {
            const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.subtitle && product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = selectedCategory === 'all' || product.category.id === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        // Sort
        switch (sortBy) {
            case 'newest':
                // Assuming newer products have higher IDs or we could add created_at
                result = [...result].reverse();
                break;
            case 'oldest':
                // Keep original order
                break;
            case 'price-high':
                result = [...result].sort((a, b) => b.base_price - a.base_price);
                break;
            case 'price-low':
                result = [...result].sort((a, b) => a.base_price - b.base_price);
                break;
            case 'name':
                result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'ar'));
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, sortBy]);

    const selectedCategoryName = selectedCategory === 'all'
        ? 'جميع التصنيفات'
        : categories.find(c => c.id === selectedCategory)?.name || 'جميع التصنيفات';

    const sortOptions = [
        { value: 'newest', label: 'الأحدث' },
        { value: 'oldest', label: 'الأقدم' },
        { value: 'price-high', label: 'السعر: الأعلى' },
        { value: 'price-low', label: 'السعر: الأقل' },
        { value: 'name', label: 'الاسم' },
    ];

    const selectedSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'الأحدث';

    // Stats
    const stats = useMemo(() => ({
        total: products.length,
        active: products.filter(p => p.is_active).length,
        inactive: products.filter(p => !p.is_active).length,
    }), [products]);

    // Loading skeleton
    if (loading) {
        return (
            <>
                <PageContentHeader
                    title="المنتجات"
                    titleInfo="إدارة المنتجات المتاحة في المتجر"
                />
                <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-50 animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-neutral-100 rounded-full w-3/4 animate-pulse" />
                                    <div className="h-3 bg-neutral-100 rounded-full w-1/2 animate-pulse" />
                                    <div className="flex justify-between pt-2">
                                        <div className="h-6 bg-neutral-100 rounded-lg w-20 animate-pulse" />
                                        <div className="h-6 bg-neutral-100 rounded-lg w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageContentHeader
                title="المنتجات"
                titleInfo="إدارة المنتجات المتاحة في المتجر"
            />

            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-6 py-6 space-y-6">
                {/* Stats Bar */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
                            <p className="text-xs text-neutral-500">إجمالي المنتجات</p>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-neutral-200" />
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-sm text-neutral-600">{stats.active} نشط</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-neutral-400 rounded-full" />
                            <span className="text-sm text-neutral-600">{stats.inactive} مخفي</span>
                        </div>
                    </div>
                    <div className="flex-1" />
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 bg-[#FF6500] text-white px-4 py-2.5 rounded-lg hover:bg-[#FF4F0F] transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        <span>إضافة منتج</span>
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
                    {/* Search and Filters */}
                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:flex-none">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="بحث عن منتج...  /"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full lg:w-64 pl-9 pr-10 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all"
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

                        {/* Category Filter */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowSortDropdown(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 transition-colors min-w-[160px]"
                            >
                                <Filter className="w-4 h-4 text-neutral-400" />
                                <span className="text-neutral-700 flex-1 text-right truncate">{selectedCategoryName}</span>
                                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showCategoryDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            className="absolute top-full right-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto"
                                        >
                                            <button
                                                onClick={() => { setSelectedCategory('all'); setShowCategoryDropdown(false); }}
                                                className={`w-full text-right px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${selectedCategory === 'all' ? 'bg-[#FF6500]/5 text-[#FF6500] font-medium' : 'text-neutral-700'}`}
                                            >
                                                جميع التصنيفات
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => { setSelectedCategory(category.id); setShowCategoryDropdown(false); }}
                                                    className={`w-full text-right px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${selectedCategory === category.id ? 'bg-[#FF6500]/5 text-[#FF6500] font-medium' : 'text-neutral-700'}`}
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowSortDropdown(!showSortDropdown); setShowCategoryDropdown(false); }}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 transition-colors"
                            >
                                <ArrowUpDown className="w-4 h-4 text-neutral-400" />
                                <span className="text-neutral-700">{selectedSortLabel}</span>
                                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showSortDropdown && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                                        <motion.div
                                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: 'easeOut' }}
                                            className="absolute top-full right-0 mt-1 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1"
                                        >
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { setSortBy(option.value as any); setShowSortDropdown(false); }}
                                                    className={`w-full text-right px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${sortBy === option.value ? 'bg-[#FF6500]/5 text-[#FF6500] font-medium' : 'text-neutral-700'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* View Toggle & Selection */}
                    <div className="flex items-center gap-2">
                        {/* Selection Toggle */}
                        <button
                            onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                if (isSelectionMode) setSelectedProducts(new Set());
                            }}
                            className={`p-2 rounded-lg transition-all ${isSelectionMode ? 'bg-[#FF6500] text-white' : 'bg-neutral-100 text-neutral-500 hover:text-neutral-700'}`}
                            title="وضع التحديد"
                        >
                            <CheckSquare className="w-4 h-4" />
                        </button>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#FF6500]' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#FF6500]' : 'text-neutral-500 hover:text-neutral-700'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                <AnimatePresence>
                    {isSelectionMode && selectedProducts.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between gap-4 p-3 bg-[#FF6500]/5 border border-[#FF6500]/20 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-neutral-700">
                                    تم تحديد <span className="text-[#FF6500] font-bold">{selectedProducts.size}</span> منتج
                                </span>
                                <button
                                    onClick={() => selectAll(filteredProducts.map(p => p.id))}
                                    className="text-sm text-[#FF6500] hover:underline"
                                >
                                    تحديد الكل ({filteredProducts.length})
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => bulkToggleActive(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    إظهار
                                </button>
                                <button
                                    onClick={() => bulkToggleActive(false)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                                >
                                    <EyeOff className="w-3.5 h-3.5" />
                                    إخفاء
                                </button>
                                <button
                                    onClick={bulkDelete}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    حذف
                                </button>
                                <button
                                    onClick={clearSelection}
                                    className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Filters */}
                {(searchQuery || selectedCategory !== 'all') && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm"
                    >
                        <span className="text-neutral-500">عرض {filteredProducts.length} من {products.length} منتج</span>
                        <span className="text-neutral-300">|</span>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                            className="text-[#FF6500] hover:underline flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            مسح الفلاتر
                        </button>
                    </motion.div>
                )}

                {/* Products */}
                <AnimatePresence mode="wait">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-neutral-200"
                        >
                            {/* Animated Empty State */}
                            <div className="h-32 w-full max-w-48 overflow-hidden mb-4 [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]">
                                <motion.div
                                    animate={{ y: [0, -96] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    className="flex flex-col items-center"
                                >
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-32 h-20 mt-4 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-neutral-300" />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-800 mb-1">لا توجد منتجات</h3>
                            <p className="text-sm text-neutral-500 mb-4 text-center max-w-sm">
                                {searchQuery || selectedCategory !== 'all'
                                    ? 'لم يتم العثور على منتجات مطابقة للبحث'
                                    : 'ابدأ بإضافة منتج جديد لعرضه في المتجر'}
                            </p>
                            {!searchQuery && selectedCategory === 'all' && (
                                <Link
                                    href="/admin/products/new"
                                    className="flex items-center gap-2 bg-[#FF6500] text-white px-4 py-2 rounded-lg hover:bg-[#FF4F0F] transition-colors text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    إضافة منتج جديد
                                </Link>
                            )}
                        </motion.div>
                    ) : viewMode === 'grid' ? (
                        <motion.div
                            key="grid-view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        className={`group relative bg-white rounded-xl border transition-all duration-200 ${openMenuId === product.id
                                            ? 'z-[300] border-[#FF6500]/50 shadow-2xl'
                                            : 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg'
                                            }`}
                                    >
                                        {/* Animated Beam Effect */}
                                        {openMenuId === product.id && (
                                            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                                                <div
                                                    className="absolute inset-0 rounded-xl"
                                                    style={{
                                                        background: 'linear-gradient(90deg, transparent, rgba(255, 101, 0, 0.15), transparent)',
                                                        animation: 'beam 1.5s ease-in-out infinite',
                                                    }}
                                                />
                                                <style>{`
                                                    @keyframes beam {
                                                        0% { transform: translateX(-100%); }
                                                        100% { transform: translateX(100%); }
                                                    }
                                                `}</style>
                                            </div>
                                        )}
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-neutral-100 rounded-t-xl">
                                            {/* Image Wrapper with overflow-hidden for zoom effect */}
                                            <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-50">
                                                        <Package className="w-12 h-12 text-neutral-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status Badge - Clickable to Toggle */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleActive(product); }}
                                                className="absolute top-3 right-3 group/badge"
                                                title={product.is_active ? 'انقر للإخفاء' : 'انقر للتفعيل'}
                                            >
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all cursor-pointer ${product.is_active
                                                    ? 'bg-[#FF6500]/10 text-[#FF6500] hover:bg-[#FF6500]/20'
                                                    : 'bg-neutral-100/90 text-neutral-600 hover:bg-neutral-200/90'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-[#FF6500]' : 'bg-neutral-400'}`} />
                                                    {product.is_active ? 'نشط' : 'مخفي'}
                                                </span>
                                            </button>

                                            {/* Selection Checkbox */}
                                            {isSelectionMode && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleSelection(product.id); }}
                                                    className={`absolute bottom-3 right-3 w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedProducts.has(product.id)
                                                        ? 'bg-[#FF6500] text-white'
                                                        : 'bg-white/90 backdrop-blur-sm border border-neutral-300 text-transparent hover:border-[#FF6500]'
                                                        }`}
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Actions Menu */}
                                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-[200]">
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === product.id ? null : product.id); }}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuId === product.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-[100]" onClick={() => setOpenMenuId(null)} />
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                                                                    transition={{ duration: 0.12, ease: 'easeOut' }}
                                                                    className="absolute top-full left-0 mt-1 w-44 bg-white border border-neutral-200 rounded-lg shadow-xl z-[100] py-1 overflow-visible"
                                                                >
                                                                    <button
                                                                        onClick={() => { setQuickViewProduct(product); setOpenMenuId(null); }}
                                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                    >
                                                                        <Eye className="w-4 h-4 text-neutral-400" />
                                                                        معاينة سريعة
                                                                    </button>
                                                                    <Link
                                                                        href={`/admin/products/${product.id}`}
                                                                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                        onClick={() => setOpenMenuId(null)}
                                                                    >
                                                                        <Edit className="w-4 h-4 text-neutral-400" />
                                                                        تعديل
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => openQuickEdit(product)}
                                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                    >
                                                                        <Edit className="w-4 h-4 text-[#FF6500]" />
                                                                        تعديل سريع
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { toggleActive(product); setOpenMenuId(null); }}
                                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                    >
                                                                        {product.is_active ? (
                                                                            <>
                                                                                <EyeOff className="w-4 h-4 text-neutral-400" />
                                                                                إخفاء
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Eye className="w-4 h-4 text-neutral-400" />
                                                                                إظهار
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => copyProductLink(product)}
                                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                    >
                                                                        <Copy className="w-4 h-4 text-neutral-400" />
                                                                        نسخ الرابط
                                                                    </button>
                                                                    <Link
                                                                        href={`/products/${product.slug}`}
                                                                        target="_blank"
                                                                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                                                        onClick={() => setOpenMenuId(null)}
                                                                    >
                                                                        <ExternalLink className="w-4 h-4 text-neutral-400" />
                                                                        عرض في المتجر
                                                                    </Link>
                                                                    <div className="border-t border-neutral-100 my-1" />
                                                                    <button
                                                                        onClick={() => handleDelete(product.id)}
                                                                        disabled={deleting === product.id}
                                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        {deleting === product.id ? 'جاري الحذف...' : 'حذف'}
                                                                    </button>
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <Link href={`/admin/products/${product.id}`} className="block group/link">
                                                <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1 group-hover/link:text-[#FF6500] transition-colors">
                                                    {product.title}
                                                </h3>
                                            </Link>

                                            {product.subtitle && (
                                                <p className="text-sm text-neutral-500 mb-3 line-clamp-1">{product.subtitle}</p>
                                            )}

                                            <div className="flex items-center justify-between mt-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-xs font-medium">
                                                    {product.category.name}
                                                </span>
                                                <span className="font-bold text-[#FF6500]">
                                                    {product.base_price.toLocaleString()} ج.م
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        /* List View */
                        <motion.div
                            key="list-view"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100"
                        >
                            <AnimatePresence>
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="show"
                                        exit="exit"
                                        className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group"
                                    >
                                        {/* Selection Checkbox */}
                                        {isSelectionMode && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleSelection(product.id); }}
                                                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${selectedProducts.has(product.id)
                                                    ? 'bg-[#FF6500] text-white'
                                                    : 'border border-neutral-300 text-transparent hover:border-[#FF6500]'
                                                    }`}
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                            </button>
                                        )}

                                        {/* Image */}
                                        <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-neutral-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/admin/products/${product.id}`} className="group/link">
                                                <h3 className="font-semibold text-neutral-900 truncate group-hover/link:text-[#FF6500] transition-colors">
                                                    {product.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-neutral-500 truncate">{product.category.name}</p>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <span className="font-bold text-[#FF6500]">{product.base_price.toLocaleString()} ج.م</span>
                                        </div>

                                        {/* Status - Clickable */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleActive(product); }}
                                            title={product.is_active ? 'انقر للإخفاء' : 'انقر للتفعيل'}
                                        >
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${product.is_active
                                                ? 'bg-[#FF6500]/10 text-[#FF6500] hover:bg-[#FF6500]/20'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${product.is_active ? 'bg-[#FF6500]' : 'bg-neutral-400'}`} />
                                                {product.is_active ? 'نشط' : 'مخفي'}
                                            </span>
                                        </button>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4 text-neutral-500" />
                                            </Link>
                                            <button
                                                onClick={() => toggleActive(product)}
                                                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                                            >
                                                {product.is_active ? (
                                                    <EyeOff className="w-4 h-4 text-neutral-500" />
                                                ) : (
                                                    <Eye className="w-4 h-4 text-neutral-500" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deleting === product.id}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {quickViewProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setQuickViewProduct(null)}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">معاينة المنتج</h2>
                                    <button
                                        onClick={() => setQuickViewProduct(null)}
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-neutral-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="w-48 h-48 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                                            {quickViewProduct.image ? (
                                                <img
                                                    src={quickViewProduct.image}
                                                    alt={quickViewProduct.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-16 h-16 text-neutral-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <h3 className="text-xl font-bold text-neutral-900">{quickViewProduct.title}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${quickViewProduct.is_active
                                                    ? 'bg-[#FF6500]/10 text-[#FF6500]'
                                                    : 'bg-neutral-100 text-neutral-600'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${quickViewProduct.is_active ? 'bg-[#FF6500]' : 'bg-neutral-400'}`} />
                                                    {quickViewProduct.is_active ? 'نشط' : 'مخفي'}
                                                </span>
                                            </div>

                                            {quickViewProduct.subtitle && (
                                                <p className="text-neutral-500 mb-3">{quickViewProduct.subtitle}</p>
                                            )}

                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-2xl font-bold text-[#FF6500]">
                                                    {quickViewProduct.base_price.toLocaleString()} ج.م
                                                </span>
                                                {quickViewProduct.category && (
                                                    <span className="px-2.5 py-1 bg-neutral-100 rounded-lg text-sm text-neutral-600">
                                                        {quickViewProduct.category.name}
                                                    </span>
                                                )}
                                            </div>

                                            {quickViewProduct.description && (
                                                <div className="prose prose-sm text-neutral-600 line-clamp-3">
                                                    <p>{quickViewProduct.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between gap-3 p-4 bg-neutral-50 border-t border-neutral-100">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                copyProductLink(quickViewProduct);
                                                setQuickViewProduct(null);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                            نسخ الرابط
                                        </button>
                                        <a
                                            href={`/products/${quickViewProduct.slug}`}
                                            target="_blank"
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            عرض في المتجر
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                handleDelete(quickViewProduct.id);
                                                setQuickViewProduct(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            حذف
                                        </button>
                                        <Link
                                            href={`/admin/products/${quickViewProduct.id}`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#FF6500] text-white rounded-lg hover:bg-[#FF4F0F] transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            تعديل
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Quick Edit Modal */}
            <AnimatePresence>
                {quickEditProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setQuickEditProduct(null)}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                                    <h2 className="text-lg font-semibold text-neutral-900">تعديل سريع</h2>
                                    <button
                                        onClick={() => setQuickEditProduct(null)}
                                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-neutral-500" />
                                    </button>
                                </div>

                                {/* Form */}
                                <div className="p-6 space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            اسم المنتج
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all"
                                        />
                                    </div>

                                    {/* Subtitle */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            الوصف المختصر
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.subtitle}
                                            onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all"
                                            placeholder="اختياري..."
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                            السعر (ج.م)
                                        </label>
                                        <input
                                            type="number"
                                            value={editForm.base_price}
                                            onChange={(e) => setEditForm({ ...editForm, base_price: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all"
                                            min={0}
                                        />
                                    </div>

                                    {/* Status Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                                        <div>
                                            <span className="font-medium text-neutral-900">حالة المنتج</span>
                                            <p className="text-sm text-neutral-500">
                                                {editForm.is_active ? 'المنتج ظاهر في المتجر' : 'المنتج مخفي من المتجر'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${editForm.is_active ? 'bg-[#FF6500]' : 'bg-neutral-300'}`}
                                        >
                                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editForm.is_active ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 p-4 bg-neutral-50 border-t border-neutral-100">
                                    <button
                                        onClick={() => setQuickEditProduct(null)}
                                        className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={saveQuickEdit}
                                        disabled={saving || !editForm.title.trim()}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#FF6500] text-white rounded-lg hover:bg-[#FF4F0F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" />
                                                حفظ التغييرات
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
