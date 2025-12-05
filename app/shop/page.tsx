'use client';

import { useThemeComponents } from '@/lib/theme/ThemeComponentProvider';

export default function ShopPageRoute() {
    const { Shop } = useThemeComponents();

    if (Shop) {
        return <Shop />;
    }

    return (
        <div className="container mx-auto p-4 text-center">
            <p>Shop component not found for this theme.</p>
        </div>
    );
}
