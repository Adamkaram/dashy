"use client"

import { Search, ChevronDown, Plus, Download, Code } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import DomainSetup from "./DomainSetup"

export default function DomainsPage() {
    const [showAddDomain, setShowAddDomain] = useState(false)

    if (showAddDomain) {
        return <DomainSetup onCancel={() => setShowAddDomain(false)} />
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-slate-900">النطاقات</h1>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setShowAddDomain(true)}
                        className="font-semibold inline-flex items-center justify-center border select-none relative cursor-pointer transition ease-in-out duration-200 bg-black text-white hover:bg-black/90 text-sm h-8 px-3 rounded-xl gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        إضافة نطاق
                    </Button>
                    <button className="inline-flex items-center justify-center border select-none relative cursor-pointer transition ease-in-out duration-200 bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-normal text-sm h-8 px-3 rounded-xl gap-1 pl-2.5 pr-1.5">
                        <Code className="h-4 w-4 text-cyan-500" />
                        <span>API</span>
                        <span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">A</span>
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="بحث..."
                        className="pl-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-400 h-9"
                    />
                </div>

                {/* Status Dropdown */}
                <button className="flex items-center justify-between gap-8 px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 min-w-[160px] h-9">
                    <span>جميع الحالات</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Region Dropdown */}
                <button className="flex items-center justify-between gap-8 px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 min-w-[160px] h-9">
                    <span>جميع المناطق</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* Download Button */}
                <button className="p-2 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 h-9 w-9 flex items-center justify-center">
                    <Download className="h-4 w-4" />
                </button>
            </div>

            {/* Empty State Card */}
            <div className="flex h-80 flex-col items-center justify-center gap-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex max-w-md flex-col gap-2 text-center">
                    <h2 className="text-xl tracking-[-0.16px] text-slate-900 font-bold">لا توجد نطاقات بعد</h2>
                    <span className="text-sm text-slate-500 font-normal text-balance break-words hyphens-auto">
                        تحقق من نطاقك عن طريق إضافة سجل DNS وابدأ في إرسال واستقبال رسائل البريد الإلكتروني من عنوانك الخاص
                    </span>
                    <div className="flex flex-row items-center justify-center gap-2 mt-4">
                        <Button
                            onClick={() => setShowAddDomain(true)}
                            className="font-semibold inline-flex items-center justify-center border select-none relative cursor-pointer transition ease-in-out duration-200 bg-black text-white hover:bg-black/90 text-sm h-8 px-3 rounded-xl gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            إضافة نطاق
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
