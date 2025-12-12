'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Select } from '@/components/ui/Select';
import { Upload, X, Plus, Trash2, GripVertical, AlertCircle, ImagePlus, ArrowRight, Save, Layers, FileText, Sparkles, Info, Truck, Shield, Leaf, Heart, Ruler, ChevronDown, ChevronUp, Sliders, Package, Gem, Star, Palette, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import FileUpload from '@/components/ui/file-upload';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface OptionChoice {
    label: string;
    price: number;
    value?: string;
    quantity?: number;
    sku?: string;
}

interface ProductOption {
    id?: string;
    title: string;
    type: 'radio' | 'checkbox' | 'select';
    display_style: 'text' | 'color' | 'size';
    is_required: boolean;
    price: number;
    options: OptionChoice[];
    display_order: number;
}

// Sortable Item Wrapper for Drag and Drop
interface SortableItemProps {
    id: string;
    children: (listeners: any) => React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style as React.CSSProperties} {...attributes}>
            {children(listeners)}
        </div>
    );
}

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = !!params?.id;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        slug: '',
        category_id: '',
        title: '',
        image: '',
        description: '',
        base_price: 0,
        sale_price: 0,
        is_active: true,
        // Inventory & product fields
        sku: '',
        brand: '',
        quantity: 0,
        low_stock_threshold: 5,
        metadata: {
            note: '', // Legacy hook
            sections: [] as { title: string; content: string; icon?: string }[],
        } as Record<string, any>,
    });
    const [isSaleEnabled, setIsSaleEnabled] = useState(false);
    const [productImages, setProductImages] = useState<string[]>([]);
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    // Initialize Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'اكتب وصف المنتج هنا...',
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
            fetchProduct();
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

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/admin/products/${params.id}`);
            if (!res.ok) return;
            const data = await res.json();

            if (data && !data.error) {
                setFormData({
                    slug: data.slug || '',
                    category_id: data.category?.id || data.category_id || '',
                    title: data.title || '',
                    image: data.image || '',
                    description: data.description || '',
                    base_price: data.base_price || 0,
                    sale_price: data.sale_price || 0,
                    is_active: data.is_active ?? true,
                    // Inventory fields
                    sku: data.sku || '',
                    brand: data.brand || '',
                    quantity: data.quantity || 0,
                    low_stock_threshold: data.low_stock_threshold || 5,
                    metadata: {
                        ...data.metadata,
                        note: data.metadata?.note || '',
                        sections: Array.isArray(data.metadata?.sections)
                            ? data.metadata.sections
                            : [
                                // Migration for legacy fields if sections don't exist
                                data.metadata?.materials ? { title: 'Materials', content: data.metadata.materials } : null,
                                data.metadata?.shipping_returns ? { title: 'Shipping & Returns', content: data.metadata.shipping_returns } : null,
                                data.metadata?.care_instructions ? { title: 'Care Instructions', content: data.metadata.care_instructions } : null,
                            ].filter(Boolean),
                    },
                });

                if (data.sale_price && data.sale_price > 0) {
                    setIsSaleEnabled(true);
                }

                if (data.options && Array.isArray(data.options)) {
                    setProductOptions(data.options);
                }

                if (data.images && Array.isArray(data.images)) {
                    const imageUrls = data.images.map((img: any) => img.imageUrl || img.image_url);
                    setProductImages(imageUrls);
                }
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        }
    };

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
        if (!formData.category_id) newErrors.category_id = 'التصنيف مطلوب';
        if (!formData.title.trim()) newErrors.title = 'العنوان مطلوب';
        if (formData.base_price < 0) newErrors.base_price = 'السعر يجب أن يكون موجباً';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddOption = () => {
        setProductOptions([
            ...productOptions,
            {
                title: '',
                type: 'radio',
                display_style: 'text',
                is_required: false,
                price: 0,
                options: [],
                display_order: productOptions.length
            }
        ]);
    };

    // Quick preset for sizes
    const handleAddSizePreset = () => {
        setProductOptions([
            ...productOptions,
            {
                title: 'المقاس',
                type: 'radio',
                display_style: 'size',
                is_required: true,
                price: 0,
                options: [
                    { label: 'S', price: 0, quantity: 0 },
                    { label: 'M', price: 0, quantity: 0 },
                    { label: 'L', price: 0, quantity: 0 },
                    { label: 'XL', price: 0, quantity: 0 },
                    { label: 'XXL', price: 0, quantity: 0 },
                ],
                display_order: productOptions.length
            }
        ]);
    };

    // Quick preset for colors
    const handleAddColorPreset = () => {
        setProductOptions([
            ...productOptions,
            {
                title: 'اللون',
                type: 'radio',
                display_style: 'color',
                is_required: true,
                price: 0,
                options: [
                    { label: 'أسود', value: '#000000', price: 0, quantity: 0 },
                    { label: 'أبيض', value: '#FFFFFF', price: 0, quantity: 0 },
                    { label: 'أحمر', value: '#EF4444', price: 0, quantity: 0 },
                    { label: 'أزرق', value: '#3B82F6', price: 0, quantity: 0 },
                    { label: 'أخضر', value: '#22C55E', price: 0, quantity: 0 },
                ],
                display_order: productOptions.length
            }
        ]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...productOptions];
        newOptions.splice(index, 1);
        setProductOptions(newOptions);
    };

    const handleOptionChange = (index: number, field: keyof ProductOption, value: any) => {
        const newOptions = [...productOptions];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setProductOptions(newOptions);
    };

    const handleAddChoice = (optionIndex: number) => {
        const newOptions = [...productOptions];
        newOptions[optionIndex].options.push({ label: '', price: 0 });
        setProductOptions(newOptions);
    };

    const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
        const newOptions = [...productOptions];
        newOptions[optionIndex].options.splice(choiceIndex, 1);
        setProductOptions(newOptions);
    };

    const handleChoiceChange = (optionIndex: number, choiceIndex: number, field: keyof OptionChoice, value: any) => {
        const newOptions = [...productOptions];
        // @ts-ignore
        newOptions[optionIndex].options[choiceIndex][field] = value;
        setProductOptions(newOptions);
    };

    // Metadata Sections Handlers
    const handleAddSection = () => {
        const currentSections = formData.metadata.sections || [];
        setFormData({
            ...formData,
            metadata: {
                ...formData.metadata,
                sections: [...currentSections, { title: '', content: '', icon: 'Info' }]
            }
        });
    };

    const handleRemoveSection = (index: number) => {
        const currentSections = [...(formData.metadata.sections || [])];
        currentSections.splice(index, 1);
        setFormData({
            ...formData,
            metadata: {
                ...formData.metadata,
                sections: currentSections
            }
        });
    };

    const handleSectionChange = (index: number, field: 'title' | 'content' | 'icon', value: string) => {
        const currentSections = [...(formData.metadata.sections || [])];
        currentSections[index] = { ...currentSections[index], [field]: value };
        setFormData({
            ...formData,
            metadata: {
                ...formData.metadata,
                sections: currentSections
            }
        });
    };

    // Drag and Drop Handlers
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleMetadataDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const currentSections = formData.metadata.sections || [];
            const oldIndex = currentSections.findIndex((_: any, i: number) => `metadata-${i}` === active.id);
            const newIndex = currentSections.findIndex((_: any, i: number) => `metadata-${i}` === over.id);
            const newSections = arrayMove(currentSections, oldIndex, newIndex);
            setFormData({
                ...formData,
                metadata: {
                    ...formData.metadata,
                    sections: newSections
                }
            });
        }
    };

    const handleOptionsDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = productOptions.findIndex((_, i) => `option-${i}` === active.id);
            const newIndex = productOptions.findIndex((_, i) => `option-${i}` === over.id);
            const newOptions = arrayMove(productOptions, oldIndex, newIndex);
            setProductOptions(newOptions);
        }
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const url = isEdit ? `/api/admin/products/${params.id}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                description: editor?.getHTML() || '',
                images: productImages.filter(img => img), // Send all images
                options: productOptions,
                sale_price: isSaleEnabled ? formData.sale_price : 0, // Enforce 0 if disabled
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'فشل في حفظ المنتج');

            router.push('/admin/products');
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
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
                    <p className="text-gray-600 mt-1">{isEdit ? 'تحديث بيانات المنتج' : 'إضافة منتج جديد إلى الموقع'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Basic Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug (للرابط) <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]" dir="ltr" />
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
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]" />
                        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأساسي (ج.م)</label>
                        <input type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]" />
                        {errors.base_price && <p className="text-sm text-red-600 mt-1">{errors.base_price}</p>}
                    </div>
                </div>

                {/* Sale Price Section - Toggler */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">تخفيض / عرض خاص</span>
                            <span className="text-xs text-gray-500">تفعيل سعر مخفض لهذا المنتج</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isSaleEnabled} onChange={(e) => {
                                setIsSaleEnabled(e.target.checked);
                                if (!e.target.checked) setFormData({ ...formData, sale_price: 0 });
                            }} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6500]"></div>
                        </label>
                    </div>

                    {isSaleEnabled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">سعر التخفيض (ج.م)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.sale_price}
                                onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]"
                            />
                            <p className="text-xs text-gray-500 mt-1">يجب أن يكون أقل من السعر الأساسي</p>
                        </motion.div>
                    )}
                </div>

                {/* Inventory & Product Info Section */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-800">المخزون ومعلومات المنتج</h3>
                            <p className="text-xs text-neutral-500">SKU، العلامة التجارية، الكمية</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* SKU */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">رمز المنتج (SKU)</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="مثال: SHIRT-001"
                                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">العلامة التجارية</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="مثال: Nike"
                                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">الكمية المتاحة</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                            />
                            <p className="text-[10px] text-neutral-400 mt-1">للمنتجات البسيطة. المتغيرات لها كمية منفصلة.</p>
                        </div>

                        {/* Low Stock Threshold */}
                        <div>
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">حد التنبيه للمخزون</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.low_stock_threshold}
                                onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 5 })}
                                className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                            />
                            <p className="text-[10px] text-neutral-400 mt-1">تنبيه عندما يقل المخزون عن هذا الرقم</p>
                        </div>
                    </div>
                </div>

                {/* Multi-Image Upload with Integrated Preview */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                            <ImagePlus className="w-4 h-4" />
                            صور المنتج <span className="text-red-500">*</span>
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                            قم برفع صور المنتج هنا. يمكنك رفع أي عدد من الصور.
                        </p>
                    </div>

                    <FileUpload
                        acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/gif"]}
                        maxFileSize={5 * 1024 * 1024}
                        previewUrls={productImages}
                        onFilesSelect={async (files) => {
                            for (const file of files) {
                                try {
                                    // Compress
                                    const { compressImage } = await import('@/lib/image-compression');
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

                                    // Add to state
                                    setProductImages(prev => [...prev, data.url]);
                                    toast.success('تم رفع الصورة بنجاح');
                                } catch (err) {
                                    toast.error('فشل رفع الصورة');
                                    console.error(err);
                                }
                            }
                        }}
                        onRemovePreview={(index) => {
                            setProductImages(prev => prev.filter((_, i) => i !== index));
                        }}
                        onError={(message) => {
                            toast.error(message);
                        }}
                    />
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
                            className="min-h-[200px] [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 text-[#FF6500] border-gray-300 rounded focus:ring-[#FF6500]" />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">نشط</label>
                </div>

                {/* Product Options Section - Premium Redesign */}
                <div className="relative bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 overflow-hidden">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF6500]/10 to-transparent rounded-bl-[4rem] pointer-events-none" />

                    {/* Header */}
                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6500]/20">
                                <Sliders className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    خيارات المنتج
                                    <span className="text-xs font-normal text-gray-400">(Product Options)</span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">خيارات تفاعلية يختار منها العميل (المقاس، اللون، الباقات...)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAddSizePreset}
                                className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg transition-all text-sm font-medium border border-neutral-200"
                                title="إضافة مقاسات جاهزة"
                            >
                                <Ruler className="w-4 h-4" /> المقاسات
                            </button>
                            <button
                                type="button"
                                onClick={handleAddColorPreset}
                                className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-2 rounded-lg transition-all text-sm font-medium border border-neutral-200"
                                title="إضافة ألوان جاهزة"
                            >
                                <Palette className="w-4 h-4" /> الألوان
                            </button>
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="flex items-center gap-2 bg-[#FF6500] hover:bg-[#FF4F0F] text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md shadow-[#FF6500]/20"
                            >
                                <Plus className="w-4 h-4" /> مخصص
                            </button>
                        </div>
                    </div>

                    {/* Options List with Drag and Drop */}
                    <div className="space-y-4">
                        {productOptions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 bg-orange-50/30 rounded-xl border-2 border-dashed border-orange-200">
                                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Sliders className="w-6 h-6 text-[#FF6500]" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">لا توجد مجموعات خيارات</p>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs text-center">أضف مجموعة خيارات ليختار منها العميل</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleAddSizePreset}
                                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-all"
                                    >
                                        <Ruler className="w-4 h-4" /> المقاسات
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddColorPreset}
                                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-all"
                                    >
                                        <Palette className="w-4 h-4" /> الألوان
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="flex items-center gap-2 text-sm font-medium text-[#FF6500] hover:text-[#FF4F0F] px-4 py-2 rounded-lg border border-[#FF6500]/30 hover:bg-[#FF6500]/5 transition-all"
                                    >
                                        <Plus className="w-4 h-4" /> مخصص
                                    </button>
                                </div>
                            </div>
                        )}

                        {productOptions.length > 0 && (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleOptionsDragEnd}
                            >
                                <SortableContext
                                    items={productOptions.map((_, i) => `option-${i}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {productOptions.map((option, idx) => (
                                        <SortableItem key={`option-${idx}`} id={`option-${idx}`}>
                                            {(listeners: any) => (
                                                <div className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                                                    {/* Option Header */}
                                                    <div className="flex items-center gap-3 p-4 bg-gray-50/50 border-b border-gray-100">
                                                        {/* Grip Handle - Now Draggable */}
                                                        <div
                                                            {...listeners}
                                                            className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors touch-none"
                                                        >
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>

                                                        {/* Option Number Badge */}
                                                        <div className="flex-shrink-0 w-8 h-8 bg-[#FF6500] rounded-lg flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">{idx + 1}</span>
                                                        </div>

                                                        {/* Title Input */}
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                placeholder="عنوان المجموعة (مثال: المقاس)"
                                                                value={option.title}
                                                                onChange={(e) => handleOptionChange(idx, 'title', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none text-sm font-medium transition-all"
                                                            />
                                                        </div>

                                                        {/* Required Toggle */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOptionChange(idx, 'is_required', !option.is_required)}
                                                            className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border transition-all ${option.is_required
                                                                ? 'bg-[#FF6500]/10 border-[#FF6500]/30 text-[#FF6500]'
                                                                : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${option.is_required
                                                                ? 'bg-[#FF6500] border-[#FF6500]'
                                                                : 'bg-white border-neutral-300'}`}>
                                                                {option.is_required && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                                            </div>
                                                            <span className="font-medium">مطلوب</span>
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOption(idx)}
                                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="حذف المجموعة"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Option Body */}
                                                    <div className="p-4 space-y-4">
                                                        {/* Type and Display Style Row */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {/* Selection Type - Visual Tabs */}
                                                            <div className="space-y-2">
                                                                <label className="block text-xs font-medium text-gray-500">نوع الاختيار</label>
                                                                <div className="flex gap-2">
                                                                    {[
                                                                        { value: 'radio', label: 'واحد', icon: '◉' },
                                                                        { value: 'checkbox', label: 'متعدد', icon: '☑' },
                                                                        { value: 'select', label: 'قائمة', icon: '▼' },
                                                                    ].map((type) => (
                                                                        <button
                                                                            key={type.value}
                                                                            type="button"
                                                                            onClick={() => handleOptionChange(idx, 'type', type.value)}
                                                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${option.type === type.value
                                                                                ? 'bg-[#FF6500] text-white shadow-md'
                                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                                }`}
                                                                        >
                                                                            <span>{type.icon}</span>
                                                                            <span>{type.label}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Display Style - Visual Tabs */}
                                                            <div className="space-y-2">
                                                                <label className="block text-xs font-medium text-gray-500">نمط العرض في الموقع</label>
                                                                <div className="flex gap-2">
                                                                    {[
                                                                        { value: 'text', label: 'نص', Icon: FileText },
                                                                        { value: 'size', label: 'مقاس', Icon: Ruler },
                                                                        { value: 'color', label: 'ألوان', Icon: Palette },
                                                                    ].map(({ value, label, Icon }) => (
                                                                        <button
                                                                            key={value}
                                                                            type="button"
                                                                            onClick={() => handleOptionChange(idx, 'display_style', value)}
                                                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${(option.display_style || 'text') === value
                                                                                ? 'bg-[#FF6500] text-white shadow-md'
                                                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                                                }`}
                                                                        >
                                                                            <Icon className="w-3.5 h-3.5" />
                                                                            <span>{label}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Choices Section */}
                                                        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                                                    الخيارات المتاحة
                                                                    <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold">{option.options.length}</span>
                                                                </label>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <AnimatePresence mode="popLayout">
                                                                    {option.options.map((choice, cIdx) => (
                                                                        <motion.div
                                                                            key={cIdx}
                                                                            layout
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            exit={{ opacity: 0, x: 10 }}
                                                                            className="flex gap-2 items-center group/choice"
                                                                        >
                                                                            {/* Grip Handle for choices */}
                                                                            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover/choice:opacity-100">
                                                                                <GripVertical className="w-4 h-4" />
                                                                            </div>

                                                                            {/* Choice Label */}
                                                                            <div className="flex-1">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="الاسم (مثال: كبير)"
                                                                                    value={choice.label}
                                                                                    onChange={(e) => handleChoiceChange(idx, cIdx, 'label', e.target.value)}
                                                                                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none text-sm transition-all"
                                                                                />
                                                                            </div>

                                                                            {/* Color Picker (conditional) */}
                                                                            {option.display_style === 'color' && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className="w-10 h-10 rounded-lg border-2 border-gray-200 overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                                                                                        <input
                                                                                            type="color"
                                                                                            value={choice.value || '#000000'}
                                                                                            onChange={(e) => handleChoiceChange(idx, cIdx, 'value', e.target.value)}
                                                                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] p-0 m-0 cursor-pointer border-none"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {/* Price Input */}
                                                                            <div className="w-24 relative">
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="0"
                                                                                    value={choice.price}
                                                                                    onChange={(e) => handleChoiceChange(idx, cIdx, 'price', parseFloat(e.target.value) || 0)}
                                                                                    className="w-full px-3 py-2.5 pl-9 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none text-sm transition-all text-left dir-ltr"
                                                                                />
                                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">ج.م</span>
                                                                            </div>

                                                                            {/* Quantity Input */}
                                                                            <div className="w-20 relative group/qty">
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="الكمية"
                                                                                    min="0"
                                                                                    value={choice.quantity || ''}
                                                                                    onChange={(e) => handleChoiceChange(idx, cIdx, 'quantity', parseInt(e.target.value) || 0)}
                                                                                    className="w-full px-2 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] outline-none text-sm transition-all text-center"
                                                                                    title="الكمية المتاحة"
                                                                                />
                                                                            </div>

                                                                            {/* Delete Choice */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveChoice(idx, cIdx)}
                                                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/choice:opacity-100"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                        </motion.div>
                                                                    ))}
                                                                </AnimatePresence>
                                                            </div>

                                                            {/* Add Choice Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddChoice(idx)}
                                                                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all w-fit"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                <span>إضافة خيار</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>

                    {/* Advanced Options (Metadata) - Collapsible */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                            className="w-full flex items-center justify-between gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-50 hover:from-orange-100 hover:to-orange-100 border border-orange-200/50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-lg flex items-center justify-center shadow-sm">
                                    <Layers className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                        خيارات متقدمة
                                        <span className="text-xs font-normal text-gray-400">(Advanced)</span>
                                    </span>
                                    <p className="text-xs text-gray-500">أقسام قابلة للتوسيع (المواد، الشحن، المقاسات...)</p>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: showAdvancedOptions ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {showAdvancedOptions && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 space-y-4">
                                        {/* Note Field */}
                                        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-[#FF6500]" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-sm font-medium text-gray-700">ملاحظة عامة</label>
                                                    <p className="text-xs text-gray-400">تظهر بشكل بارز أعلى الأكورديون</p>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.metadata.note || ''}
                                                onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, note: e.target.value } })}
                                                placeholder="مثال: يرجى غسل القطعة قبل الاستخدام الأول..."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] outline-none text-sm transition-all"
                                            />
                                        </div>

                                        {/* Sections List Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700">أقسام التفاصيل</span>
                                                <span className="bg-orange-100 text-[#FF6500] px-2 py-0.5 rounded-full text-xs font-medium">
                                                    {formData.metadata.sections?.length || 0}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddSection}
                                                className="flex items-center gap-1.5 text-sm font-medium text-[#FF6500] hover:text-[#FF4F0F] px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-all"
                                            >
                                                <Plus className="w-4 h-4" /> إضافة قسم
                                            </button>
                                        </div>

                                        {/* Sections List */}
                                        <div className="space-y-3">
                                            {(!formData.metadata.sections || formData.metadata.sections.length === 0) && (
                                                <div className="flex flex-col items-center justify-center py-8 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
                                                    <Layers className="w-8 h-8 text-gray-300 mb-2" />
                                                    <p className="text-sm text-gray-500">لا توجد أقسام</p>
                                                    <p className="text-xs text-gray-400">أضف أقساماً مثل "الخامة" أو "الشحن"</p>
                                                </div>
                                            )}

                                            {formData.metadata.sections && formData.metadata.sections.length > 0 && (
                                                <DndContext
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleMetadataDragEnd}
                                                >
                                                    <SortableContext
                                                        items={(formData.metadata.sections || []).map((_: any, i: number) => `metadata-${i}`)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {(formData.metadata.sections || []).map((section: any, idx: number) => (
                                                            <SortableItem key={`metadata-${idx}`} id={`metadata-${idx}`}>
                                                                {(listeners: any) => (
                                                                    <div className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                                                                        <div className="flex items-center gap-3 p-3 bg-orange-50/30 border-b border-gray-100">
                                                                            <div {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#FF6500] transition-colors touch-none">
                                                                                <GripVertical className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="flex-shrink-0 w-6 h-6 bg-[#FF6500] rounded flex items-center justify-center">
                                                                                <span className="text-white text-xs font-bold">{idx + 1}</span>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="عنوان القسم"
                                                                                value={section.title}
                                                                                onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                                                                                className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-[#FF6500] outline-none"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveSection(idx)}
                                                                                className="p-1.5 text-gray-300 hover:text-red-500 rounded transition-all opacity-0 group-hover:opacity-100"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="p-3 space-y-3">
                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                {[
                                                                                    { icon: Package, name: 'package' },
                                                                                    { icon: Sparkles, name: 'sparkles' },
                                                                                    { icon: Truck, name: 'truck' },
                                                                                    { icon: Shield, name: 'shield' },
                                                                                    { icon: Gem, name: 'gem' },
                                                                                    { icon: Leaf, name: 'leaf' },
                                                                                    { icon: Heart, name: 'heart' },
                                                                                    { icon: Ruler, name: 'ruler' },
                                                                                    { icon: Palette, name: 'palette' },
                                                                                    { icon: Star, name: 'star' },
                                                                                    { icon: Info, name: 'info' },
                                                                                ].map(({ icon: Icon, name }) => (
                                                                                    <button
                                                                                        key={name}
                                                                                        type="button"
                                                                                        onClick={() => handleSectionChange(idx, 'icon', name)}
                                                                                        className={`p-1.5 rounded transition-all ${section.icon === name ? 'bg-[#FF6500] text-white shadow-sm' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700'}`}
                                                                                    >
                                                                                        <Icon className="w-4 h-4" />
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                            <textarea
                                                                                placeholder="محتوى القسم..."
                                                                                value={section.content}
                                                                                onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                                                                                rows={3}
                                                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FF6500] outline-none text-sm resize-none"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </SortableItem>
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-[#FF6500] text-white px-6 py-2.5 rounded-md hover:bg-[#FF4F0F] transition-colors disabled:opacity-50 font-medium">
                        <Save className="w-4 h-4" /> <span>{loading ? 'جاري الحفظ...' : 'حفظ'}</span>
                    </button>
                    <Link href="/admin/products" className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-gray-700">إلغاء</Link>
                </div>
            </form >
        </motion.div >
    );
}
