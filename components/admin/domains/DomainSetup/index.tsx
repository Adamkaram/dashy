"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink, ArrowRight, Globe, Loader2, Copy, CheckCircle2 } from "lucide-react"
import { DomainForm } from "./DomainForm"
import DomainVerification from "../DomainVerification"
import { toast } from "sonner"

interface DomainSetupProps {
    onCancel?: () => void
    onSuccess?: () => void
}

interface VerificationInfo {
    record_type: string
    record_name: string
    record_value: string
    instructions: string
}

interface DomainResponse {
    domain: {
        id: string
        domain: string
        type: string
        verified: boolean
        verification_token: string
    }
    verification_info?: VerificationInfo
}

export default function DomainSetup({ onCancel, onSuccess }: DomainSetupProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [domain, setDomain] = useState("")
    const [region, setRegion] = useState("eu-west-1")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [domainData, setDomainData] = useState<DomainResponse | null>(null)
    const [verifying, setVerifying] = useState(false)
    const [verified, setVerified] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [showVerification, setShowVerification] = useState(false)
    const dnsRecordsRef = useRef<HTMLDivElement>(null)

    const handleAddDomain = async () => {
        if (!domain) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/domains', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain }),
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'فشل في إضافة النطاق')
                return
            }

            setDomainData(data)
            setIsSubmitted(true)
            setCurrentStep(2)
            toast.success('تم إضافة النطاق بنجاح!')

            setTimeout(() => {
                dnsRecordsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }, 800)
        } catch (error) {
            toast.error('حدث خطأ أثناء إضافة النطاق')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!domainData?.domain?.id) return

        setVerifying(true)
        try {
            const response = await fetch(`/api/admin/domains/${domainData.domain.id}/verify`, {
                method: 'POST',
            })

            const data = await response.json()

            if (data.verified) {
                setVerified(true)
                toast.success('تم التحقق من النطاق بنجاح! شهادة SSL يتم إصدارها...')
                onSuccess?.()
            } else {
                // Show verification pending page
                setShowVerification(true)
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء التحقق')
        } finally {
            setVerifying(false)
        }
    }

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text)
        setCopiedField(field)
        toast.success('تم النسخ!')
        setTimeout(() => setCopiedField(null), 2000)
    }

    // Show verification pending page
    if (showVerification) {
        return <DomainVerification domain={domain} region={region} />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-white text-neutral-900"
            dir="rtl"
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-6 md:flex-row mx-auto w-full max-w-5xl px-6 py-8">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6500]/20 to-[#FF4F0F]/20 rounded-2xl blur-xl scale-150" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#FF6500] to-[#FF4F0F] rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="w-full overflow-hidden text-center md:text-right">
                    <h1 className="text-2xl font-bold text-neutral-900">إضافة نطاق</h1>
                    <span className="text-sm text-neutral-500 font-medium">استخدم نطاقًا مخصصًا لمتجرك مع SSL تلقائي</span>
                </div>

                {onCancel && (
                    <div className="mr-auto self-start md:self-center">
                        <Button
                            variant="ghost"
                            onClick={onCancel}
                            className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            العودة للنطاقات
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="mx-auto w-full max-w-full px-6 md:max-w-5xl">
                <div className="relative max-w-[820px] py-12 sm:mr-10">
                    {/* Vertical Line */}
                    <div className="absolute top-0 h-full w-px right-0 bg-neutral-200">
                        {isSubmitted && (
                            <>
                                <motion.div
                                    className="absolute top-0 w-1 -right-[1px] h-32 bg-gradient-to-b from-[#FF6500] via-[#FF4F0F] to-transparent rounded-full"
                                    initial={{ y: 0, opacity: 0 }}
                                    animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                />
                                <motion.div
                                    className="absolute top-0 w-px right-0 bg-[#FF6500]"
                                    initial={{ height: 0 }}
                                    animate={{ height: "100%" }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                />
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        {/* Step 1: Domain */}
                        <div className="relative pr-6 transition duration-200 ease-in-out max-w-[30rem]">
                            <motion.div
                                className="bg-white absolute -right-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full ring-4 ring-white"
                                animate={isSubmitted ? { boxShadow: ["0 0 0 0 rgba(255, 101, 0, 0)", "0 0 0 8px rgba(255, 101, 0, 0.3)", "0 0 0 0 rgba(255, 101, 0, 0)"] } : {}}
                                transition={{ duration: 1, delay: 0.1 }}
                            >
                                <div className="m-auto h-3 w-3 rounded-full transition duration-200 ease-in-out flex items-center justify-center">
                                    {isSubmitted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                            className="w-full h-full rounded-full bg-[#FF6500] flex items-center justify-center"
                                        >
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </motion.div>
                                    ) : (
                                        <div className="w-full h-full rounded-full border-2 border-neutral-300" />
                                    )}
                                </div>
                            </motion.div>

                            <div className={`rounded-xl p-0.5 transition duration-200 ease-in-out ${isSubmitted ? "bg-gradient-to-l from-[#FF6500]/20 via-white to-white" : ""}`}>
                                <div className="bg-white rounded-[10px] shadow-sm border border-neutral-200">
                                    <motion.div
                                        className={`rounded-[10px] p-6 ${isSubmitted ? "bg-gradient-to-l from-[#FF6500]/10 via-[#FF6500]/5 to-transparent" : "bg-white"}`}
                                        animate={isSubmitted ? { scale: [1, 1.02, 1] } : {}}
                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl tracking-[-0.16px] font-bold mb-1 text-neutral-800">النطاق</h3>
                                            {isSubmitted && (
                                                <motion.div className="-mt-1" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
                                                    <Check className="w-4 h-4 text-[#FF6500]" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-500 font-normal mb-6">أدخل النطاق المخصص الذي تريد ربطه</p>
                                        {!isSubmitted ? (
                                            <DomainForm
                                                domain={domain}
                                                setDomain={setDomain}
                                                region={region}
                                                setRegion={setRegion}
                                                onSubmit={handleAddDomain}
                                                isLoading={isLoading}
                                            />
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    className="text-neutral-600 border-neutral-200 bg-neutral-50 h-10 rounded-lg px-3 text-sm w-full select-none appearance-none border outline-none cursor-default"
                                                    readOnly
                                                    type="text"
                                                    value={domain}
                                                    dir="ltr"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: DNS Verification */}
                        <div
                            ref={dnsRecordsRef}
                            className={`relative pr-6 transition duration-200 ease-in-out ${!isSubmitted ? "pointer-events-none select-none opacity-50" : ""}`}
                        >
                            <motion.div
                                className="bg-white absolute -right-[10px] top-7 z-10 h-[21px] w-[21px] flex rounded-full ring-4 ring-white"
                                animate={isSubmitted ? { boxShadow: ["0 0 0 0 rgba(255, 101, 0, 0)", "0 0 0 8px rgba(255, 101, 0, 0.2)", "0 0 0 0 rgba(255, 101, 0, 0)"] } : {}}
                                transition={{ duration: 1, delay: 1.2 }}
                            >
                                <motion.div
                                    className="m-auto h-3 w-3 rounded-full border-2 transition duration-200 ease-in-out"
                                    animate={isSubmitted ? { borderColor: ["#d1d5db", "#FF6500", "#FF6500"] } : {}}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    style={{ borderColor: isSubmitted ? "#FF6500" : "#d1d5db" }}
                                />
                            </motion.div>

                            <div className="rounded-xl p-0.5 transition duration-200 ease-in-out">
                                <div className="bg-white rounded-[10px] shadow-sm border border-neutral-200">
                                    <div className="rounded-[10px] p-6">
                                        <div className="flex-1 flex justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl tracking-[-0.16px] font-bold mb-1 text-neutral-800">التحقق من DNS</h3>
                                                {verified && (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                )}
                                            </div>
                                        </div>

                                        {isSubmitted && domainData?.verification_info && (
                                            <div className="animate-[slideInUp_0.8s_ease-out_0.3s_both]">
                                                {/* TXT Record Section */}
                                                <div className="mt-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_both]">
                                                    <p className="text-sm text-neutral-500 mb-4">
                                                        أضف سجل TXT التالي في إعدادات DNS الخاصة بنطاقك:
                                                    </p>

                                                    {/* DNS Record Table */}
                                                    <div className="border border-neutral-200 rounded-lg overflow-hidden" dir="ltr">
                                                        <table className="w-full text-sm table-fixed">
                                                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                                                <tr>
                                                                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 w-[70px]">النوع</th>
                                                                    <th className="text-left px-4 py-3 font-semibold text-neutral-600 w-[180px]">الاسم</th>
                                                                    <th className="text-left px-4 py-3 font-semibold text-neutral-600">القيمة</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td className="px-4 py-3 align-middle">
                                                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md border border-neutral-300 bg-white text-xs font-medium text-neutral-700">
                                                                            TXT
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-sm text-neutral-700 align-middle">
                                                                        {domainData.verification_info.record_name}
                                                                    </td>
                                                                    <td className="px-4 py-3 align-middle">
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => copyToClipboard(domainData.verification_info!.record_value, 'value')}
                                                                                className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors shrink-0"
                                                                            >
                                                                                {copiedField === 'value' ? (
                                                                                    <Check className="w-4 h-4 text-green-500" />
                                                                                ) : (
                                                                                    <Copy className="w-4 h-4 text-neutral-400" />
                                                                                )}
                                                                            </button>
                                                                            <span className="font-mono text-sm text-neutral-700 truncate">
                                                                                {domainData.verification_info.record_value}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Info */}
                                                    <p className="text-xs text-neutral-400 mt-3">
                                                        قد يستغرق انتشار DNS حتى 24 ساعة. بعد التحقق، سيتم إصدار شهادة SSL تلقائياً.
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="mt-8 flex gap-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_both]">
                                                    <Button
                                                        className="bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white hover:from-[#FF4F0F] hover:to-[#E55500] font-semibold shadow-md"
                                                        onClick={handleVerify}
                                                        disabled={verifying || verified}
                                                    >
                                                        {verifying ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                                                جاري التحقق...
                                                            </>
                                                        ) : verified ? (
                                                            <>
                                                                <CheckCircle2 className="w-4 h-4 ml-2" />
                                                                تم التحقق
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check className="w-4 h-4 ml-2" />
                                                                تحقق الآن
                                                            </>
                                                        )}
                                                    </Button>
                                                    {onCancel && (
                                                        <Button
                                                            variant="ghost"
                                                            className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                                                            onClick={onCancel}
                                                        >
                                                            إلغاء
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
