"use client"

import { useState, useMemo, CSSProperties, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Globe, ExternalLink, CheckCircle2, AlertTriangle, Clock,
    MoreHorizontal, Trash2, RefreshCw, Copy, ArrowUpRight, MousePointer2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import DomainSetup from "./DomainSetup"
import DomainCard from "./DomainCard"
import { WildcardDomainBanner } from "./WildcardDomainBanner"
import { DomainSearchBox } from "@/components/admin/SearchBox"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useDomains, useDomainActions, type Domain } from "@/hooks/use-domains"

// Animated Empty State Component (Dub Style)
function AnimatedEmptyState({
    title,
    description,
    cardContent,
    cardCount = 3,
    addButton,
}: {
    title: string
    description: ReactNode
    cardContent: ReactNode | ((index: number) => ReactNode)
    cardCount?: number
    addButton?: ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-neutral-200 bg-white px-4 py-10 md:min-h-[500px]">
            {/* Animated Cards */}
            <div className="h-36 w-full max-w-64 overflow-hidden px-4 [mask-image:linear-gradient(transparent,black_10%,black_90%,transparent)]">
                <div
                    style={{ "--scroll": "-50%" } as CSSProperties}
                    className="flex flex-col animate-[infinite-scroll-y_10s_linear_infinite]"
                >
                    {[...Array(cardCount * 2)].map((_, idx) => (
                        <div
                            key={idx}
                            className="mt-4 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_4px_12px_0_rgba(0,0,0,0.05)]"
                        >
                            {typeof cardContent === "function"
                                ? cardContent(idx % cardCount)
                                : cardContent}
                        </div>
                    ))}
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-sm text-pretty text-center">
                <span className="text-base font-medium text-neutral-900">{title}</span>
                <div className="mt-2 text-pretty text-sm text-neutral-500">
                    {description}
                </div>
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-2">
                {addButton}
            </div>
        </div>
    )
}

// Domain Card Placeholder
function DomainCardPlaceholder() {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-200 rounded-lg" />
                <div className="flex-1">
                    <div className="h-4 w-32 bg-neutral-200 rounded" />
                    <div className="h-3 w-20 bg-neutral-100 rounded mt-2" />
                </div>
            </div>
        </div>
    )
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

