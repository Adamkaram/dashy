"use client"

import { ReactNode, useState } from "react"
import { HelpCircle, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

// Tooltip Component
interface TooltipProps {
    content: ReactNode | string
    children: ReactNode
    side?: "top" | "bottom" | "left" | "right"
    className?: string
}

export function Tooltip({ children, content, side = "bottom", className }: TooltipProps) {
    const [open, setOpen] = useState(false)

    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
                <TooltipPrimitive.Trigger
                    asChild
                    onClick={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                >
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        sideOffset={8}
                        side={side}
                        className={cn(
                            "animate-slide-up-fade pointer-events-auto z-[99] items-center overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm",
                            className
                        )}
                        collisionPadding={0}
                    >
                        {typeof content === "string" ? (
                            <div className="prose prose-sm prose-neutral max-w-xs text-pretty px-4 py-2 text-center leading-snug">
                                {content}
                            </div>
                        ) : (
                            content
                        )}
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    )
}

// InfoTooltip - Question mark icon with tooltip
interface InfoTooltipProps {
    content: ReactNode | string
    href?: string
}

export function InfoTooltip({ content, href }: InfoTooltipProps) {
    const tooltipContent = href ? (
        <div className="prose prose-sm prose-neutral max-w-xs text-pretty px-4 py-2 text-center leading-snug">
            {content}{" "}
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 underline decoration-dotted underline-offset-2 hover:text-black"
            >
                Learn more
            </a>
        </div>
    ) : content

    return (
        <Tooltip content={tooltipContent}>
            <button className="text-neutral-500 hover:text-neutral-700 transition-colors">
                <HelpCircle className="h-4 w-4" />
            </button>
        </Tooltip>
    )
}

// Page Header Component - Dub Style
export interface PageHeaderProps {
    title: string
    titleInfo?: {
        title: string
        href?: string
    }
    titleBackHref?: string
    controls?: ReactNode
    headerContent?: ReactNode
}

export function PageHeader({
    title,
    titleInfo,
    titleBackHref,
    controls,
    headerContent,
}: PageHeaderProps) {
    const hasHeaderContent = !!(title || controls || headerContent)

    return (
        <div className={cn("border-neutral-200", hasHeaderContent && "border-b")}>
            <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-6">
                <div
                    className={cn(
                        "flex h-12 items-center justify-between gap-4",
                        hasHeaderContent ? "sm:h-16" : "sm:h-0"
                    )}
                >
                    <div className="flex min-w-0 items-center gap-4">
                        {title && (
                            <div className="flex min-w-0 items-center gap-2">
                                {titleBackHref && (
                                    <Link
                                        href={titleBackHref}
                                        className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </Link>
                                )}
                                {/* Tooltip appears FIRST in RTL */}
                                {titleInfo && (
                                    <InfoTooltip
                                        content={titleInfo.title}
                                        href={titleInfo.href}
                                    />
                                )}
                                <h1 className="min-w-0 text-lg font-semibold leading-7 text-neutral-900">
                                    {title}
                                </h1>
                            </div>
                        )}
                    </div>
                    {controls && (
                        <div className="flex items-center gap-2">{controls}</div>
                    )}
                </div>
                {headerContent && <div className="pb-3 pt-1">{headerContent}</div>}
            </div>
        </div>
    )
}
