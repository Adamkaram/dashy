"use client"

import { useState, Fragment, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe, ChevronDown, MoreHorizontal, ExternalLink, Copy, Check,
    Trash2, Edit, QrCode, Archive, Settings, RefreshCw,
    Info, AlertCircle, CheckCircle2, Clock, Flag, CornerDownRight,
    Pencil, X, Store
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface StoreOption {
    id: string
    name: string
}

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
        store_id?: string
        store_name?: string
    }
    stores?: StoreOption[]
    onDelete?: () => void
    onVerify?: () => void
    onEdit?: (domain: string, redirectUrl: string) => void
    onSetPrimary?: () => void
    onLinkToStore?: (storeId: string) => void
}

type RecordType = 'A' | 'CNAME'

export default function DomainCard({ domain, stores, onDelete, onVerify, onEdit, onSetPrimary, onLinkToStore }: DomainCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editDomain, setEditDomain] = useState(domain.domain)
    const [editRedirectUrl, setEditRedirectUrl] = useState(domain.redirect_url || '')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [verifyState, setVerifyState] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle')
    const [groupHover, setGroupHover] = useState(false)
    const [showStoreSelector, setShowStoreSelector] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

    const isSubdomain = domain.domain.split('.').length > 2
    const isInvalid = domain.status !== 'verified'

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (
                menuRef.current && !menuRef.current.contains(target) &&
                buttonRef.current && !buttonRef.current.contains(target)
            ) {
                setOpenMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Calculate menu position when opening
    const updateMenuPosition = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.right - 192, // w-48 = 192px - align with action buttons
            })
        }
    }, [])

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopied(field)
        toast.success('تم النسخ!')
        setTimeout(() => setCopied(null), 2000)
    }

    const handleRefresh = async () => {
        setVerifyState('verifying')
        setIsRefreshing(true)
        try {
            await onVerify?.()
            // Check if domain is now verified (we'll check via the domain prop)
            // For now, we show success briefly then reset
            if (domain.status === 'verified') {
                setVerifyState('success')
            } else {
                // Simulate checking - in real app this would check updated status
                setVerifyState('failed')
                setTimeout(() => setVerifyState('idle'), 3000)
            }
        } catch (error) {
            setVerifyState('failed')
            setTimeout(() => setVerifyState('idle'), 3000)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Update verify state when domain status changes
    useEffect(() => {
        if (domain.status === 'verified') {
            setVerifyState('success')
        }
    }, [domain.status])

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
            className="hover:drop-shadow-card-hover group rounded-xl border border-neutral-200 bg-white transition-[filter]"
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

                            {/* Store Association */}
                            {stores && stores.length > 0 && (
                                <div className="mt-1 flex items-center gap-1 text-xs relative">
                                    <Store className="h-3 w-3 text-neutral-400" />
                                    <button
                                        onClick={() => setShowStoreSelector(!showStoreSelector)}
                                        className={cn(
                                            "flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                                            domain.store_name
                                                ? "text-[#FF6500] hover:bg-orange-50"
                                                : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                                        )}
                                    >
                                        {domain.store_name || 'No store linked'}
                                        <ChevronDown className={cn("h-3 w-3 transition-transform", showStoreSelector && "rotate-180")} />
                                    </button>

                                    {/* Store Dropdown */}
                                    {showStoreSelector && (
                                        <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 min-w-[160px] py-1">
                                            {stores.map((store) => (
                                                <button
                                                    key={store.id}
                                                    onClick={() => {
                                                        onLinkToStore?.(store.id)
                                                        setShowStoreSelector(false)
                                                    }}
                                                    className={cn(
                                                        "w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-neutral-50 transition-colors text-left",
                                                        domain.store_id === store.id && "bg-orange-50 text-[#FF6500]"
                                                    )}
                                                >
                                                    <Store className="h-3 w-3" />
                                                    {store.name}
                                                    {domain.store_id === store.id && (
                                                        <Check className="h-3 w-3 ml-auto" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
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

                    {/* Status Badge - Dub Style */}
                    <div className="hidden sm:block">
                        <button
                            onClick={() => setShowDetails(s => !s)}
                            className={cn(
                                "flex gap-1.5 items-center max-w-fit rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap cursor-pointer select-none transition-[filter] duration-150 hover:brightness-75 hover:saturate-[1.25]",
                                domain.status === 'verified' && "bg-green-500/[.15] text-green-600",
                                domain.status === 'pending' && "bg-amber-500/[.15] text-amber-600",
                                domain.status === 'failed' && "bg-red-500/[.15] text-red-600"
                            )}
                        >
                            {domain.status === 'verified' ? (
                                <CheckCircle2 className="h-3 w-3 shrink-0" />
                            ) : domain.status === 'pending' ? (
                                <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0">
                                    <g fill="currentColor">
                                        <circle cx="9" cy="9" fill="none" r="7.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="9" x2="12" y1="9" y2="9" />
                                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="9" x2="9" y1="5" y2="9" />
                                    </g>
                                </svg>
                            ) : (
                                <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0">
                                    <g fill="currentColor">
                                        <circle cx="9" cy="9" fill="none" r="7.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" x1="9" x2="9" y1="5.431" y2="9.569" />
                                        <path d="M9,13.417c-.552,0-1-.449-1-1s.448-1,1-1,1,.449,1,1-.448,1-1,1Z" fill="currentColor" stroke="none" />
                                    </g>
                                </svg>
                            )}
                            {domain.status === 'verified' ? 'Active' : domain.status === 'pending' ? 'Pending' : 'Invalid'}
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

                                {/* Action Buttons Group - Dub Style with Framer Motion */}
                                <motion.div
                                    animate={{
                                        width: groupHover ? "auto" : 39,
                                    }}
                                    initial={false}
                                    className="flex items-center justify-end divide-x divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 sm:divide-transparent sm:group-hover:divide-neutral-200"
                                >
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="group flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm transition-all border-transparent text-neutral-600 hover:bg-neutral-100 h-8 rounded-none border-0 px-3"
                                    >
                                        <Pencil className="w-4 h-4 shrink-0" />
                                    </button>

                                    {/* Refresh Button */}
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="group flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm transition-all border-transparent text-neutral-600 hover:bg-neutral-100 h-8 rounded-none border-0 px-3 disabled:opacity-50"
                                    >
                                        <RefreshCw className={cn("w-4 h-4 shrink-0 -scale-100 transition-colors [animation-duration:0.25s]", isRefreshing && "animate-spin")} />
                                    </button>

                                    {/* More Options Dropdown */}
                                    <button
                                        ref={buttonRef}
                                        type="button"
                                        className="group flex w-full items-center justify-center gap-2 whitespace-nowrap text-sm border-transparent text-neutral-600 hover:bg-neutral-100 sm:inline-flex h-8 rounded-none border-0 px-2 transition-[border-color] duration-200"
                                        onClick={() => {
                                            if (!openMenu) {
                                                updateMenuPosition()
                                            }
                                            setOpenMenu(!openMenu)
                                        }}
                                    >
                                        <MoreHorizontal className="w-5 h-5 shrink-0" />
                                    </button>
                                </motion.div>

                                {/* Dropdown Portal - Renders outside overflow containers */}
                                {openMenu && typeof document !== 'undefined' && createPortal(
                                    <div
                                        ref={menuRef}
                                        dir="ltr"
                                        className="animate-slide-up-fade fixed w-48 rounded-lg border border-neutral-200 bg-white drop-shadow-lg z-[9999]"
                                        style={{ top: menuPosition.top, left: menuPosition.left }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Link Settings */}
                                        <div className="grid gap-px p-2">
                                            <p className="mb-1.5 mt-1 flex items-center gap-2 px-1 text-xs font-medium text-neutral-500">
                                                Link Settings
                                            </p>
                                            <button
                                                onClick={() => { setIsEditing(true); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Edit Link
                                            </button>
                                            <button
                                                onClick={() => { toast.info('QR Code coming soon'); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                <QrCode className="h-4 w-4" />
                                                QR Code
                                            </button>
                                            <button
                                                onClick={() => { copyToClipboard(domain.id, 'id'); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                {copied === 'id' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                Copy Link ID
                                            </button>
                                        </div>

                                        <div className="border-t border-neutral-200" />

                                        {/* Domain Settings */}
                                        <div className="grid gap-px p-2">
                                            <p className="mb-1.5 mt-1 flex items-center gap-2 px-1 text-xs font-medium text-neutral-500">
                                                Domain Settings
                                            </p>
                                            <button
                                                onClick={() => { setIsEditing(true); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit Domain
                                            </button>
                                            {!domain.is_primary && domain.status === 'verified' && (
                                                <button
                                                    onClick={() => { onSetPrimary?.(); setOpenMenu(false) }}
                                                    className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                                >
                                                    <Flag className="h-4 w-4" />
                                                    Set as Primary
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { toast.info('Transfer coming soon'); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 8.5L7 4.5M7 4.5L11 8.5M7 4.5V13.5C7 14.6046 7.89543 15.5 9 15.5H21M21 15.5L17 11.5M21 15.5L17 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Transfer
                                            </button>
                                            <button
                                                onClick={() => { toast.info('Archive coming soon'); setOpenMenu(false) }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                                            >
                                                <Archive className="h-4 w-4" />
                                                Archive
                                            </button>
                                            <button
                                                onClick={() => { setOpenMenu(false); onDelete?.() }}
                                                className="flex h-9 w-full items-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>,
                                    document.body
                                )}
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

                                {/* DNS Record Table - Exact Dub Style */}
                                <div className="scrollbar-hide grid items-end gap-x-10 gap-y-1 overflow-x-auto rounded-lg bg-neutral-100/80 p-4 text-sm text-left grid-cols-[repeat(4,max-content)]" dir="ltr">
                                    {/* Headers */}
                                    <p className="font-medium text-neutral-950">Type</p>
                                    <p className="font-medium text-neutral-950">Name</p>
                                    <p className="font-medium text-neutral-950">Value</p>
                                    <p className="font-medium text-neutral-950">TTL</p>

                                    {/* Record Row */}
                                    <p className="font-mono">CNAME</p>
                                    <p className="font-mono">{isSubdomain ? domain.domain.split('.')[0] : 'www'}</p>
                                    <p className="flex items-end gap-1 font-mono">
                                        cname.panaroid.com
                                        <button
                                            onClick={() => copyToClipboard('cname.panaroid.com', 'value')}
                                            className="relative group rounded-full p-1.5 transition-all duration-75 bg-transparent hover:bg-neutral-200 active:bg-neutral-300 -mb-0.5"
                                            type="button"
                                        >
                                            {copied === 'value' ? (
                                                <Check className="h-3.5 w-3.5 text-green-600" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </p>
                                    <p className="font-mono">86400</p>
                                </div>

                                {/* Info Note */}
                                <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <p className="text-sm">
                                        قد يستغرق انتشار DNS حتى 24 ساعة. بعد إضافة السجل، اضغط على "تحقق الآن".
                                    </p>
                                </div>

                                {/* Verify Button with color states */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={verifyState === 'verifying' || verifyState === 'success'}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            verifyState === 'idle' && "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                                            verifyState === 'verifying' && "bg-red-100 text-red-600 cursor-wait",
                                            verifyState === 'success' && "bg-green-100 text-green-600",
                                            verifyState === 'failed' && "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                        )}
                                    >
                                        {verifyState === 'success' ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4" />
                                                تم التحقق ✓
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className={cn("w-4 h-4", verifyState === 'verifying' && "animate-spin")} />
                                                {verifyState === 'verifying' ? 'جاري التحقق...' : 'تحقق الآن'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div >
    )
}
