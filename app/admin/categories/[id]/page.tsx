'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Select } from '@/components/ui/Select';
import { ArrowRight, Save, FolderTree, FileText, Image as ImageIcon, Settings, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { InfoTooltip } from '@/components/ui/Tooltip';
import ImageUpload from '@/components/admin/ImageUpload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

export default function CategoryFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        slug: '',
        name: '',
        description: '',
        image: '',
        parent_id: '',
        display_order: 0,
        is_active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'اكتب وصف التصنيف هنا...',
            }),
        ],
        content: formData.description,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, description: editor.getHTML() }));
        },
    });


    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchCategory();
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter out current category (if edit) to prevent circular dependency
                const validParents = isEdit
                    ? data.filter((c: any) => c.id !== params.id)
                    : data;
                setCategories(validParents);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchCategory = async () => {
        try {
            const res = await fetch(`/api/admin/categories/${params.id}`);
            const data = await res.json();
            setFormData({
                slug: data.slug,
                name: data.name,
                description: data.description || '',
                image: data.image || '',
                parent_id: data.parent_id || '',
                display_order: data.display_order,
                is_active: data.is_active,
            });
        } catch (error) {
            console.error('Failed to fetch category:', error);
            toast.error('فشل في تحميل بيانات التصنيف');
        }
    };

    // Sync editor content when data is loaded and editor is ready
    useEffect(() => {
        if (editor && formData.description) {
            const currentContent = editor.getHTML();
            if ((currentContent === '<p></p>' || currentContent === '') && formData.description !== '<p></p>') {
                editor.commands.setContent(formData.description);
            }
        }
    }, [editor, formData.description]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.slug.trim()) newErrors.slug = 'Slug مطلوب';
        if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
        if (formData.display_order < 0) newErrors.display_order = 'الترتيب يجب أن يكون موجباً';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('يرجى تصحيح الأخطاء في النموذج');
            return;
        }

        setLoading(true);

        try {
            const url = isEdit
                ? `/api/admin/categories/${params.id}`
                : '/api/admin/categories';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                parent_id: formData.parent_id || null,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'فشل في حفظ التصنيف');
            }

            toast.success(isEdit ? 'تم تحديث التصنيف بنجاح' : 'تم إضافة التصنيف بنجاح');
            router.push('/admin/categories');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
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
                    href="/admin/categories"
                    className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <ArrowRight className="w-5 h-5 text-neutral-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">
                        {isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                    </h1>
                    <p className="text-neutral-500 mt-1 text-sm">
                        {isEdit ? 'تحديث بيانات التصنيف' : 'إضافة تصنيف جديد للمنتجات'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info Section */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-lg flex items-center justify-center">
                            <FolderTree className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">المعلومات الأساسية</h3>
                            <p className="text-xs text-neutral-500">الاسم و Slug والتصنيف الأب</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Name & Slug Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                    الاسم <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                    placeholder="اسم التصنيف"
                                />
                                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5 flex items-center gap-1.5">
                                    Slug (للرابط) <span className="text-red-500">*</span>
                                    <InfoTooltip
                                        content="الـ Slug هو الجزء الذي يظهر في رابط الصفحة (URL)"
                                        side="left"
                                    />
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all font-mono"
                                    placeholder="category-slug"
                                    dir="ltr"
                                />
                                {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
                            </div>
                        </div>

                        {/* Parent Category & Display Order Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Parent Category */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                    التصنيف الأب (اختياري)
                                </label>
                                <Select
                                    value={formData.parent_id}
                                    onChange={(value) => setFormData({ ...formData, parent_id: value })}
                                    options={[
                                        { value: '', label: 'بدون (تصنيف رئيسي)' },
                                        ...categories.filter(c => !c.parent_id).map((cat) => ({
                                            value: cat.id,
                                            label: cat.name
                                        }))
                                    ]}
                                    placeholder="اختر التصنيف الأب"
                                    className="!h-[42px]"
                                />
                                <p className="text-[10px] text-neutral-400 mt-1">اختر تصنيفاً رئيسياً إذا كان هذا تصنيفاً فرعياً</p>
                            </div>

                            {/* Display Order */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                    ترتيب العرض
                                </label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                    placeholder="0"
                                />
                                {errors.display_order && <p className="text-xs text-red-600 mt-1">{errors.display_order}</p>}
                                <p className="text-[10px] text-neutral-400 mt-1">الأرقام الأصغر تظهر أولاً</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Section */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">صورة التصنيف</h3>
                            <p className="text-xs text-neutral-500">صورة تمثيلية للتصنيف</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                            label=""
                        />
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">الوصف</h3>
                            <p className="text-xs text-neutral-500">وصف تفصيلي للتصنيف (اختياري)</p>
                        </div>
                    </div>

                    <div className="border-b border-neutral-100">
                        <div className="p-2 flex gap-1 flex-wrap bg-neutral-50">
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${editor?.isActive('bold') ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${editor?.isActive('italic') ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                            >
                                <em>I</em>
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                            >
                                H2
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${editor?.isActive('bulletList') ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                            >
                                • List
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${editor?.isActive('orderedList') ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'}`}
                            >
                                1. List
                            </button>
                        </div>
                    </div>
                    <EditorContent
                        editor={editor}
                        className="prose prose-sm max-w-none p-4 min-h-[120px] focus:outline-none"
                    />
                </div>

                {/* Settings Section */}
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">الإعدادات</h3>
                            <p className="text-xs text-neutral-500">حالة التصنيف</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-900">حالة التصنيف</span>
                                <span className="text-xs text-neutral-500">التحكم في ظهور التصنيف في الموقع</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 ${formData.is_active ? 'bg-[#FF6500]' : 'bg-neutral-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.is_active ? '-translate-x-5' : '-translate-x-0.5'
                                            }`}
                                    />
                                </button>
                                <span className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                                    {formData.is_active ? (
                                        <>
                                            <Eye className="w-4 h-4 text-green-600" />
                                            نشط
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-4 h-4 text-neutral-400" />
                                            مخفي
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 -mx-6 p-4 bg-white/90 backdrop-blur-md border-t border-neutral-200 flex items-center justify-end gap-3 rounded-b-xl z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Link
                        href="/admin/categories"
                        className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all"
                    >
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white px-5 py-2.5 rounded-lg hover:from-[#FF4F0F] hover:to-[#E55500] transition-all disabled:opacity-50 font-medium text-sm shadow-md hover:shadow-lg"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'جاري الحفظ...' : (isEdit ? 'حفظ التغييرات' : 'إضافة التصنيف')}</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
