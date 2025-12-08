"use client"

import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: "pending" | "verified" | "failed"
}

const statusConfig = {
    pending: {
        label: "قيد الانتظار",
        className: "bg-amber-100 text-amber-700 border-amber-200"
    },
    verified: {
        label: "مُفعّل",
        className: "bg-green-100 text-green-700 border-green-200"
    },
    failed: {
        label: "فشل",
        className: "bg-red-100 text-red-700 border-red-200"
    }
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status]

    return (
        <Badge
            variant="outline"
            className={`capitalize text-xs h-6 px-2 rounded-sm ${config.className}`}
        >
            {config.label}
        </Badge>
    )
}
