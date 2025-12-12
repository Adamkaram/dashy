"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Globe, Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface AddDomainModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

type DomainStatus = 'idle' | 'checking' | 'available' | 'conflict' | 'error'

const STATUS_CONFIG: Record<DomainStatus, {
    message: string
    icon?: typeof CheckCircle2
    className: string
}> = {
    idle: {
        message: 'أدخل نطاق صالح للتحقق من توفره',
        className: 'bg-neutral-100 text-neutral-500',
    },
    checking: {
        message: 'جاري التحقق من توفر النطاق...',
        icon: Loader2,
        className: 'bg-blue-50 text-blue-600',
    },
    available: {
        message: 'النطاق متاح للاستخدام',
        icon: CheckCircle2,
        className: 'bg-green-50 text-green-600',
    },
    conflict: {
        message: 'هذا النطاق مستخدم بالفعل',
        icon: XCircle,
        className: 'bg-red-50 text-red-600',
    },
    error: {
        message: 'حدث خطأ أثناء التحقق',
        icon: AlertCircle,
        className: 'bg-amber-50 text-amber-600',
    },
}

// Simple domain validation
function isValidDomain(domain: string): boolean {
    const regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i
    return regex.test(domain)
}

export default function AddDomainModal({ isOpen, onClose, onSuccess }: AddDomainModalProps) {
    const [domain, setDomain] = useState('')
    const [status, setStatus] = useState<DomainStatus>('idle')
    const [isPending, startTransition] = useTransition()

    const handleDomainChange = (value: string) => {
        setDomain(value)
        if (!value) {
            setStatus('idle')
            return
        }

        if (isValidDomain(value)) {
            setStatus('checking')
            // Debounced check (in real app, would check against API)
            setTimeout(() => {
                setStatus('available')
            }, 800)
        } else {
            setStatus('idle')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (status !== 'available' || !domain) return

        startTransition(async () => {
            try {
                const res = await fetch('/api/admin/domains', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain }),
                })

                const data = await res.json()

                if (!res.ok) {
                    if (data.code === 'domain_exists') {
                        setStatus('conflict')
                        toast.error('هذا النطاق مضاف بالفعل')
                    } else {
                        toast.error(data.error || 'فشل في إضافة النطاق')
                    }
                    return
                }

                toast.success('تم إضافة النطاق بنجاح! يرجى إضافة سجل DNS للتحقق.')
                onSuccess()
                onClose()
                setDomain('')
                setStatus('idle')
            } catch (error) {
                toast.error('حدث خطأ أثناء إضافة النطاق')
            }
        })
    }

    const currentStatus = STATUS_CONFIG[status]
    const StatusIcon = currentStatus.icon

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-[#FF6500]/10 to-[#FF4F0F]/10 rounded-lg">
                                <Globe className="w-5 h-5 text-[#FF6500]" />
                            </div>
                            <h2 className="text-lg font-semibold text-neutral-900">إضافة نطاق</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 bg-neutral-50">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="domain" className="block text-sm font-medium text-neutral-700 mb-2">
                                    اسم النطاق
                                </label>
                                <div className={`rounded-xl p-1 transition-colors ${currentStatus.className}`}>
                                    <input
                                        id="domain"
                                        type="text"
                                        value={domain}
                                        onChange={(e) => handleDomainChange(e.target.value.toLowerCase())}
                                        placeholder="shop.example.com"
                                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#FF6500]/20 focus:border-[#FF6500] transition-all text-sm"
                                        dir="ltr"
                                        autoComplete="off"
                                        autoFocus
                                    />

                                    {/* Status Message */}
                                    <div className="flex items-center justify-between gap-3 p-2 text-sm">
                                        <p>
                                            {domain && status !== 'idle' && (
                                                <>
                                                    النطاق <strong className="font-semibold underline underline-offset-2" dir="ltr">{domain}</strong>{' '}
                                                </>
                                            )}
                                            {currentStatus.message.replace('النطاق', '')}
                                        </p>
                                        {StatusIcon && (
                                            <StatusIcon className={`w-5 h-5 shrink-0 ${status === 'checking' ? 'animate-spin' : ''}`} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="p-4 bg-white rounded-xl border border-neutral-200">
                                <p className="text-sm text-neutral-500">
                                    بعد إضافة النطاق، ستحتاج لإضافة سجل TXT في إعدادات DNS الخاصة بك للتحقق من الملكية.
                                    سيتم إصدار شهادة SSL تلقائياً بعد التحقق.
                                </p>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="sticky bottom-0 border-t border-neutral-200 bg-white px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="text-neutral-600 hover:text-neutral-900"
                            >
                                إلغاء
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={status !== 'available' || isPending}
                                className="bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white hover:from-[#FF4F0F] hover:to-[#E55500] font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                        جاري الإضافة...
                                    </>
                                ) : (
                                    'إضافة نطاق'
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
