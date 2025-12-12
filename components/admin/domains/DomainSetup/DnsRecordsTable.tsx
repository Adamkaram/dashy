"use client"

import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface DnsRecord {
    name: string
    type: string
    ttl: string
    value: string
}

const dkimSpfRecords: DnsRecord[] = [
    {
        name: "send",
        type: "MX",
        ttl: "تلقائي",
        value: "10 feedback-smtp.eu-west-1.amazonses.com",
    },
    {
        name: "send",
        type: "TXT",
        ttl: "تلقائي",
        value: "v=spf1 include:amazonses.com ~all",
    },
    {
        name: "resend._domainkey",
        type: "TXT",
        ttl: "تلقائي",
        value: "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDaiCa38mse...",
    },
]

const dmarcRecords: DnsRecord[] = [
    {
        name: "_dmarc",
        type: "TXT",
        ttl: "تلقائي",
        value: "v=DMARC1; p=none;",
    },
]

interface DnsRecordsTableProps {
    type: "dkim-spf" | "dmarc"
}

export function DnsRecordsTable({ type }: DnsRecordsTableProps) {
    const records = type === "dkim-spf" ? dkimSpfRecords : dmarcRecords

    return (
        <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full border-separate border-spacing-0">
                <thead className="h-10 rounded-md bg-neutral-50">
                    <tr>
                        <th className="text-right text-xs font-semibold text-neutral-500 p-3 bg-neutral-50 first:rounded-r-md">
                            اسم السجل
                        </th>
                        <th className="text-right text-xs font-semibold text-neutral-500 p-3 bg-neutral-50">
                            النوع
                        </th>
                        <th className="text-right text-xs font-semibold text-neutral-500 p-3 bg-neutral-50">
                            مدة التخزين
                        </th>
                        <th className="text-right text-xs font-semibold text-neutral-500 p-3 bg-neutral-50 last:rounded-l-md">
                            القيمة
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr
                            key={index}
                            className="opacity-0 animate-[fadeInUp_0.4s_ease-out_both] hover:bg-neutral-50 transition-colors"
                            style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                        >
                            <td className="p-3 border-b border-neutral-200 text-sm font-mono text-neutral-700" dir="ltr">
                                <span className="block max-w-[200px] truncate">{record.name}</span>
                            </td>
                            <td className="p-3 border-b border-neutral-200 text-sm font-mono text-neutral-700">{record.type}</td>
                            <td className="p-3 border-b border-neutral-200 text-sm font-mono text-neutral-700">{record.ttl}</td>
                            <td className="p-3 border-b border-neutral-200 text-sm font-mono text-neutral-700" dir="ltr">
                                <span className="block max-w-[200px] truncate">{record.value}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
