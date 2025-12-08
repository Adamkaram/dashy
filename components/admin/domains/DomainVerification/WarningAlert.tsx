"use client"

import { AlertTriangle, LoaderCircle } from "lucide-react"

interface WarningAlertProps {
    title: string
    description: string
}

export function WarningAlert({ title, description }: WarningAlertProps) {
    return (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <LoaderCircle className="w-5 h-5 text-amber-600 mt-0.5 animate-spin" />
                <div>
                    <p className="text-amber-900 font-medium text-sm">{title}</p>
                    <p className="text-amber-700 text-sm mt-1">{description}</p>
                </div>
            </div>
        </div>
    )
}
