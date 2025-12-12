"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Mail } from "lucide-react"

import { VerificationHeader, DomainMeta } from "./VerificationHeader"
import { WarningAlert } from "./WarningAlert"
import { DnsRecordsTable } from "../DomainSetup/DnsRecordsTable"

interface DomainVerificationProps {
    domain: string
    region: string
}

export default function DomainVerification({ domain, region }: DomainVerificationProps) {
    const dkimSpfRecords = [
        {
            name: "send",
            type: "MX",
            ttl: "تلقائي",
            value: "feedback-smtp.eu-west-1.am...",
            priority: "10",
            status: "pending" as const,
        },
        {
            name: "send",
            type: "TXT",
            ttl: "تلقائي",
            value: "v=spf1 include:amazonses.co...",
            priority: "-",
            status: "pending" as const,
        },
        {
            name: "resend._domainkey",
            type: "TXT",
            ttl: "تلقائي",
            value: "p=MIGfMA0GCSqGSIb3DQE...",
            priority: "-",
            status: "pending" as const,
        },
    ]

    const dmarcRecords = [
        {
            name: "_dmarc",
            type: "TXT",
            ttl: "تلقائي",
            value: "v=DMARC1; p=none;",
        },
    ]

    return (
        <div className="min-h-screen bg-white text-slate-900" dir="rtl">
            <div className="mx-auto w-full max-w-5xl px-6 py-8">
                {/* Header */}
                <VerificationHeader
                    domain={domain}
                    region={region}
                    status="pending"
                />

                {/* Meta Info */}
                <DomainMeta
                    region={region}
                    status="pending"
                    createdAt="منذ 3 ساعات تقريبًا"
                />

                {/* Warning Alert */}
                <WarningAlert
                    title="جاري البحث عن سجلات DNS في مزود النطاق الخاص بك..."
                    description="قد يستغرق الأمر بضع دقائق أو ساعات، اعتمادًا على وقت انتشار DNS."
                />

                {/* DNS Records Section */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800">سجلات DNS</h2>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                تسجيل الدخول إلى Cloudflare
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <DnsRecordsTable
                        title="DKIM و SPF"
                        description="تفعيل توقيع البريد الإلكتروني وتحديد المرسلين المصرح لهم"
                        records={dkimSpfRecords}
                        badgeText="مطلوب"
                        showStatus={true}
                        animationDelay={0}
                    />

                    <div className="mt-8">
                        <DnsRecordsTable
                            title="DMARC"
                            description="إعداد سياسات المصادقة واستلام التقارير"
                            records={dmarcRecords}
                            badgeText="موصى به"
                            animationDelay={0.3}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
