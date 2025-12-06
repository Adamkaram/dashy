'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function CheckoutResolver() {
    const { Checkout } = useThemeComponents();

    if (!Checkout) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checkout component not found for this theme</p>
            </div>
        );
    }

    return <Checkout />;
}
