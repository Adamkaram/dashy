import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import { ReactNode, useState } from 'react';

export type PageContentHeaderProps = {
    title?: ReactNode;
    titleInfo?: string;
    controls?: ReactNode;
    headerContent?: ReactNode;
};

export function PageContentHeader({
    title,
    titleInfo,
    controls,
    headerContent,
}: PageContentHeaderProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const hasHeaderContent = !!(title || controls || headerContent);

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
                                <h1 className="min-w-0 text-lg font-semibold leading-7 text-neutral-900">
                                    {title}
                                </h1>
                                {titleInfo && (
                                    <div className="relative">
                                        <button
                                            className="text-neutral-500 hover:text-neutral-700 transition-colors"
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                        </button>
                                        {showTooltip && (
                                            <div className="absolute left-0 top-full mt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                                                <div className="rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white shadow-lg whitespace-nowrap">
                                                    {titleInfo}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
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
    );
}
