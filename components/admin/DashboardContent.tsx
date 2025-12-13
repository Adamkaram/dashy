"use client"

import { useState, useEffect } from "react"
import { Video, FileText, Lightbulb, ExternalLink, X, ChevronRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentItem {
    id: string
    type: 'video' | 'article' | 'tip'
    title: string
    description?: string
    content: Record<string, any>
}

const TYPE_ICONS = {
    video: Video,
    article: FileText,
    tip: Lightbulb
}

const TYPE_COLORS = {
    video: 'text-red-600 bg-red-50 border-red-200',
    article: 'text-blue-600 bg-blue-50 border-blue-200',
    tip: 'text-amber-600 bg-amber-50 border-amber-200'
}

interface DashboardContentProps {
    location: string
    className?: string
}

export default function DashboardContent({ location, className }: DashboardContentProps) {
    const [content, setContent] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch(`/api/admin/content?location=${location}`)
                const data = await res.json()
                setContent(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error('Failed to fetch content:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchContent()
    }, [location])

    if (loading || content.length === 0) return null

    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
        return match ? match[1] : null
    }

    return (
        <>
            {/* Resources Section - Premium Design */}
            <div className={cn(
                "relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 via-white to-neutral-50 border border-neutral-200",
                className
            )}>
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#FF6500] to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-violet-500 to-transparent rounded-full blur-3xl" />
                </div>

                <div className="relative p-5">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] flex items-center justify-center shadow-lg shadow-[#FF6500]/20">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-white">{content.length}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-neutral-900">Helpful Resources</h3>
                                <p className="text-xs text-neutral-500">Quick guides to help you get started</p>
                            </div>
                        </div>
                    </div>

                    {/* Resources - Horizontal Scroll on Mobile, Grid on Desktop */}
                    <div className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory lg:overflow-visible lg:pb-0">
                        {content.map((item, index) => {
                            const Icon = TYPE_ICONS[item.type]
                            const hasImage = item.content?.image
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={cn(
                                        "group relative flex-shrink-0 w-[280px] lg:w-auto snap-start",
                                        "overflow-hidden rounded-xl bg-white text-left transition-all duration-300",
                                        "border-2 border-transparent hover:border-[#FF6500]/20",
                                        "shadow-sm hover:shadow-xl hover:shadow-[#FF6500]/5",
                                        "hover:-translate-y-1",
                                        hasImage ? "flex flex-col" : "p-4"
                                    )}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Image Header (if available) */}
                                    {hasImage && (
                                        <div className="relative h-32 w-full overflow-hidden">
                                            <img
                                                src={item.content.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            {/* Type Badge on Image */}
                                            <div className={cn(
                                                "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                                item.type === 'video' && "bg-red-500 text-white",
                                                item.type === 'article' && "bg-blue-500 text-white",
                                                item.type === 'tip' && "bg-amber-500 text-white"
                                            )}>
                                                {item.type}
                                            </div>
                                        </div>
                                    )}

                                    {/* Background Glow (no image) */}
                                    {!hasImage && (
                                        <div className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                                            item.type === 'video' && "bg-gradient-to-br from-red-50/50 to-transparent",
                                            item.type === 'article' && "bg-gradient-to-br from-blue-50/50 to-transparent",
                                            item.type === 'tip' && "bg-gradient-to-br from-amber-50/50 to-transparent"
                                        )} />
                                    )}

                                    {/* Content */}
                                    <div className={cn("relative", hasImage ? "p-4" : "")}>
                                        {/* Icon & Title Row */}
                                        <div className="flex items-start gap-3 mb-3">
                                            {!hasImage && (
                                                <div className={cn(
                                                    "relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                                    "group-hover:scale-110 group-hover:rotate-3",
                                                    item.type === 'video' && "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30",
                                                    item.type === 'article' && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30",
                                                    item.type === 'tip' && "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30"
                                                )}>
                                                    {item.type === 'video' ? (
                                                        <>
                                                            <Play className="w-5 h-5 text-white fill-white" />
                                                            <div className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-white" />
                                                        </>
                                                    ) : (
                                                        <Icon className="w-5 h-5 text-white" />
                                                    )}
                                                </div>
                                            )}
                                            <div className={cn("flex-1 min-w-0", !hasImage && "pt-1")}>
                                                <h4 className="font-semibold text-neutral-900 text-sm line-clamp-2 group-hover:text-[#FF6500] transition-colors">
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full",
                                                    item.type === 'video' && "bg-red-100 text-red-700",
                                                    item.type === 'article' && "bg-blue-100 text-blue-700",
                                                    item.type === 'tip' && "bg-amber-100 text-amber-700"
                                                )}>
                                                    {item.type === 'video' ? '▶ Watch' : item.type === 'article' ? '📄 Read' : '💡 Tip'}
                                                </span>
                                                {item.type === 'article' && item.content?.read_time && (
                                                    <span className="text-[10px] text-neutral-400">{item.content.read_time}</span>
                                                )}
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-[#FF6500] flex items-center justify-center transition-all duration-300">
                                                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content Modal - Premium Design */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up-fade"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header with Gradient */}
                        <div className={cn(
                            "relative p-5 border-b",
                            selectedItem.type === 'video' && "bg-gradient-to-r from-red-50 to-white border-red-100",
                            selectedItem.type === 'article' && "bg-gradient-to-r from-blue-50 to-white border-blue-100",
                            selectedItem.type === 'tip' && "bg-gradient-to-r from-amber-50 to-white border-amber-100"
                        )}>
                            {/* Decorative Corner */}
                            <div className={cn(
                                "absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-30 pointer-events-none",
                                selectedItem.type === 'video' && "bg-gradient-to-br from-red-200 to-transparent",
                                selectedItem.type === 'article' && "bg-gradient-to-br from-blue-200 to-transparent",
                                selectedItem.type === 'tip' && "bg-gradient-to-br from-amber-200 to-transparent"
                            )} />

                            <div className="relative flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Icon or Image */}
                                    {selectedItem.content?.image ? (
                                        <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-lg">
                                            <img src={selectedItem.content.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
                                            selectedItem.type === 'video' && "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30",
                                            selectedItem.type === 'article' && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30",
                                            selectedItem.type === 'tip' && "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30"
                                        )}>
                                            {(() => {
                                                const Icon = TYPE_ICONS[selectedItem.type]
                                                return selectedItem.type === 'video'
                                                    ? <Play className="w-6 h-6 text-white fill-white" />
                                                    : <Icon className="w-6 h-6 text-white" />
                                            })()}
                                        </div>
                                    )}
                                    <div className="pt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={cn(
                                                "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full",
                                                selectedItem.type === 'video' && "bg-red-100 text-red-700",
                                                selectedItem.type === 'article' && "bg-blue-100 text-blue-700",
                                                selectedItem.type === 'tip' && "bg-amber-100 text-amber-700"
                                            )}>
                                                {selectedItem.type}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-neutral-900">{selectedItem.title}</h2>
                                        {selectedItem.description && (
                                            <p className="text-sm text-neutral-500 mt-1">{selectedItem.description}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="shrink-0 w-10 h-10 rounded-xl bg-white/80 hover:bg-white border border-neutral-200 flex items-center justify-center transition-colors shadow-sm"
                                >
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                            {/* Video Content */}
                            {selectedItem.type === 'video' && selectedItem.content.url && (
                                <div className="space-y-4">
                                    <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-xl">
                                        {getYouTubeId(selectedItem.content.url) ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedItem.content.url)}?autoplay=0&rel=0`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-white" />
                                                </div>
                                                <a
                                                    href={selectedItem.content.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    Open Video
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Article Content */}
                            {selectedItem.type === 'article' && (
                                <div className="prose prose-neutral max-w-none">
                                    <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <p className="whitespace-pre-wrap text-neutral-700 leading-relaxed">
                                            {selectedItem.content.body}
                                        </p>
                                    </div>
                                    {selectedItem.content.read_time && (
                                        <div className="flex items-center gap-2 mt-4 text-sm text-neutral-400">
                                            <FileText className="w-4 h-4" />
                                            <span>Reading time: {selectedItem.content.read_time}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tip Content */}
                            {selectedItem.type === 'tip' && (
                                <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                                    <div className="absolute top-4 right-4 text-6xl opacity-10">💡</div>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb className="w-5 h-5 text-amber-600" />
                                            <span className="text-sm font-semibold text-amber-700">Pro Tip</span>
                                        </div>
                                        <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedItem.content.body}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                Close
                            </button>
                            {selectedItem.type === 'video' && selectedItem.content.url && (
                                <a
                                    href={selectedItem.content.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#FF6500] hover:bg-[#FF4F0F] text-white rounded-lg text-sm font-medium shadow-md shadow-[#FF6500]/20 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in YouTube
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
