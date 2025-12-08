"use client"

import { Button } from "@/components/ui/button"
import { StatusIcon } from "../shared/StatusIcon"
import { StatusBadge } from "../shared/StatusBadge"

interface VerificationHeaderProps {
    domain: string
    region: string
    status: "pending" | "verified" | "failed"
    createdAt?: string
}

const regionLabels: Record<string, { label: string; flag: string }> = {
    "us-east-1": { label: "أمريكا - فيرجينيا", flag: "🇺🇸" },
    "eu-west-1": { label: "أوروبا - أيرلندا", flag: "🇮🇪" },
    "sa-east-1": { label: "ساو باولو", flag: "🇧🇷" },
    "ap-northeast-1": { label: "طوكيو", flag: "🇯🇵" },
}

export function VerificationHeader({ domain, region, status, createdAt = "منذ 3 ساعات تقريبًا" }: VerificationHeaderProps) {
    const regionInfo = regionLabels[region] || { label: region, flag: "🌍" }

    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
            <div className="flex items-center gap-6">
                <StatusIcon color={status === "verified" ? "green" : "yellow"} size={80} />
                <div>
                    <p className="text-sm text-slate-500 mb-1">النطاق</p>
                    <h1 className="text-2xl font-bold text-slate-900" dir="ltr">{domain}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    إعادة التشغيل
                </Button>
                <Button variant="ghost" className="text-slate-500">
                    API
                </Button>
            </div>
        </div>
    )
}

export function DomainMeta({ region, status, createdAt }: { region: string; status: "pending" | "verified" | "failed"; createdAt: string }) {
    const regionInfo = regionLabels[region] || { label: region, flag: "🌍" }

    return (
        <div className="grid grid-cols-3 gap-6 mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
                <p className="text-xs text-slate-500 mb-1">تاريخ الإنشاء</p>
                <p className="text-sm text-slate-900">{createdAt}</p>
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-1">الحالة</p>
                <StatusBadge status={status} />
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-1">المنطقة</p>
                <p className="text-sm text-slate-900 flex items-center gap-2">
                    <span>{regionInfo.flag}</span>
                    <span>{regionInfo.label}</span>
                </p>
            </div>
        </div>
    )
}
