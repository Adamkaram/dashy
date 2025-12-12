"use client"

import { useState, Fragment, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe, ChevronDown, MoreHorizontal, ExternalLink, Copy, Check,
    Trash2, Edit, QrCode, Archive, Settings, RefreshCw,
    Info, AlertCircle, CheckCircle2, Clock, Flag, CornerDownRight,
    Pencil, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface DomainCardProps {
    domain: {
        id: string
        domain: string
        status: 'pending' | 'verified' | 'failed'
        is_primary?: boolean
        clicks?: number
        verification_token?: string
        redirect_url?: string
        created_at?: string
    }
    onDelete?: () => void
    onVerify?: () => void
    onEdit?: (domain: string, redirectUrl: string) => void
    onSetPrimary?: () => void
}

type RecordType = 'A' | 'CNAME'

export default function DomainCard({ domain, onDelete, onVerify, onEdit, onSetPrimary }: DomainCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editDomain, setEditDomain] = useState(domain.domain)
    const [editRedirectUrl, setEditRedirectUrl] = useState(domain.redirect_url || '')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [groupHover, setGroupHover] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const isSubdomain = domain.domain.split('.').length > 2
    const isInvalid = domain.status !== 'verified'

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopied(field)
        toast.success('تم النسخ!')
        setTimeout(() => setCopied(null), 2000)
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await onVerify?.()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    const handleSaveEdit = () => {
        onEdit?.(editDomain, editRedirectUrl)
        setIsEditing(false)
        toast.success('تم تحديث النطاق')
    }

    const getStatusConfig = () => {
        switch (domain.status) {
            case 'verified':
                return {
                    variant: 'success',
                    label: 'Active',
                    labelAr: 'نشط',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-600',
                    dotColor: 'bg-green-500'
                }
            case 'pending':
                return {
                    variant: 'pending',
                    label: 'Pending',
                    labelAr: 'قيد الانتظار',
                    bgColor: 'bg-amber-500/10',
                    textColor: 'text-amber-600',
                    dotColor: 'bg-amber-500'
                }
            case 'failed':
                return {
                    variant: 'error',
                    label: 'Invalid',
                    labelAr: 'غير صالح',
                    bgColor: 'bg-red-500/10',
                    textColor: 'text-red-600',
                    dotColor: 'bg-red-500'
                }
            default:
                return {
                    variant: 'pending',
                    label: 'Pending',
                    labelAr: 'قيد الانتظار',
                    bgColor: 'bg-amber-500/10',
                    textColor: 'text-amber-600',
                    dotColor: 'bg-amber-500'
                }
        }
    }

    const statusConfig = getStatusConfig()

    // TXT Record for verification (matching Go service)
    const txtRecordName = `_panaroid.${domain.domain}`
    const txtRecordValue = domain.verification_token || 'panaroid-verify-xxx'

    return (
        <div
            className="group rounded-xl border border-neutral-200 bg-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            onMouseEnter={() => setGroupHover(true)}
            onMouseLeave={() => setGroupHover(false)}
        >
            <div className="p-4 sm:p-5">
                {/* Main Row */}
                <div className="grid grid-cols-[1.5fr_1fr] items-center gap-3 sm:grid-cols-[3fr_1fr_1.5fr] sm:gap-4 md:grid-cols-[2fr_1fr_0.5fr_1.5fr]">

                    {/* Domain Title Column - Dub Style */}
                    <div className="flex min-w-0 items-center gap-4">
                        {/* Icon with gradient border */}
                        <div className="hidden rounded-full border border-neutral-200 sm:block">
                            <div className="rounded-full border border-white bg-gradient-to-t from-neutral-100 p-2">
                                <Globe className="size-5 text-neutral-700" />
                            </div>
                        </div>

                        {/* Domain Info */}
                        <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5 sm:gap-2.5">
                                {isEditing ? (
                                    <Input
                                        value={editDomain}
                                        onChange={(e) => setEditDomain(e.target.value)}
                                        className="h-7 w-40 text-sm"
                                        dir="ltr"
                                        autoFocus
                                    />
                                ) : (
                                    <a
                                        href={`https://${domain.domain}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate text-sm font-medium text-neutral-900 hover:underline"
                                        dir="ltr"
                                    >
                                        {domain.domain}
                                    </a>
                                )}

                                {domain.is_primary && !isEditing && (
                                    <span className="flex items-center gap-1 rounded-full bg-sky-400/[.15] px-2 py-0.5 text-xs font-medium text-sky-600">
                                        <Flag className="hidden h-3 w-3 sm:block" />
                                        Primary
                                    </span>
                                )}
                            </div>

                            {/* Redirect URL */}
                            <div className="mt-1 flex items-center gap-1 text-xs">
                                <CornerDownRight className="h-3 w-3 text-neutral-400" />
                                {isEditing ? (
                                    <Input
                                        value={editRedirectUrl}
                                        onChange={(e) => setEditRedirectUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="h-6 w-48 text-xs"
                                        dir="ltr"
                                    />
                                ) : domain.redirect_url ? (
                                    <a
                                        href={domain.redirect_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="truncate text-neutral-500 transition-all hover:text-neutral-700 hover:underline hover:underline-offset-2"
                                        dir="ltr"
                                    >
                                        {domain.redirect_url.replace(/^https?:\/\//, '')}
                                    </a>
                                ) : (
                                    <span className="truncate text-neutral-400">
                                        No redirect configured
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Clicks Counter - Hidden on mobile */}
                    <div className="hidden md:flex">
                        <button className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 transition-colors hover:bg-neutral-100">
                            <svg viewBox="0 0 18 18" className="size-4 text-neutral-700" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.125 9.75L9.75 12.375L16.5 3.75M2.25 9.75L4.875 12.375M12.375 3.75L9.75 7.125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-xs font-medium text-neutral-900">
                                {domain.clicks?.toLocaleString() || 0}
                                <span className="ml-1 hidden text-neutral-500 sm:inline">clicks</span>
                            </span>
                        </button>
                    </div>

                    {/* Status Badge - Hidden on mobile */}
                    <div className="hidden sm:block">
                        <button
                            onClick={() => setShowDetails(s => !s)}
                            className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
                                statusConfig.bgColor,
                                statusConfig.textColor,
                                "hover:opacity-80"
                            )}
                        >
                            <span className={cn("size-1.5 rounded-full", statusConfig.dotColor)} />
                            {statusConfig.label}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 sm:gap-3">
                        {/* Edit Mode Buttons */}
                        {isEditing ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8 bg-neutral-900 text-white hover:bg-neutral-800"
                                    onClick={handleSaveEdit}
                                >
                                    <Check className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Settings Button - Shows on hover or when invalid */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "h-8 px-2.5 gap-1 transition-all duration-200 border-neutral-200",
                                        !showDetails && !isInvalid && "sm:opacity-0 sm:group-hover:opacity-100"
                                    )}
                                    onClick={() => setShowDetails(s => !s)}
                                >
                                    <div className="relative">
                                        <Settings className={cn("w-4 h-4 transition-colors", showDetails ? "text-neutral-800" : "text-neutral-600")} />
                                        {isInvalid && (
                                            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown className={cn(
                                        "hidden h-4 w-4 text-neutral-400 transition-transform duration-200 sm:block",
                                        showDetails && "rotate-180"
                                    )} />
                                </Button>

                                {/* Action Buttons Group - With hover effects */}
                                <div className="flex items-center divide-x divide-neutral-200 rounded-md border border-neutral-200 overflow-hidden">
                                    {/* Edit Button - Shows on group hover */}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className={cn(
                                            "items-center justify-center h-8 px-3 transition-colors hover:bg-neutral-100",
                                            groupHover ? "flex" : "hidden sm:hidden"
                                        )}
                                    >
                                        <Pencil className="w-4 h-4 text-neutral-600" />
                                    </button>

                                    {/* Refresh Button - Shows on group hover */}
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className={cn(
                                            "items-center justify-center h-8 px-3 transition-colors hover:bg-neutral-100 disabled:opacity-50",
                                            groupHover ? "flex" : "hidden sm:hidden"
                                        )}
                                    >
                                        <RefreshCw className={cn("w-4 h-4 text-neutral-600", isRefreshing && "animate-spin")} />
                                    </button>

                                    {/* More Options Dropdown - Always visible */}
                                    <div className="relative" ref={menuRef}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2.5 rounded-none border-0"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setOpenMenu(!openMenu)
                                            }}
                                        >
                                            <MoreHorizontal className="w-5 h-5 text-neutral-600" />
                                        </Button>

                                        <AnimatePresence>
                                            {openMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-50 overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {/* Link Settings */}
                                                    <div className="p-2">
                                                        <p className="mb-1.5 mt-1 px-1 text-xs font-medium text-neutral-500">
                                                            Link Settings
                                                        </p>
                                                        <button
                                                            onClick={() => { setIsEditing(true); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            Edit Link
                                                        </button>
                                                        <button
                                                            onClick={() => { toast.info('QR Code coming soon'); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            <QrCode className="w-4 h-4" />
                                                            QR Code
                                                        </button>
                                                        <button
                                                            onClick={() => { copyToClipboard(domain.id, 'id'); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            {copied === 'id' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                            Copy Link ID
                                                        </button>
                                                    </div>

                                                    <div className="border-t border-neutral-100" />

                                                    {/* Domain Settings */}
                                                    <div className="p-2">
                                                        <p className="mb-1.5 mt-1 px-1 text-xs font-medium text-neutral-500">
                                                            Domain Settings
                                                        </p>
                                                        {!domain.is_primary && domain.status === 'verified' && (
                                                            <button
                                                                onClick={() => { onSetPrimary?.(); setOpenMenu(false) }}
                                                                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                            >
                                                                <Flag className="w-4 h-4" />
                                                                Set as Primary
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => { setIsEditing(true); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                            Edit Domain
                                                        </button>
                                                        <button
                                                            onClick={() => { toast.info('Transfer coming soon'); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 8.5L7 4.5M7 4.5L11 8.5M7 4.5V13.5C7 14.6046 7.89543 15.5 9 15.5H21M21 15.5L17 11.5M21 15.5L17 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            Transfer
                                                        </button>
                                                        <button
                                                            onClick={() => { toast.info('Archive coming soon'); setOpenMenu(false) }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md transition-colors"
                                                        >
                                                            <Archive className="w-4 h-4" />
                                                            Archive
                                                        </button>
                                                        <button
                                                            onClick={() => { setOpenMenu(false); onDelete?.() }}
                                                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Expandable Details Section */}
                <motion.div
                    initial={false}
                    animate={{ height: showDetails ? 'auto' : 0, opacity: showDetails ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="pt-5">
                        {domain.status === 'verified' ? (
                            /* Verified State */
                            <div className="flex items-center gap-2 rounded-lg bg-green-100/80 p-3 text-sm text-green-700">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <div>
                                    Good news! Your DNS records are set up correctly, but it can take some time for them to propagate globally.{' '}
                                    <a href="#" className="underline hover:text-green-800">Learn more.</a>
                                </div>
                            </div>
                        ) : (
                            /* Configuration Needed - CNAME Record */
                            <div className="space-y-5">
                                {/* Instructions Header */}
                                <div className="text-sm text-neutral-600">
                                    <p className="font-medium text-neutral-900 mb-2">
                                        اتبع الخطوات أدناه لربط نطاقك المخصص:
                                    </p>
                                </div>

                                {/* Step by Step Instructions */}
                                <div className="space-y-4">
                                    {/* Step 1 */}
                                    <div className="flex gap-3">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                                            1
                                        </div>
                                        <p className="text-sm text-neutral-600 pt-0.5">
                                            قم بتسجيل الدخول إلى موقع مزود النطاق الخاص بك (مثل GoDaddy أو Namecheap).
                                        </p>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-3">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                                            2
                                        </div>
                                        <p className="text-sm text-neutral-600 pt-0.5">
                                            انتقل إلى إعدادات DNS أو قسم إدارة DNS.
                                        </p>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-3">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
                                            3
                                        </div>
                                        <p className="text-sm text-neutral-600 pt-0.5">
                                            أضف سجل CNAME جديد بالمعلومات التالية:
                                        </p>
                                    </div>
                                </div>

                                {/* CNAME Record Table - Dub Style */}
                                <div className="rounded-lg bg-neutral-100/80 overflow-hidden" dir="ltr">
                                    <div className="grid grid-cols-[80px_1fr_32px] items-center gap-x-4 p-4">
                                        {/* Header */}
                                        <p className="text-xs font-semibold text-neutral-600 uppercase">Type</p>
                                        <p className="text-xs font-semibold text-neutral-600 uppercase">Name</p>
                                        <div />

                                        {/* Row 1 - CNAME Record */}
                                        <p className="font-mono text-sm text-neutral-700 py-2">CNAME</p>
                                        <p className="font-mono text-sm text-neutral-700 py-2">
                                            {isSubdomain ? domain.domain.split('.')[0] : 'www'}
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard(isSubdomain ? domain.domain.split('.')[0] : 'www', 'name')}
                                            className="p-1.5 hover:bg-neutral-200 rounded-md transition-colors"
                                        >
                                            {copied === 'name' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-neutral-500" />
                                            )}
                                        </button>

                                        {/* Header 2 */}
                                        <p className="text-xs font-semibold text-neutral-600 uppercase pt-2 border-t border-neutral-200">Value</p>
                                        <p className="text-xs font-semibold text-neutral-600 uppercase pt-2 border-t border-neutral-200">Points to</p>
                                        <div className="border-t border-neutral-200" />

                                        {/* Row 2 - Target */}
                                        <p className="font-mono text-sm text-neutral-500 py-2">→</p>
                                        <p className="font-mono text-sm text-blue-600 py-2 font-medium">
                                            cname.panaroid.com
                                        </p>
                                        <button
                                            onClick={() => copyToClipboard('cname.panaroid.com', 'value')}
                                            className="p-1.5 hover:bg-neutral-200 rounded-md transition-colors"
                                        >
                                            {copied === 'value' ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-neutral-500" />
                                            )}
                                        </button>
                                    </div>

                                    {/* TTL Note */}
                                    <div className="bg-neutral-200/50 px-4 py-2 text-xs text-neutral-600" dir="ltr">
                                        TTL: <span className="font-mono font-medium">3600</span> (Auto)
                                    </div>
                                </div>

                                {/* Info Note */}
                                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <p className="text-sm">
                                        قد يستغرق انتشار DNS حتى 24 ساعة. بعد إضافة السجل، اضغط على "تحقق الآن".
                                    </p>
                                </div>

                                {/* Verify Button */}
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleRefresh}
                                        className="gap-2"
                                        disabled={isRefreshing}
                                    >
                                        <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                                        تحقق الآن
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
