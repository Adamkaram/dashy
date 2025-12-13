"use client"

import { Search, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRef, useCallback, useEffect, forwardRef, useImperativeHandle, useState } from "react"

interface SearchBoxProps {
    value: string
    loading?: boolean
    showClearButton?: boolean
    onChange: (value: string) => void
    onChangeDebounced?: (value: string) => void
    debounceTimeoutMs?: number
    inputClassName?: string
    placeholder?: string
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
    (
        {
            value,
            loading,
            showClearButton = true,
            onChange,
            onChangeDebounced,
            debounceTimeoutMs = 500,
            inputClassName,
            placeholder,
        },
        forwardedRef
    ) => {
        const inputRef = useRef<HTMLInputElement>(null)
        const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

        useImperativeHandle(forwardedRef, () => inputRef.current!)

        const debouncedChange = useCallback((val: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
            debounceTimerRef.current = setTimeout(() => {
                onChangeDebounced?.(val)
            }, debounceTimeoutMs)
        }, [onChangeDebounced, debounceTimeoutMs])

        // Keyboard shortcut: "/" to focus
        const onKeyDown = useCallback((e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (
                e.key === "/" &&
                target.tagName !== "INPUT" &&
                target.tagName !== "TEXTAREA"
            ) {
                e.preventDefault()
                inputRef.current?.focus()
            } else if (e.key === "Escape") {
                inputRef.current?.blur()
            }
        }, [])

        useEffect(() => {
            document.addEventListener("keydown", onKeyDown)
            return () => document.removeEventListener("keydown", onKeyDown)
        }, [onKeyDown])

        return (
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {loading && value.length > 0 ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                    ) : (
                        <Search className="h-4 w-4 text-neutral-400" />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className={cn(
                        "peer w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-9 text-sm text-neutral-900 outline-none placeholder:text-neutral-400",
                        "transition-all focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100",
                        inputClassName
                    )}
                    placeholder={placeholder || "Search..."}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        debouncedChange(e.target.value)
                    }}
                    autoCapitalize="none"
                />
                {showClearButton && value.length > 0 && (
                    <button
                        onClick={() => {
                            onChange("")
                            onChangeDebounced?.("")
                        }}
                        className="pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        )
    }
)

SearchBox.displayName = "SearchBox"

// Simple version without URL persistence for DomainsPage
export function DomainSearchBox({
    value,
    onChange,
    loading,
    placeholder = "Search domains...",
    className,
}: {
    value: string
    onChange: (value: string) => void
    loading?: boolean
    placeholder?: string
    className?: string
}) {
    return (
        <div className={cn("w-full sm:w-auto sm:min-w-[280px]", className)}>
            <SearchBox
                value={value}
                onChange={onChange}
                loading={loading}
                placeholder={placeholder}
            />
        </div>
    )
}
