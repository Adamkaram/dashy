"use client"

import { LoaderCircle } from "lucide-react"

interface WarningAlertProps {
    title: string
    description: string
}

export function WarningAlert({ title, description }: WarningAlertProps) {
    return (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <LoaderCircle className="w-5 h-5 text-yellow-500 mt-0.5 animate-spin" />
                <div>
                    <p className="text-yellow-800 font-medium text-sm">{title}</p>
                    <p className="text-yellow-700 text-sm mt-1">{description}</p>
                </div>
            </div>
        </div>
    )
}