export default function DomainsPage() {
    const [showAddDomain, setShowAddDomain] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending'>('all')
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    // Use SWR hooks for data fetching
    const { domains: allDomains, loading, mutate } = useDomains()
    const { deleteDomain, verifyDomain, updateDomain, setPrimaryDomain } = useDomainActions()

    // Map domains to include status field
    const domains = useMemo(() =>
        allDomains.map(d => ({
            ...d,
            status: d.verified ? 'verified' as const : 'pending' as const,
        })),
        [allDomains]
    )

    const handleDelete = async (domain: any) => {
        if (!confirm(`هل تريد حذف النطاق ${domain.domain}؟`)) return

        try {
            await deleteDomain(domain.id)
            toast.success('تم حذف النطاق بنجاح')
        } catch (error) {
            toast.error('فشل في حذف النطاق')
        }
    }

    const handleVerify = async (domain: any) => {
        try {
            const result = await verifyDomain(domain.id)
            if (result.verified) {
                toast.success('تم التحقق من النطاق بنجاح!')
            } else {
                toast.info('لم يتم العثور على سجل DNS بعد. يرجى الانتظار.')
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء التحقق')
        }
    }

    const handleSetPrimary = async (domain: any) => {
        try {
            await setPrimaryDomain(domain.id)
            toast.success('تم تعيين النطاق كرئيسي')
        } catch (error) {
            toast.error('فشل في تعيين النطاق كرئيسي')
        }
    }

    const handleEdit = async (domainId: string, newDomain: string, redirectUrl: string) => {
        try {
            await updateDomain(domainId, { redirect_url: redirectUrl })
            toast.success('تم تحديث النطاق')
        } catch (error) {
            toast.error('فشل في تحديث النطاق')
        }
    }

    const filteredDomains = useMemo(() => {
        return domains.filter(domain => {
            const matchesSearch = domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || domain.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [domains, searchQuery, statusFilter])

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'verified':
                return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'مفعّل' }
            case 'pending':
                return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'في انتظار التحقق' }
            case 'failed':
                return { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'فشل' }
            default:
                return { icon: Globe, color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-200', label: 'غير معروف' }
        }
    }

    if (showAddDomain) {
        return <DomainSetup onCancel={() => setShowAddDomain(false)} onSuccess={() => { mutate(); setShowAddDomain(false) }} />
    }

    return (
        <div dir="ltr" className="grid gap-5">
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-6">
                {/* Search Box - Dub Style */}
                <DomainSearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    loading={loading}
                    placeholder="Search domains..."
                />

                {/* Filters & Add Button */}
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    {/* Toggle Group */}
                    <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
                        {[
                            { value: 'all', label: 'الكل' },
                            { value: 'verified', label: 'مفعّل' },
                            { value: 'pending', label: 'في انتظار' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStatusFilter(option.value as any)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                    statusFilter === option.value
                                        ? "bg-neutral-900 text-white"
                                        : "text-neutral-600 hover:text-neutral-900"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Add Button */}
                    <Button
                        onClick={() => setShowAddDomain(true)}
                        className="h-9 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة نطاق
                    </Button>
                </div>
            </div>

            {/* Wildcard Domain Banner */}
            <WildcardDomainBanner
                onLearnMore={() => window.open('https://docs.panaroid.com/wildcard-domains', '_blank')}
                onClaim={() => setShowAddDomain(true)}
            />

            {/* Content */}
            <div className="animate-fade-in">
                {loading ? (
                    /* Loading State */
                    <ul className="grid grid-cols-1 gap-3">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <li key={idx}>
                                <DomainCardPlaceholder />
                            </li>
                        ))}
                    </ul>
                ) : domains.length === 0 ? (
                    /* Empty State - Dub Style */
                    <AnimatedEmptyState
                        title="لا توجد نطاقات مخصصة"
                        description="استخدم النطاقات المخصصة لتعزيز علامتك التجارية وزيادة معدل النقر"
                        cardContent={
                            <>
                                <Globe className="size-4 text-[#FF6500]" />
                                <div className="h-2.5 w-24 min-w-0 rounded-sm bg-neutral-200" />
                                <div className="hidden grow items-center justify-end gap-1.5 text-neutral-500 xs:flex">
                                    <MousePointer2 className="size-3.5" />
                                </div>
                            </>
                        }
                        addButton={
                            <Button
                                onClick={() => setShowAddDomain(true)}
                                className="h-9 rounded-lg bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white hover:from-[#FF4F0F] hover:to-[#E55500] font-semibold shadow-md"
                            >
                                <Plus className="w-4 h-4 ml-2" />
                                أضف نطاقك الأول
                            </Button>
                        }
                    />
                ) : filteredDomains.length === 0 ? (
                    /* No Results */
                    <div className="flex flex-col items-center gap-4 rounded-xl border border-neutral-200 bg-white py-10">
                        <div className="p-3 bg-neutral-100 rounded-full">
                            <Globe className="w-6 h-6 text-neutral-500" />
                        </div>
                        <p className="text-neutral-500 text-sm">لا توجد نتائج مطابقة</p>
                    </div>
                ) : (
                    /* Domain List */
                    <motion.ul
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredDomains.map((domain) => (
                                <motion.li
                                    key={domain.id}
                                    variants={itemVariants}
                                    layout
                                >
                                    <DomainCard
                                        domain={domain}
                                        onDelete={() => handleDelete(domain)}
                                        onVerify={() => handleVerify(domain)}
                                        onEdit={(newDomain, redirectUrl) => handleEdit(domain.id, newDomain, redirectUrl)}
                                        onSetPrimary={() => handleSetPrimary(domain)}
                                    />
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </div>

            {/* Pagination Footer */}
            {domains.length > 0 && (
                <div className="sticky bottom-0 rounded-b-[inherit] border-t border-neutral-200 bg-white px-3.5 py-2">
                    <div className="flex items-center justify-between text-sm text-neutral-500">
                        <span>{domains.length} نطاق</span>
                        {filteredDomains.length !== domains.length && (
                            <span>عرض {filteredDomains.length} من {domains.length}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
