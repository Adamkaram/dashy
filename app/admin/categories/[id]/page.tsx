'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Select } from '@/components/ui/Select';
import { ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { InfoTooltip } from '@/components/ui/Tooltip';
import ImageUpload from '@/components/admin/ImageUpload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

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
            console.log('Fetched category data:', data);
            console.log('Image value:', data.image);
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
        }
    };

    // Sync editor content when data is loaded and editor is ready
    useEffect(() => {
        if (editor && formData.description) {
            const currentContent = editor.getHTML();
            // Simple check: if editor is empty (just <p></p>) and formData has content, set it.
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

        if (!validate()) return;

        setLoading(true);

        try {
            const url = isEdit
                ? `/api/admin/categories/${params.id}`
                : '/api/admin/categories';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                parent_id: formData.parent_id || null, // Ensure empty string becomes null
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

            router.push('/admin/categories');
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
                    href="/admin/categories"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEdit ? 'تحديث بيانات التصنيف' : 'إضافة تصنيف جديد للخدمات'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        Slug (للرابط) <span className="text-red-500">*</span>
                        <InfoTooltip
                            content="الـ Slug هو الجزء الذي يظهر في رابط الصفحة (URL). مثال: category-slug سيصبح الرابط: /categories/category-slug"
                            side="left"
                        />
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none"
                        placeholder="category-slug"
                        dir="ltr"
                    />
                    {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
                    <p className="text-sm text-gray-500 mt-1">يستخدم في الرابط (URL)</p>
                </div>


                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none"
                        placeholder="اسم التصنيف"
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Parent Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    />
                    <p className="text-sm text-gray-500 mt-1">اختر تصنيفاً رئيسياً إذا كان هذا تصنيفاً فرعياً</p>
                </div>

                {/* Image */}
                <div>
                    <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        label="صورة التصنيف"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        الوصف
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                        <div className="tiptap-toolbar border-b border-gray-200 p-2 flex gap-1 flex-wrap">
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor?.isActive('bold') ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor?.isActive('italic') ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <em>I</em>
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                H2
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor?.isActive('bulletList') ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                • List
                            </button>
                            <button
                                type="button"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${editor?.isActive('orderedList') ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                1. List
                            </button>
                        </div>
                        <EditorContent
                            editor={editor}
                            className="prose prose-sm max-w-none p-4 min-h-[150px] focus:outline-none"
                        />
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none"
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
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        نشط
                    </label>
                </div>

                {/* Actions */}
                {/* Actions */}
                <div className="sticky bottom-0 -mx-6 -mb-6 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-lg z-10">
                    <Link
                        href="/admin/categories"
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
