
"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, LoaderCircle, Copy, Mail, Globe, ArrowLeft, RefreshCw } from "lucide-react"

interface DomainVerificationProps {
    domain: string
    region: string
}

export default function DomainVerification({ domain, region }: DomainVerificationProps) {
    const dkimSpfRecords = [
        {
            name: "send",
            type: "MX",
            ttl: "Auto",
            value: "feedback-smtp.eu-west-1.amazonses.com",
            priority: "10",
            status: "Pending",
        },
        {
            name: "send",
            type: "TXT",
            ttl: "Auto",
            value: "v=spf1 include:amazonses.com ~all",
            status: "Pending",
        },
        {
            name: "resend._domainkey",
            type: "TXT",
            ttl: "Auto",
            value:
                "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaiCa38mse02t+mrPfLvzb04EDP+9AUkV1ST8kiSPusW6Fg7aL34Zu+TUiXYuuLqBVgI66JoPGd6b3ia6mWwJprEssDra8sKr8LN2CdhzqsPiwIM9TJLiXcVrG/zWIVhisykEoiUPnXGymR+VEKGfqYLeuAA4hBi2RVgk7CErNNQIDAQAB",
            status: "Pending",
        },
    ]

    const dmarcRecords = [
        {
            name: "_dmarc",
            type: "TXT",
            ttl: "Auto",
            value: "v=DMARC1; p=none;",
        },
    ]

    return (
        <div className="min-h-full bg-white text-slate-900 pb-20">

            {/* Header */}
            <div className="flex flex-col pb-2 mx-auto w-full max-w-5xl px-6 py-8">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="relative shrink-0 flex items-center justify-center bg-yellow-50 rounded-2xl border border-yellow-100" style={{ width: "80px", height: "80px" }}>
                        <Globe className="w-10 h-10 text-yellow-500 animate-pulse" />
                    </div>
                    <div className="w-full overflow-hidden text-center md:text-left">
                        <span className="text-sm text-slate-500 font-semibold mb-1 block">Domain</span>
                        <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-slate-900 font-bold w-full truncate md:max-w-[800px]">
                            {domain || "ada.com"}
                        </h1>
                    </div>
                    <div className="flex-end flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="font-medium flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50">
                                <RefreshCw className="w-4 h-4 text-slate-500" />
                                Restart
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 items-start gap-12 pb-4 pt-10 md:flex md:gap-16">
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-500 text-xs uppercase font-semibold">Created</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-900 font-normal">
                                <time className="text-current">about 3 hours ago</time>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-20">
                        <label className="text-slate-500 text-xs uppercase font-semibold">Status</label>
                        <div className="flex items-center gap-2">
                            <Badge className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 text-xs h-6 px-2 rounded-sm capitalize">pending</Badge>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-500 text-xs uppercase font-semibold">Region</label>
                        <div className="flex items-center gap-2">
                            <img
                                alt="eu-west-1"
                                loading="lazy"
                                width="24"
                                height="18"
                                className="rounded-sm border border-slate-200"
                                src="/placeholder.svg?height=18&width=24"
                            />
                            <span className="text-sm text-slate-900 font-normal">
                                Ireland <span className="text-slate-500">(eu-west-1)</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto w-full max-w-full px-6 md:max-w-5xl py-8">
                {/* Warning Box */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 border border-yellow-200 bg-yellow-50/50 p-4 rounded-lg">
                        <span className="shrink-0 self-start text-yellow-600 mt-1">
                            <LoaderCircle className="shrink-0 animate-spin w-5 h-5" style={{ animationDuration: "3s" }} />
                        </span>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm text-slate-900 font-medium">Looking for DNS records in your domain provider...</p>
                            <span className="text-sm text-slate-500 font-normal">
                                It may take a few minutes or hours, depending on the DNS provider propagation time.
                            </span>
                        </div>
                    </div>
                </div>

                {/* DNS Records Section */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">DNS Records</h2>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                    Sign in to Cloudflare
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                    <Mail className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* DKIM and SPF Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                                    DKIM and SPF
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="inline-flex select-none items-center font-medium truncate text-slate-500 border-slate-200 bg-slate-50 text-xs h-6 px-2 rounded-sm"
                                >
                                    Required
                                </Badge>
                            </div>

                            <div className="overflow-x-auto rounded-md border border-slate-200">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Type
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Name
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Content
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                TTL
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Priority
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dkimSpfRecords.map((record, index) => (
                                            <tr key={index} className="last:border-0 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700">{record.type}</td>
                                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700">
                                                    <span className="block max-w-[150px] truncate" title={record.name}>{record.name}</span>
                                                </td>
                                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700">
                                                    <span className="block max-w-[200px] truncate" title={record.value}>{record.value}</span>
                                                </td>
                                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700">{record.ttl}</td>
                                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700">{record.priority || "-"}</td>
                                                <td className="p-3 border-b border-slate-200 text-sm">
                                                    <Badge className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100">{record.status}</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* DMARC Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                                    DMARC
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="inline-flex select-none items-center font-medium truncate text-slate-500 border-slate-200 bg-slate-50 text-xs h-6 px-2 rounded-sm"
                                >
                                    Recommended
                                </Badge>
                            </div>

                            <div className="overflow-x-auto rounded-md border border-slate-200">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                Type
                                            </th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">Name</th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">Content</th>
                                            <th className="text-left text-xs font-semibold text-slate-500 p-3 border-b border-slate-200">
                                                TTL
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dmarcRecords.map((record, index) => (
                                            <tr key={index} className="last:border-0 hover:bg-slate-50/50 transition-colors">
                                                <td className="p-3 text-sm font-mono border-b border-slate-200 text-slate-700">{record.type}</td>
                                                <td className="p-3 text-sm font-mono border-b border-slate-200 text-slate-700">
                                                    <span className="block max-w-[150px] truncate" title={record.name}>{record.name}</span>
                                                </td>
                                                <td className="p-3 text-sm font-mono border-b border-slate-200 text-slate-700">
                                                    <span className="block max-w-[200px] truncate" title={record.value}>{record.value}</span>
                                                </td>
                                                <td className="p-3 text-sm font-mono border-b border-slate-200 text-slate-700">{record.ttl}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
