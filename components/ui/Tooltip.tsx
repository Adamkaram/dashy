"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import { ReactNode, useState } from "react";

export function TooltipProvider({ children }: { children: ReactNode }) {
    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            {children}
        </TooltipPrimitive.Provider>
    );
}

export interface TooltipProps
    extends Omit<TooltipPrimitive.TooltipContentProps, "content"> {
    content:
    | ReactNode
    | string
    | ((props: { setOpen: (open: boolean) => void }) => ReactNode);
    contentClassName?: string;
    disabled?: boolean;
    disableHoverableContent?: TooltipPrimitive.TooltipProps["disableHoverableContent"];
    delayDuration?: TooltipPrimitive.TooltipProps["delayDuration"];
}

export function Tooltip({
    children,
    content,
    contentClassName,
    disabled,
    side = "left", // RTL: default to left
    disableHoverableContent,
    delayDuration = 0,
    ...rest
}: TooltipProps) {
    const [open, setOpen] = useState(false);

    return (
        <TooltipPrimitive.Root
            open={disabled ? false : open}
            onOpenChange={setOpen}
            delayDuration={delayDuration}
            disableHoverableContent={disableHoverableContent}
        >
            <TooltipPrimitive.Trigger
                asChild
                onClick={() => {
                    setOpen(true);
                }}
                onBlur={() => {
                    setOpen(false);
                }}
            >
                {children}
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    sideOffset={8}
                    side={side}
                    className="animate-slide-up-fade pointer-events-auto z-[99] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                    collisionPadding={8}
                    {...rest}
                >
                    {typeof content === "string" ? (
                        <div className={`max-w-xs px-4 py-2 text-sm text-gray-700 leading-relaxed ${contentClassName || ""}`}>
                            {content}
                        </div>
                    ) : typeof content === "function" ? (
                        content({ setOpen })
                    ) : (
                        content
                    )}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}

export function TooltipContent({
    title,
    cta,
    href,
    target,
    onClick,
}: {
    title: string;
    cta?: string;
    href?: string;
    target?: string;
    onClick?: () => void;
}) {
    return (
        <div className="flex max-w-xs flex-col items-center space-y-3 p-4 text-center">
            <p className="text-sm text-gray-700 leading-relaxed">{title}</p>
            {cta &&
                (href ? (
                    <a
                        href={href}
                        {...(target ? { target } : {})}
                        className="flex h-8 w-full items-center justify-center whitespace-nowrap rounded-lg border bg-[#FF4F0F] text-white px-4 text-sm hover:bg-[#FF4F0F] transition-colors"
                    >
                        {cta}
                    </a>
                ) : onClick ? (
                    <button
                        onClick={onClick}
                        className="flex h-8 w-full items-center justify-center whitespace-nowrap rounded-lg border bg-[#FF4F0F] text-white px-4 text-sm hover:bg-[#FF4F0F] transition-colors"
                    >
                        {cta}
                    </button>
                ) : null)}
        </div>
    );
}

export function InfoTooltip(props: Omit<TooltipProps, "children">) {
    return (
        <Tooltip {...props}>
            <HelpCircle className="h-4 w-4 text-gray-500 hover:text-gray-700 transition-colors cursor-help" />
        </Tooltip>
    );
}

export function DynamicTooltipWrapper({
    children,
    tooltipProps,
}: {
    children: ReactNode;
    tooltipProps?: TooltipProps;
}) {
    return tooltipProps ? (
        <Tooltip {...tooltipProps}>
            <div>{children}</div>
        </Tooltip>
    ) : (
        children
    );
}
