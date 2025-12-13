"use client"

import { useState, useEffect } from "react"
import { Plus, Store, Edit2, Trash2, Globe, Package, FolderTree, Eye, EyeOff, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface StoreData {
    id: string
    tenant_id: string
    name: string
    slug: string
    description?: string
    logo?: string
    is_active: boolean
    created_at: string
    _stats?: {
        products: number
        categories: number
        domains: number
    }
}

export default function StoresPage() {
    const [stores, setStores] = useState<StoreData[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        logo: ''
    })

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/admin/stores')
            const data = await res.json()
            setStores(Array.isArray(data) ? data : [])
        } catch (error) {
            toast.error('فشل في تحميل المتاجر')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingId ? `/api/admin/stores/${editingId}` : '/api/admin/stores'
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tenant_id: stores[0]?.tenant_id // Use same tenant
                })
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed')
            }

            toast.success(editingId ? 'تم تحديث المتجر' : 'تم إنشاء المتجر')
            setShowForm(false)
            setEditingId(null)
            setFormData({ name: '', slug: '', description: '', logo: '' })
            fetchStores()
        } catch (error: any) {
            toast.error(error.message || 'فشل في حفظ المتجر')
        }
    }

    const handleEdit = (store: StoreData) => {
        setEditingId(store.id)
        setFormData({
            name: store.name,
            slug: store.slug,
            description: store.description || '',
            logo: store.logo || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا المتجر؟')) return

        try {
            const res = await fetch(`/api/admin/stores/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed')
            toast.success('تم حذف المتجر')
            fetchStores()
        } catch {
            toast.error('فشل في حذف المتجر')
        }
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6500]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">المتاجر</h1>
                    <p className="text-sm text-neutral-500 mt-1">إدارة متاجرك المتعددة</p>
                </div>
                <Button
                    onClick={() => {
                        setShowForm(true)
                        setEditingId(null)
                        setFormData({ name: '', slug: '', description: '', logo: '' })
                    }}
                    className="bg-[#FF6500] hover:bg-[#FF4F0F] text-white"
                >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة متجر
                </Button>
            </div>

            {/* Stores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                    <div
                        key={store.id}
                        className={cn(
                            "relative overflow-hidden rounded-xl border bg-white p-5 transition-all hover:shadow-lg",
                            store.is_active ? "border-neutral-200" : "border-neutral-100 bg-neutral-50"
                        )}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                            {store.is_active ? (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                                    <Eye className="w-3 h-3" /> نشط
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-600 text-[10px] font-bold rounded-full">
                                    <EyeOff className="w-3 h-3" /> غير نشط
                                </span>
                            )}
                        </div>

                        {/* Store Icon */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] flex items-center justify-center mb-4 shadow-lg shadow-[#FF6500]/20">
                            {store.logo ? (
                                <img src={store.logo} alt={store.name} className="w-8 h-8 rounded" />
                            ) : (
                                <Store className="w-7 h-7 text-white" />
                            )}
                        </div>

                        {/* Store Info */}
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">{store.name}</h3>
                        <p className="text-xs text-neutral-400 font-mono mb-3">/{store.slug}</p>

                        {store.description && (
                            <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{store.description}</p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <Package className="w-3.5 h-3.5" />
                                <span>{store._stats?.products || 0} منتج</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <FolderTree className="w-3.5 h-3.5" />
                                <span>{store._stats?.categories || 0} تصنيف</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                                <Globe className="w-3.5 h-3.5" />
                                <span>{store._stats?.domains || 0} نطاق</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(store)}
                                className="flex-1"
                            >
                                <Edit2 className="w-3.5 h-3.5 ml-1" />
                                تعديل
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(store.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {stores.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                            <Store className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">لا توجد متاجر</h3>
                        <p className="text-sm text-neutral-500 mb-4">ابدأ بإنشاء متجرك الأول</p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="bg-[#FF6500] hover:bg-[#FF4F0F] text-white"
                        >
                            <Plus className="w-4 h-4 ml-2" />
                            إنشاء متجر
                        </Button>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                        <div className="p-5 border-b border-neutral-100">
                            <h2 className="text-lg font-bold text-neutral-900">
                                {editingId ? 'تعديل المتجر' : 'إنشاء متجر جديد'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">اسم المتجر</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData(f => ({
                                            ...f,
                                            name: e.target.value,
                                            slug: !editingId ? generateSlug(e.target.value) : f.slug
                                        }))
                                    }}
                                    placeholder="مثال: متجري الإلكتروني"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">المعرّف (Slug)</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData(f => ({ ...f, slug: e.target.value }))}
                                    placeholder="my-store"
                                    className="font-mono text-sm"
                                    dir="ltr"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">الوصف</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="وصف قصير للمتجر..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">رابط الشعار</label>
                                <Input
                                    value={formData.logo}
                                    onChange={(e) => setFormData(f => ({ ...f, logo: e.target.value }))}
                                    placeholder="https://..."
                                    dir="ltr"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" className="flex-1 bg-[#FF6500] hover:bg-[#FF4F0F] text-white">
                                    {editingId ? 'تحديث' : 'إنشاء'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditingId(null)
                                    }}
                                >
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
