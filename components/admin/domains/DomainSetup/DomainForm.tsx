"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select-shadcn"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"

interface DomainFormProps {
    domain: string
    setDomain: (value: string) => void
    region: string
    setRegion: (value: string) => void
    onSubmit: () => void
}

const regions = [
    { value: "us-east-1", label: "أمريكا الشمالية - فيرجينيا", flag: "🇺🇸" },
    { value: "eu-west-1", label: "أوروبا - أيرلندا", flag: "🇮🇪" },
    { value: "sa-east-1", label: "أمريكا الجنوبية - ساو باولو", flag: "🇧🇷" },
    { value: "ap-northeast-1", label: "آسيا - طوكيو", flag: "🇯🇵" },
]

export function DomainForm({ domain, setDomain, region, setRegion, onSubmit }: DomainFormProps) {
    const selectedRegion = regions.find(r => r.value === region) || regions[1]

    return (
        <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
            }}
        >
            <div className="flex flex-col gap-2">
                <Label htmlFor="domain" className="text-slate-700 text-sm flex items-center">
                    الاسم
                </Label>
                <Input
                    id="domain"
                    placeholder="mail.example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="border-slate-300 bg-white text-slate-900 focus-visible:ring-slate-400 transition ease-in-out duration-200 placeholder:text-slate-400 h-10 rounded-md px-3 text-base sm:text-sm"
                    required
                    dir="ltr"
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="region" className="text-slate-700 text-sm flex items-center">
                    المنطقة
                </Label>
                <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="border-slate-300 bg-white text-slate-700 h-10">
                        <div className="flex items-center gap-2">
                            <span>{selectedRegion.flag}</span>
                            <span>{selectedRegion.label}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                        {regions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                                <div className="flex items-center gap-2">
                                    <span>{r.flag}</span>
                                    <span>{r.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-4">
                <details className="group">
                    <summary className="flex items-center gap-1 cursor-pointer">
                        <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" />
                        <span className="text-sm text-slate-500 hover:text-slate-700">خيارات متقدمة</span>
                    </summary>
                </details>
            </div>

            <Button
                type="submit"
                className="bg-slate-900 text-white hover:bg-slate-800 font-semibold h-10"
                disabled={!domain}
            >
                <Plus className="w-4 h-4 ml-2" />
                إضافة نطاق
            </Button>
        </form>
    )
}
