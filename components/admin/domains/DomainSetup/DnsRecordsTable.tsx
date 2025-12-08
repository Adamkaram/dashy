"use client"

import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { StatusBadge } from "../shared/StatusBadge"

interface DnsRecord {
    name: string
    type: string
    ttl: string
    value: string
    priority?: string
    status?: "pending" | "verified" | "failed"
}

interface DnsRecordsTableProps {
    title: string
    description: string
    records: DnsRecord[]
    badgeText: string
    showStatus?: boolean
    animationDelay?: number
}

export function DnsRecordsTable({
    title,
    description,
    records,
    badgeText,
    showStatus = false,
    animationDelay = 0,
}: DnsRecordsTableProps) {
    return (
        <div
            className="opacity-0 animate-[fadeInUp_0.6s_ease-out_both]"
            style={{ animationDelay: `${animationDelay}s` }}
        >
            <div className="flex items-center gap-3 mb-2">
                <h2 className="text-base font-bold flex items-center gap-2 text-slate-900">
                    {title}
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                </h2>
                <Badge
                    variant="outline"
                    className="inline-flex select-none items-center font-medium truncate text-slate-500 border-slate-300 bg-transparent text-xs h-6 px-2 rounded-sm"
                >
                    {badgeText}
                </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-4">{description}</p>

            <div
                className="overflow-x-auto opacity-0 animate-[fadeInUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${animationDelay + 0.2}s` }}
            >
                <table className="w-full border-separate border-spacing-0">
                    <thead className="h-10 rounded-md bg-slate-100">
                        <tr>
                            {showStatus && (
                                <>
                                    <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100 first:rounded-r-md">
                                        الحالة
                                    </th>
                                    <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100">
                                        الأولوية
                                    </th>
                                </>
                            )}
                            <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100">
                                القيمة
                            </th>
                            <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100">
                                مدة التخزين
                            </th>
                            <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100">
                                النوع
                            </th>
                            <th className="text-right text-xs font-semibold text-slate-600 p-3 bg-slate-100 last:rounded-l-md">
                                اسم السجل
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr
                                key={index}
                                className="opacity-0 animate-[fadeInUp_0.4s_ease-out_both]"
                                style={{ animationDelay: `${animationDelay + 0.4 + index * 0.1}s` }}
                            >
                                {showStatus && (
                                    <>
                                        <td className="p-3 border-b border-slate-200 text-sm">
                                            {record.status && <StatusBadge status={record.status} />}
                                        </td>
                                        <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700 text-center">
                                            {record.priority || "-"}
                                        </td>
                                    </>
                                )}
                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-600" dir="ltr">
                                    <span className="block max-w-[250px] truncate">{record.value}</span>
                                </td>
                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700 text-center">
                                    {record.ttl}
                                </td>
                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700 text-center">
                                    {record.type}
                                </td>
                                <td className="p-3 border-b border-slate-200 text-sm font-mono text-slate-700" dir="ltr">
                                    <span className="block max-w-[200px] truncate">{record.name}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

