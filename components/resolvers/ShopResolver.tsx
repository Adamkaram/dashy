'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function ShopResolver() {
    const { Shop } = useThemeComponents();

    if (!Shop) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Shop component not found for this theme</p>
            </div>
        );
    }

    return <Shop />;
}
