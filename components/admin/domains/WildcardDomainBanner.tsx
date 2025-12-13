"use client"

import { useState } from "react"
import { Globe, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface WildcardDomainBannerProps {
    onLearnMore?: () => void
    onClaim?: () => void
    className?: string
}

export function WildcardDomainBanner({ onLearnMore, onClaim, className }: WildcardDomainBannerProps) {
    const [show, setShow] = useState(true)

    if (!show) return null

    return (
        <div className={cn(
            "relative isolate flex flex-col justify-between gap-3 overflow-hidden rounded-lg border border-sky-600/15 bg-gradient-to-r from-sky-100/80 to-indigo-100/80 py-3 pl-4 pr-12 sm:flex-row sm:items-center sm:py-2",
            className
        )}>
            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 -z-10 text-black/30 mix-blend-overlay [mask-image:linear-gradient(to_right,black,transparent)] md:[mask-image:linear-gradient(to_right,black_60%,transparent)]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' fill='none'%3E%3Cpath stroke='currentColor' stroke-opacity='.15' d='M0 0v13m13 0V0M0 0h13m0 13H0'/%3E%3C/svg%3E")`,
                    backgroundSize: '13px 13px',
                }}
            />

            <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-sky-600/50 bg-white/50 p-1 shadow-[inset_0_0_1px_1px_#fff] sm:block">
                    <Sparkles className="m-px size-4 text-sky-800" />
                </div>
                <p className="text-sm text-neutral-900">
                    Get a <span className="font-semibold">Free Wildcard Subdomain</span> on panaroid.com.{" "}
                    <button
                        onClick={onLearnMore}
                        className="text-neutral-700 underline transition-colors hover:text-black"
                    >
                        Learn more
                    </button>
                </p>
            </div>

            <div className="flex items-center sm:-my-1">
                <button
                    type="button"
                    className="whitespace-nowrap rounded-md border border-sky-700/50 px-3 py-1 text-sm text-neutral-800 transition-colors hover:bg-sky-500/10"
                    onClick={onClaim}
                >
                    Claim Subdomain
                </button>
            </div>

            <button
                type="button"
                className="absolute inset-y-0 right-2.5 p-1 text-sm text-sky-700 transition-colors hover:text-sky-900"
                onClick={() => setShow(false)}
            >
                <X className="size-[18px]" />
            </button>
        </div>
    )
}
