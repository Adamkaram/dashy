'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Select } from '@/components/ui/Select';
import { ArrowRight, Save, Plus, Trash2, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUpload from '@/components/admin/ImageUpload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface OptionChoice {
    label: string;
    price: number;
}

interface ServiceOption {
    id?: string;
    title: string;
    type: 'radio' | 'checkbox' | 'select';
    is_required: boolean;
    price: number;
    options: OptionChoice[];
    display_order: number;
}

export default function ServiceFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        slug: '',
        category_id: '',
        title: '',
        subtitle: '',
        image: '',
        description: '',
        base_price: 0,
        is_active: true,
        provider_name: 'My Moments',
        provider_logo: 'https://wgbbwrstcsizaqmvykmh.supabase.co/storage/v1/object/public/moment-bucket/log02.png',
        policy: 'سياسة الحجز : يجب أن لا تقل مدة الحجز عن أسبوعين من تاريخ المناسبة.\n\nسياسة الإلغاء : يتم خصم 50 % من المبلغ الإجمالي في حال الإلغاء قبل موعد المناسبة ب 72 ساعة ، وأما في حال التأجيل يتم توفير كوبون مفتوح لمدة سنة .',
    });
    const [serviceImages, setServiceImages] = useState<string[]>([]);
    const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'اكتب وصف الخدمة هنا...',
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
            fetchService();
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data)) setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchService = async () => {
        try {
            const res = await fetch(`/api/admin/services/${params.id}`);
            if (!res.ok) return;
            const data = await res.json();

            if (data && !data.error) {
                setFormData({
                    slug: data.slug || '',
                    category_id: data.category?.id || data.category_id || '',
                    title: data.title || '',
                    subtitle: data.subtitle || '',
                    image: data.image || '',
                    description: data.description || '',
                    base_price: data.base_price || 0,
                    is_active: data.is_active ?? true,
                    provider_name: data.provider_name || 'My Moments',
                    provider_logo: data.provider_logo || 'https://wgbbwrstcsizaqmvykmh.supabase.co/storage/v1/object/public/moment-bucket/log02.png',
                    policy: data.policy || 'سياسة الحجز : يجب أن لا تقل مدة الحجز عن أسبوعين من تاريخ المناسبة.\n\nسياسة الإلغاء : يتم خصم 50 % من المبلغ الإجمالي في حال الإلغاء قبل موعد المناسبة ب 72 ساعة ، وأما في حال التأجيل يتم توفير كوبون مفتوح لمدة سنة .',
                });

                if (data.options && Array.isArray(data.options)) {
                    setServiceOptions(data.options);
                }

                // Fetch service images
                if (data.images && Array.isArray(data.images)) {
                    // Handle both camelCase (Drizzle) and snake_case (Raw DB)
                    const imageUrls = data.images.map((img: any) => img.imageUrl || img.image_url);
                    setServiceImages(imageUrls);
                }
            }
        } catch (error) {
            console.error('Failed to fetch service:', error);
        }
    };

    // Sync editor content when data is loaded and editor is ready
    useEffect(() => {
        if (editor && formData.description) {
            // Only set content if editor is empty to avoid overwriting user changes
            // But for initial load, we want to set it.
            // Since formData.description is updated by editor, we need to be careful.
            // We can check if editor content is empty or default.

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
        if (!formData.category_id) newErrors.category_id = 'التصنيف مطلوب';
        if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
        if (formData.base_price < 0) newErrors.base_price = 'السعر يجب أن يكون موجباً';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddOption = () => {
        setServiceOptions([
            ...serviceOptions,
            {
                title: '',
                type: 'radio',
                is_required: false,
                price: 0,
                options: [{ label: '', price: 0 }],
                display_order: serviceOptions.length,
            },
        ]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...serviceOptions];
        newOptions.splice(index, 1);
        setServiceOptions(newOptions);
    };

    const handleOptionChange = (index: number, field: keyof ServiceOption, value: any) => {
        const newOptions = [...serviceOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setServiceOptions(newOptions);
    };

    const handleChoiceChange = (optionIndex: number, choiceIndex: number, field: keyof OptionChoice, value: any) => {
        const newOptions = [...serviceOptions];
        const newChoices = [...newOptions[optionIndex].options];
        newChoices[choiceIndex] = { ...newChoices[choiceIndex], [field]: value };
        newOptions[optionIndex].options = newChoices;
        setServiceOptions(newOptions);
    };

    const handleAddChoice = (optionIndex: number) => {
        const newOptions = [...serviceOptions];
        newOptions[optionIndex].options.push({ label: '', price: 0 });
        setServiceOptions(newOptions);
    };

    const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
        const newOptions = [...serviceOptions];
        newOptions[optionIndex].options.splice(choiceIndex, 1);
        setServiceOptions(newOptions);
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const url = isEdit ? `/api/admin/services/${params.id}` : '/api/admin/services';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                description: editor?.getHTML() || '',
                images: serviceImages.filter(img => img), // Send all images
                options: serviceOptions,
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'فشل في حفظ الخدمة');

            router.push('/admin/services');
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
            <div className="flex items-center gap-4">
                <Link href="/admin/services" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h1>
                    <p className="text-gray-600 mt-1">{isEdit ? 'تحديث بيانات الخدمة' : 'إضافة خدمة جديدة إلى الموقع'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Basic Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug (للرابط) <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#8F6B43]" dir="ltr" />
                        {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف <span className="text-red-500">*</span></label>
                        <Select
                            value={formData.category_id}
                            onChange={(value) => setFormData({ ...formData, category_id: value })}
                            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                            placeholder="اختر التصنيف"
                        />
                        {errors.category_id && <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العنوان <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#8F6B43]" />
                        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الفرعي</label>
                        <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#8F6B43]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            مقدم الخدمة
                        </label>
                        <input
                            type="text"
                            value={formData.provider_name}
                            onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none"
                            placeholder="اسم مقدم الخدمة"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            شعار مقدم الخدمة
                        </label>
                        <ImageUpload
                            value={formData.provider_logo}
                            onChange={(url) => setFormData({ ...formData, provider_logo: url })}
                            label=""
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            سياسة البائع
                        </label>
                        <textarea
                            value={formData.policy}
                            onChange={(e) => setFormData({ ...formData, policy: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8F6B43] focus:border-transparent outline-none h-32"
                            placeholder="اكتب سياسة البائع هنا..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأساسي (د.ك)</label>
                        <input type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#8F6B43]" />
                        {errors.base_price && <p className="text-sm text-red-600 mt-1">{errors.base_price}</p>}
                    </div>
                </div>



                {/* Multi-Image Upload - Up to 6 images */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            صور الخدمة (حتى 6 صور) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <button
                                type="button"
                                onClick={() => document.getElementById('bulk-upload')?.click()}
                                disabled={loading}
                                className="px-4 py-2 bg-[#8F6B43] text-white rounded-lg hover:bg-[#53131C] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <Upload className="w-4 h-4" />
                                {loading ? 'جاري الرفع...' : 'رفع متعدد (حتى 6 صور)'}
                            </button>
                            <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                💡 نصيحة: سمِّ الصور من 1 إلى 6 (مثل: 1.jpg, 2.jpg) لترتيبها تلقائياً
                            </div>
                        </div>
                    </div>

                    <input
                        id="bulk-upload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        disabled={loading}
                        onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            if (files.length > 6) {
                                alert('يمكنك رفع 6 صور كحد أقصى');
                                toast.error('يمكنك رفع 6 صور كحد أقصى');
                                e.target.value = '';
                                return;
                            }

                            setLoading(true);

                            try {
                                // Sort files by name (numerically if possible)
                                const sortedFiles = files.sort((a, b) => {
                                    const numA = parseInt(a.name.match(/\d+/)?.[0] || '999');
                                    const numB = parseInt(b.name.match(/\d+/)?.[0] || '999');
                                    return numA - numB;
                                });

                                // Import compression utility
                                const { compressImage } = await import('@/lib/image-compression');

                                // Process and upload files in parallel
                                const uploadPromises = sortedFiles.map(async (file) => {
                                    try {
                                        // Compress
                                        const compressedFile = await compressImage(file);

                                        // Upload
                                        const formData = new FormData();
                                        formData.append('file', compressedFile);

                                        const res = await fetch('/api/admin/upload', {
                                            method: 'POST',
                                            body: formData,
                                        });

                                        const data = await res.json();

                                        if (!res.ok) throw new Error(data.error || 'Upload failed');
                                        return data.url;
                                    } catch (err) {
                                        return null;
                                    }
                                });

                                const results = await Promise.all(uploadPromises);
                                const successfulUploads = results.filter((url): url is string => url !== null);

                                if (successfulUploads.length > 0) {
                                    setServiceImages(prev => [...prev, ...successfulUploads]);
                                    toast.success(`تم رفع ${successfulUploads.length} صورة بنجاح!`);
                                } else {
                                    toast.error('فشل رفع جميع الصور. يرجى المحاولة مرة أخرى.');
                                }
                            } catch (error) {
                                toast.error('حدث خطأ أثناء رفع الصور');
                            } finally {
                                setLoading(false);
                                e.target.value = ''; // Reset input
                            }
                        }}
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className={`relative ${serviceImages[index] ? 'cursor-move' : ''}`}
                                draggable={!!serviceImages[index]}
                                onDragStart={(e) => {
                                    if (!serviceImages[index]) return;
                                    // Cast event to DragEvent manually to avoid Framer Motion conflict
                                    const dragEvent = e as unknown as React.DragEvent<HTMLDivElement>;
                                    dragEvent.dataTransfer.effectAllowed = 'move';
                                    dragEvent.dataTransfer.setData('text/plain', index.toString());

                                    // Set drag image to the image element itself
                                    const img = (e.target as HTMLElement).querySelector('img');
                                    if (img) {
                                        dragEvent.dataTransfer.setDragImage(img, 20, 20);
                                    }
                                    (e.target as HTMLElement).style.opacity = '0.5';
                                }}
                                onDragEnd={(e) => {
                                    (e.target as HTMLElement).style.opacity = '1';
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    const dragEvent = e as unknown as React.DragEvent<HTMLDivElement>;
                                    dragEvent.dataTransfer.dropEffect = 'move';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const dragEvent = e as unknown as React.DragEvent<HTMLDivElement>;
                                    const fromIndex = parseInt(dragEvent.dataTransfer.getData('text/plain'));
                                    const toIndex = index;

                                    if (fromIndex === toIndex) return;

                                    const newImages = [...serviceImages];
                                    const [movedImage] = newImages.splice(fromIndex, 1);
                                    newImages.splice(toIndex, 0, movedImage);
                                    setServiceImages(newImages);
                                }}
                            >
                                {serviceImages[index] ? (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative group"
                                    >
                                        <div className="relative rounded-xl border-2 border-gray-200 overflow-hidden group-hover:border-[#8F6B43] transition-all shadow-sm hover:shadow-md">
                                            <img
                                                src={serviceImages[index]}
                                                alt={`صورة ${index + 1}`}
                                                className="w-full h-40 object-cover pointer-events-none select-none"
                                                draggable={false}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs py-2 px-2 text-center font-medium">
                                                صورة {index + 1}
                                            </div>
                                            {/* Drag Handle - Visual only */}
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                                </svg>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => {
                                                const newImages = [...serviceImages];
                                                newImages.splice(index, 1);
                                                setServiceImages(newImages);
                                            }}
                                            className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <ImageUpload
                                        value=""
                                        onChange={(url) => {
                                            const newImages = [...serviceImages];
                                            newImages[index] = url;
                                            setServiceImages(newImages);
                                        }}
                                        label={`صورة ${index + 1}`}
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                    {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
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
                            className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-[#8F6B43] border-gray-300 rounded focus:ring-[#8F6B43]" />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">نشط</label>
                </div>

                {/* Service Options Section */}
                {/* Service Options Section */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">خيارات الخدمة</h2>
                            <p className="text-sm text-gray-500 mt-1">أضف باقات أو إضافات اختيارية للخدمة</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="flex items-center gap-2 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all border border-gray-200 shadow-sm text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" /> إضافة مجموعة
                        </button>
                    </div>

                    <div className="space-y-6">
                        {serviceOptions.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">لا توجد خيارات مضافة. ابدأ بإضافة مجموعة جديدة.</p>
                            </div>
                        )}

                        {serviceOptions.map((option, idx) => (
                            <div key={idx} className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                                {/* Group Header */}
                                <div className="flex justify-between items-start gap-4 mb-6 pb-4 border-b border-gray-100">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-6">
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">عنوان المجموعة</label>
                                            <input
                                                type="text"
                                                placeholder="مثال: باقة الضيافة"
                                                value={option.title}
                                                onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all outline-none text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className="block text-xs font-medium text-gray-500 mb-1.5">نوع الاختيار</label>
                                            <Select
                                                value={option.type}
                                                onChange={(value) => handleOptionChange(idx, 'type', value)}
                                                options={[
                                                    { value: 'radio', label: 'اختيار واحد (Radio)' },
                                                    { value: 'checkbox', label: 'متعدد الاختيارات (Checkbox)' },
                                                    { value: 'select', label: 'قائمة منسدلة (Select)' },
                                                ]}
                                                placeholder="اختر النوع"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-end pb-2">
                                            <label className="flex items-center gap-3 cursor-pointer select-none group/toggle">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={option.is_required}
                                                        onChange={(e) => handleOptionChange(idx, 'is_required', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900 transition-colors"></div>
                                                </div>
                                                <span className="text-sm font-medium text-gray-600 group-hover/toggle:text-gray-900 transition-colors">إجباري</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(idx)}
                                        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                        title="حذف المجموعة"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Choices List */}
                                <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">الخيارات المتاحة</label>
                                        <span className="text-xs text-gray-400">{option.options.length} خيارات</span>
                                    </div>

                                    <div className="space-y-2">
                                        {option.options.map((choice, cIdx) => (
                                            <div key={cIdx} className="flex gap-3 items-center group/choice">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="الاسم (مثال: باقة 1)"
                                                        value={choice.label}
                                                        onChange={(e) => handleChoiceChange(idx, cIdx, 'label', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition-all"
                                                    />
                                                </div>
                                                <div className="w-32 relative">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={choice.price}
                                                        onChange={(e) => handleChoiceChange(idx, cIdx, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 pl-8 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition-all text-left dir-ltr"
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">د.ك</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveChoice(idx, cIdx)}
                                                    className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover/choice:opacity-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddChoice(idx)}
                                        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors w-fit"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> <span>إضافة خيار جديد</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium">
                        <Save className="w-4 h-4" /> <span>{loading ? 'جاري الحفظ...' : 'حفظ'}</span>
                    </button>
                    <Link href="/admin/services" className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700">إلغاء</Link>
                </div>
            </form>
        </motion.div>
    );
}
