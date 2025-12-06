'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function CartResolver() {
    const { Cart } = useThemeComponents();

    if (!Cart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Cart component not found for this theme</p>
            </div>
        );
    }

    return <Cart />;
}
