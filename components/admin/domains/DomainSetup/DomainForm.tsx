"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select-shadcn"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus, Loader2 } from "lucide-react"

interface DomainFormProps {
    domain: string
    setDomain: (value: string) => void
    region: string
    setRegion: (value: string) => void
    onSubmit: () => void
    isLoading?: boolean
}

const regions = [
    { value: "us-east-1", label: "أمريكا الشمالية - فيرجينيا", flag: "🇺🇸" },
    { value: "eu-west-1", label: "أوروبا - أيرلندا", flag: "🇮🇪" },
    { value: "sa-east-1", label: "أمريكا الجنوبية - ساو باولو", flag: "🇧🇷" },
    { value: "ap-northeast-1", label: "آسيا - طوكيو", flag: "🇯🇵" },
]

export function DomainForm({ domain, setDomain, region, setRegion, onSubmit, isLoading }: DomainFormProps) {
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
                    النطاق
                </Label>
                <Input
                    id="domain"
                    placeholder="shop.example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="border-neutral-200 bg-white text-neutral-900 focus-visible:ring-[#FF6500]/20 focus-visible:border-[#FF6500] transition ease-in-out duration-200 placeholder:text-neutral-400 h-10 rounded-lg px-3 text-base sm:text-sm"
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

            <Button
                type="submit"
                className="bg-gradient-to-r from-[#FF6500] to-[#FF4F0F] text-white hover:from-[#FF4F0F] hover:to-[#E55500] font-semibold h-10 shadow-md"
                disabled={!domain || isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري الإضافة...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة نطاق
                    </>
                )}
            </Button>
        </form>
    )
}
