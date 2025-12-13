"use client"

import { useState, useEffect } from "react"
import { Plus, Video, FileText, Lightbulb, Trash2, Edit2, Eye, EyeOff, X, Save, Settings2, Database, Layout, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { pageConfigs } from "@/lib/admin-page-config"

interface DashboardContent {
    id: string
    type: 'video' | 'article' | 'tip'
    title: string
    description?: string
    content: Record<string, any>
    category: string
    display_location: string[]
    is_active: boolean
    display_order: number
    created_at: string
}

const TYPE_CONFIG = {
    video: { icon: Video, label: 'فيديو', labelEn: 'Video', color: 'text-red-600 bg-red-50 border-red-100' },
    article: { icon: FileText, label: 'مقال', labelEn: 'Article', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    tip: { icon: Lightbulb, label: 'نصيحة', labelEn: 'Tip', color: 'text-amber-600 bg-amber-50 border-amber-100' }
}

const CATEGORIES = [
    { value: 'general', label: 'عام', labelEn: 'General' },
    { value: 'domains', label: 'النطاقات', labelEn: 'Domains' },
    { value: 'products', label: 'المنتجات', labelEn: 'Products' },
    { value: 'orders', label: 'الطلبات', labelEn: 'Orders' }
]

// Generate LOCATIONS dynamically from pageConfigs
const LOCATIONS = Object.entries(pageConfigs).map(([path, config]) => ({
    value: path.replace('/admin', '').replace('/', '') || 'dashboard',
    path: path,
    label: config.titleAr,
    labelEn: config.title
})).map(loc => ({
    ...loc,
    // Convert path to location key (e.g., /admin/domains -> domains_page)
    value: loc.value === '' ? 'dashboard' : `${loc.value}_page`
}))

function SettingSection({
    title,
    description,
    icon: Icon,
    children,
    action
}: {
    title: string
    description?: string
    icon?: any
    children: React.ReactNode
    action?: React.ReactNode
}) {
    return (
        <div className="hover:drop-shadow-card-hover rounded-xl border border-neutral-200 bg-white transition-[filter]">
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100">
                            <Icon className="w-5 h-5 text-neutral-600" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
                        {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
                    </div>
                </div>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </div>
    )
}

function ContentCard({
    item,
    onEdit,
    onDelete,
    onToggle
}: {
    item: DashboardContent
    onEdit: () => void
    onDelete: () => void
    onToggle: () => void
}) {
    const config = TYPE_CONFIG[item.type]

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-xl border transition-all duration-200",
            item.is_active
                ? "border-neutral-200 bg-white hover:border-neutral-300 hover:drop-shadow-card-hover"
                : "border-neutral-100 bg-neutral-50/50"
        )}>
            {/* Left Color Accent Bar */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-all",
                item.type === 'video' && "bg-red-500",
                item.type === 'article' && "bg-blue-500",
                item.type === 'tip' && "bg-amber-500",
                !item.is_active && "opacity-30"
            )} />

            <div className="flex items-stretch">
                {/* Icon Section */}
                <div className={cn(
                    "flex items-center justify-center w-20 border-r",
                    item.is_active ? "border-neutral-100" : "border-neutral-100/50"
                )}>
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105",
                        config.color,
                        !item.is_active && "opacity-50"
                    )}>
                        <config.icon className="w-6 h-6" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                    "font-semibold truncate",
                                    item.is_active ? "text-neutral-900" : "text-neutral-500"
                                )}>
                                    {item.title}
                                </h4>
                                <span className={cn(
                                    "flex-shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold",
                                    item.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-neutral-200 text-neutral-500"
                                )}>
                                    {item.is_active ? 'Active' : 'Hidden'}
                                </span>
                            </div>
                            <p className={cn(
                                "text-sm line-clamp-1",
                                item.is_active ? "text-neutral-500" : "text-neutral-400"
                            )}>
                                {item.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                {item.display_location.map(loc => (
                                    <span
                                        key={loc}
                                        className={cn(
                                            "text-xs px-2.5 py-1 rounded-md font-medium",
                                            item.is_active
                                                ? "bg-neutral-100 text-neutral-600"
                                                : "bg-neutral-100/50 text-neutral-400"
                                        )}
                                    >
                                        {LOCATIONS.find(l => l.value === loc)?.labelEn || loc}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={onToggle}
                                className={cn(
                                    "p-2.5 rounded-lg transition-all",
                                    item.is_active
                                        ? "hover:bg-green-50 text-green-600"
                                        : "hover:bg-neutral-100 text-neutral-400"
                                )}
                                title={item.is_active ? 'Hide' : 'Show'}
                            >
                                {item.is_active ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </button>
                            <button
                                onClick={onEdit}
                                className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2.5 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const [content, setContent] = useState<DashboardContent[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        type: 'video' as 'video' | 'article' | 'tip',
        title: '',
        description: '',
        content: {} as Record<string, any>,
        category: 'general',
        display_location: ['dashboard'],
        is_active: true
    })

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/admin/content?active=false')
            const data = await res.json()
            setContent(data)
        } catch (error) {
            toast.error('فشل في تحميل المحتوى')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContent()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate editingId if we're updating
        if (editingId && (editingId === 'undefined' || !editingId.match(/^[0-9a-f-]{36}$/i))) {
            console.error('Invalid editingId:', editingId)
            toast.error('خطأ في معرف المحتوى')
            return
        }

        try {
            const url = editingId ? `/api/admin/content/${editingId}` : '/api/admin/content'
            console.log('Submitting to:', url, 'editingId:', editingId)
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                console.error('API Error:', res.status, errorData)
                throw new Error(errorData.error || 'Failed')
            }
            toast.success(editingId ? 'تم تحديث المحتوى' : 'تم إضافة المحتوى')
            setShowForm(false)
            setEditingId(null)
            resetForm()
            fetchContent()
        } catch (error: any) {
            console.error('Submit error:', error)
            toast.error(error.message || 'فشل في حفظ المحتوى')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('هل تريد حذف هذا المحتوى؟')) return
        try {
            await fetch(`/api/admin/content/${id}`, { method: 'DELETE' })
            toast.success('تم حذف المحتوى')
            fetchContent()
        } catch (error) {
            toast.error('فشل في حذف المحتوى')
        }
    }

    const handleEdit = (item: DashboardContent) => {
        console.log('handleEdit called with item:', item)
        console.log('item.id:', item.id)

        if (!item.id) {
            console.error('Item has no ID!', item)
            toast.error('خطأ: المحتوى بدون معرف')
            return
        }

        setFormData({
            type: item.type,
            title: item.title,
            description: item.description || '',
            content: item.content,
            category: item.category,
            display_location: item.display_location,
            is_active: item.is_active
        })
        setEditingId(item.id)
        setShowForm(true)
    }

    const toggleActive = async (item: DashboardContent) => {
        try {
            await fetch(`/api/admin/content/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !item.is_active })
            })
            fetchContent()
        } catch (error) {
            toast.error('فشل في تحديث الحالة')
        }
    }

    const resetForm = () => {
        setFormData({
            type: 'video',
            title: '',
            description: '',
            content: {},
            category: 'general',
            display_location: ['dashboard'],
            is_active: true
        })
    }

    return (
        <div dir="ltr" className="space-y-6">
            {/* Stats Overview - Top Section */}
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                    const count = content.filter(c => c.type === type).length
                    const activeCount = content.filter(c => c.type === type && c.is_active).length
                    return (
                        <div
                            key={type}
                            className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 hover:border-neutral-300 hover:drop-shadow-card-hover transition-all cursor-pointer group"
                            onClick={() => { resetForm(); setFormData(f => ({ ...f, type: type as any })); setShowForm(true); setEditingId(null) }}
                        >
                            {/* Decorative gradient */}
                            <div className={cn(
                                "absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-50 transition-opacity group-hover:opacity-80 pointer-events-none",
                                type === 'video' && "bg-gradient-to-br from-red-100 to-transparent",
                                type === 'article' && "bg-gradient-to-br from-blue-100 to-transparent",
                                type === 'tip' && "bg-gradient-to-br from-amber-100 to-transparent"
                            )} />

                            <div className="relative flex items-start justify-between">
                                <div>
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 border", config.color)}>
                                        <config.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-3xl font-bold text-neutral-900">{count}</p>
                                    <p className="text-sm text-neutral-500 mt-0.5">{config.labelEn}s</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                                        {activeCount} active
                                    </span>
                                    <Plus className="w-5 h-5 text-neutral-300 group-hover:text-[#FF6500] transition-colors mt-2" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 3-Column Kanban Board */}
            <div className="grid grid-cols-3 gap-4">
                {(['video', 'article', 'tip'] as const).map(type => {
                    const config = TYPE_CONFIG[type]
                    const items = content.filter(c => c.type === type)
                    const activeCount = items.filter(i => i.is_active).length

                    return (
                        <div
                            key={type}
                            className="flex flex-col rounded-xl border border-neutral-200 bg-neutral-50/50 overflow-hidden"
                        >
                            {/* Column Header */}
                            <div className={cn(
                                "p-4 border-b",
                                type === 'video' && "bg-gradient-to-r from-red-50 to-red-25 border-red-100",
                                type === 'article' && "bg-gradient-to-r from-blue-50 to-blue-25 border-blue-100",
                                type === 'tip' && "bg-gradient-to-r from-amber-50 to-amber-25 border-amber-100"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border", config.color)}>
                                            <config.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-neutral-900">{config.labelEn}s</h3>
                                            <p className="text-xs text-neutral-500">{activeCount} active • {items.length} total</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setFormData(f => ({ ...f, type }));
                                            setShowForm(true);
                                            setEditingId(null)
                                        }}
                                        className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                            type === 'video' && "bg-red-100 hover:bg-red-200 text-red-600",
                                            type === 'article' && "bg-blue-100 hover:bg-blue-200 text-blue-600",
                                            type === 'tip' && "bg-amber-100 hover:bg-amber-200 text-amber-600"
                                        )}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Column Content */}
                            <div className="flex-1 p-3 space-y-2 min-h-[200px] max-h-[500px] overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-400"></div>
                                    </div>
                                ) : items.length === 0 ? (
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setFormData(f => ({ ...f, type }));
                                            setShowForm(true);
                                            setEditingId(null)
                                        }}
                                        className="w-full py-8 rounded-lg border-2 border-dashed border-neutral-200 hover:border-neutral-300 hover:bg-white transition-all flex flex-col items-center gap-2 group"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                            type === 'video' && "bg-red-50 group-hover:bg-red-100",
                                            type === 'article' && "bg-blue-50 group-hover:bg-blue-100",
                                            type === 'tip' && "bg-amber-50 group-hover:bg-amber-100"
                                        )}>
                                            <Plus className={cn(
                                                "w-5 h-5",
                                                type === 'video' && "text-red-400",
                                                type === 'article' && "text-blue-400",
                                                type === 'tip' && "text-amber-400"
                                            )} />
                                        </div>
                                        <span className="text-sm text-neutral-400">Add {config.labelEn}</span>
                                    </button>
                                ) : (
                                    items.map(item => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "group relative bg-white rounded-lg border p-3 transition-all cursor-pointer",
                                                item.is_active
                                                    ? "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                                                    : "border-neutral-100 opacity-50"
                                            )}
                                            onClick={() => handleEdit(item)}
                                        >
                                            {/* Status Dot */}
                                            <div className={cn(
                                                "absolute top-3 right-3 w-2 h-2 rounded-full",
                                                item.is_active ? "bg-green-500" : "bg-neutral-300"
                                            )} />

                                            <h4 className="font-medium text-neutral-900 text-sm pr-4 line-clamp-1">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                                                {item.description || 'No description'}
                                            </p>

                                            {/* Location Tags */}
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {item.display_location.slice(0, 2).map(loc => (
                                                    <span
                                                        key={loc}
                                                        className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded"
                                                    >
                                                        {LOCATIONS.find(l => l.value === loc)?.labelEn.split(' ')[0] || loc}
                                                    </span>
                                                ))}
                                                {item.display_location.length > 2 && (
                                                    <span className="text-[10px] text-neutral-400">
                                                        +{item.display_location.length - 2}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute bottom-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleActive(item) }}
                                                    className={cn(
                                                        "p-1.5 rounded transition-colors",
                                                        item.is_active ? "hover:bg-green-50 text-green-600" : "hover:bg-neutral-100 text-neutral-400"
                                                    )}
                                                >
                                                    {item.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-up-fade overflow-hidden">
                        {/* Premium Header with Gradient */}
                        <div className="relative bg-gradient-to-r from-neutral-50 to-white p-5 border-b border-neutral-100">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF6500]/10 to-transparent rounded-bl-[3rem] pointer-events-none" />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6500]/20">
                                        <Settings2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-neutral-900">
                                            {editingId ? 'Edit Content' : 'Add New Content'}
                                        </h2>
                                        <p className="text-sm text-neutral-500">
                                            {editingId ? 'Update content details' : 'Create a new content item'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowForm(false); setEditingId(null) }}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Content Type Selection */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">Content Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['video', 'article', 'tip'] as const).map(type => {
                                        const config = TYPE_CONFIG[type]
                                        const isSelected = formData.type === type
                                        return (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData(f => ({ ...f, type }))}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                                                    isSelected
                                                        ? "border-[#FF6500] bg-[#FF6500]/5 shadow-md shadow-[#FF6500]/10"
                                                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                                )}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF6500] rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className={cn(
                                                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-[#FF6500]/10" : "bg-neutral-100"
                                                )}>
                                                    <config.icon className={cn("w-5 h-5", isSelected ? "text-[#FF6500]" : "text-neutral-400")} />
                                                </div>
                                                <span className={cn("text-sm font-medium", isSelected ? "text-[#FF6500]" : "text-neutral-600")}>{config.labelEn}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5 uppercase tracking-wide">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Enter title..."
                                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5 uppercase tracking-wide">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Short description..."
                                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                />
                            </div>

                            {/* Video URL */}
                            {formData.type === 'video' && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1.5 uppercase tracking-wide">Video URL</label>
                                    <input
                                        type="text"
                                        value={formData.content.url || ''}
                                        onChange={e => setFormData(f => ({ ...f, content: { ...f.content, url: e.target.value } }))}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                    />
                                </div>
                            )}

                            {/* Article/Tip Body */}
                            {(formData.type === 'article' || formData.type === 'tip') && (
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1.5 uppercase tracking-wide">
                                        {formData.type === 'article' ? 'Article Body' : 'Tip Text'}
                                    </label>
                                    <textarea
                                        value={formData.content.body || ''}
                                        onChange={e => setFormData(f => ({ ...f, content: { ...f.content, body: e.target.value } }))}
                                        placeholder={formData.type === 'article' ? 'Article content...' : 'Quick tip...'}
                                        className="w-full h-28 px-4 py-3 bg-white border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                    />
                                </div>
                            )}

                            {/* Image URL - For all content types */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5 uppercase tracking-wide">
                                    <div className="flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Image URL (Optional)
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={formData.content.image || ''}
                                    onChange={e => setFormData(f => ({ ...f, content: { ...f.content, image: e.target.value } }))}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] text-sm transition-all"
                                />
                                {formData.content.image && (
                                    <div className="mt-2 relative rounded-lg overflow-hidden border border-neutral-200 h-32">
                                        <img
                                            src={formData.content.image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Category & Status - Custom Styled */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Category Selection */}
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">Category</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {CATEGORIES.map(cat => {
                                            const isSelected = formData.category === cat.value
                                            return (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setFormData(f => ({ ...f, category: cat.value }))}
                                                    className={cn(
                                                        "px-3 py-2 text-xs font-medium rounded-lg border transition-all",
                                                        isSelected
                                                            ? "border-[#FF6500] bg-[#FF6500]/10 text-[#FF6500]"
                                                            : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                                                    )}
                                                >
                                                    {cat.labelEn}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Status Selection */}
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">Status</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(f => ({ ...f, is_active: true }))}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-all",
                                                formData.is_active
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                formData.is_active ? "bg-green-500" : "bg-neutral-300"
                                            )} />
                                            Active
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(f => ({ ...f, is_active: false }))}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border transition-all",
                                                !formData.is_active
                                                    ? "border-neutral-400 bg-neutral-100 text-neutral-700"
                                                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                !formData.is_active ? "bg-neutral-500" : "bg-neutral-300"
                                            )} />
                                            Hidden
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Display Locations - Custom Toggle Buttons */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-2 uppercase tracking-wide">Display Locations</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {LOCATIONS.map(loc => {
                                        const isSelected = formData.display_location.includes(loc.value)
                                        return (
                                            <button
                                                key={loc.value}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setFormData(f => ({ ...f, display_location: f.display_location.filter(l => l !== loc.value) }))
                                                    } else {
                                                        setFormData(f => ({ ...f, display_location: [...f.display_location, loc.value] }))
                                                    }
                                                }}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium",
                                                    isSelected
                                                        ? "border-[#FF6500] bg-[#FF6500]/5 text-[#FF6500]"
                                                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 rounded flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-[#FF6500]" : "bg-neutral-200"
                                                )}>
                                                    {isSelected && (
                                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {loc.labelEn}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-5 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingId(null) }}
                                    className="px-4 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#FF6500] hover:bg-[#FF4F0F] rounded-lg shadow-md shadow-[#FF6500]/20 transition-all"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingId ? 'Update Content' : 'Create Content'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
