"use client";

import { useThemeComponents } from "@/lib/theme/ThemeComponentProvider";

export default function CheckoutResolver() {
    const { Checkout } = useThemeComponents();

    if (Checkout) {
        return <Checkout />;
    }

    return (
        <div className="container mx-auto p-4 text-center">
            <p>Checkout component not found for this theme.</p>
        </div>
    );
}
